import { z } from "zod";
import type { AIProvider } from "./provider";
import { callAgent } from "./callAgent";
import type { CompanyProgressStep } from "./company-progress";
import { buildFinancialBundle } from "../data/company-financials";
import { computeReverseDcf, computePriceZones } from "../data/valuation-models";
import { getInstitutionalIntelligence } from "../data/institutional-intelligence";
import { buildFinancialSnapshot } from "./build-financial-snapshot";
import {
  businessQualitySchema,
  moneyMachineSchema,
  valuationEngineSchema,
  moatEngineSchema,
  ceoPromiseTrackerSchema,
  bullCaseSchema,
  bearCaseSchema,
  judgeVerdictSchema,
  investmentViewSchema,
  companyIcMemoSchema,
  type FullCompanyAnalysis,
  type ValuationEngine,
} from "./company-schemas";
import { buildBusinessQualityPrompt } from "./prompts/company/businessQuality";
import { buildMoneyMachinePrompt } from "./prompts/company/moneyMachine";
import { buildValuationPrompt } from "./prompts/company/valuation";
import { buildMoatPrompt } from "./prompts/company/moat";
import { buildCeoPromiseTrackerPrompt } from "./prompts/company/ceoPromiseTracker";
import { buildBullPrompt } from "./prompts/company/bull";
import { buildBearPrompt } from "./prompts/company/bear";
import { buildJudgePrompt } from "./prompts/company/judge";
import { buildIcChairmanPrompt } from "./prompts/company/icChairman";

/** Thrown when SEC EDGAR has no record of the ticker — a distinct, user-facing case from a generic pipeline failure. */
export class CompanyNotFoundError extends Error {
  constructor(public ticker: string) {
    super(`"${ticker}" was not found in SEC EDGAR. AARAN AI's live public-equity engine currently covers US SEC filers — check the ticker symbol.`);
    this.name = "CompanyNotFoundError";
  }
}

const icChairmanOutputSchema = z.object({
  investmentView: investmentViewSchema,
  icMemo: companyIcMemoSchema.omit({ generatedAt: true }),
});

/**
 * The AARAN AI public-equity Investment Committee pipeline.
 * ------------------------------------------------------------
 * Round 0: real data only (SEC EDGAR + market quote) — no AI, no cost.
 * Round 1 (parallel): Fundamental (Business Quality), Forensic Accountant
 *          (Money Machine), Innovation & Moat, Management (CEO Promise
 *          Tracker) — Institutional Intelligence is deterministic, not AI.
 * Round 2: Valuation — waits for nothing else, but its numeric fields
 *          (reverse DCF, price zones) are computed in code FIRST and
 *          handed to the agent to narrate, then re-applied verbatim after.
 * Round 3 (parallel): Bull, Bear — need Round 1 + Round 2 output.
 * Round 4: Fact Checker (Judge) — needs Bull + Bear.
 * Round 5: IC Chairman — needs everything; produces the Investment View
 *          and the final Investment Committee Memo in one call.
 */
export async function runCompanyAnalysisPipeline(
  provider: AIProvider,
  ticker: string,
  onProgress?: (step: CompanyProgressStep) => void,
  signal?: AbortSignal
): Promise<FullCompanyAnalysis> {
  onProgress?.("fetching_filings");
  const bundle = await buildFinancialBundle(ticker);
  if (!bundle) throw new CompanyNotFoundError(ticker);

  const snapshot = buildFinancialSnapshot(bundle);

  onProgress?.("fundamental");
  onProgress?.("forensic_accountant");
  onProgress?.("moat");
  onProgress?.("management");
  onProgress?.("institutional");

  const institutional = getInstitutionalIntelligence(false);

  const [businessQuality, moneyMachine, moat, ceoPromiseTracker] = await Promise.all([
    callAgent(provider, "BusinessQualityAgent", businessQualitySchema, ...toArgs(buildBusinessQualityPrompt(snapshot)), signal),
    callAgent(provider, "MoneyMachineAgent", moneyMachineSchema, ...toArgs(buildMoneyMachinePrompt(snapshot)), signal),
    callAgent(provider, "MoatAgent", moatEngineSchema, ...toArgs(buildMoatPrompt(snapshot)), signal, true),
    callAgent(provider, "CeoPromiseTrackerAgent", ceoPromiseTrackerSchema, ...toArgs(buildCeoPromiseTrackerPrompt(snapshot)), signal, true),
  ]);

  onProgress?.("valuation");
  const sharesOutstanding = bundle.edgar.latestSharesOutstanding.value;
  const fcfValue = bundle.metrics.fcf.value;
  const fcfPerShare = fcfValue !== null && sharesOutstanding ? fcfValue / sharesOutstanding : null;
  const reverseDcfResult = computeReverseDcf({
    enterpriseValue: bundle.enterpriseValue.value,
    latestRevenue: snapshot.revenueLatest,
    fcfMargin: bundle.metrics.fcfMargin.value,
    operatingMarginPct: bundle.metrics.operatingMargin.value,
  });
  const priceZonesResult = computePriceZones(fcfPerShare);

  const valuationRaw = await callAgent(
    provider,
    "ValuationAgent",
    valuationEngineSchema,
    ...toArgs(buildValuationPrompt(snapshot, reverseDcfResult, priceZonesResult)),
    signal
  );
  // Numeric fields are always overwritten with the deterministic calculation —
  // see lib/data/valuation-models.ts. Only narrative text from the agent survives.
  const valuation: ValuationEngine = {
    ...valuationRaw,
    reverseDcf: {
      impliedRevenueGrowthPct: reverseDcfResult.impliedRevenueGrowthPct,
      impliedOperatingMarginPct: reverseDcfResult.impliedOperatingMarginPct,
      impliedTerminalGrowthPct: reverseDcfResult.impliedTerminalGrowthPct,
      yearsModeled: reverseDcfResult.yearsModeled,
      assumptionsNarrative: valuationRaw.reverseDcf.assumptionsNarrative,
      methodologyNote: reverseDcfResult.methodologyNote,
    },
    priceOpportunityZones: priceZonesResult.map((zone, i) => ({
      zone: zone.zone,
      rangeLow: zone.rangeLow,
      rangeHigh: zone.rangeHigh,
      rationale: valuationRaw.priceOpportunityZones[i]?.rationale ?? "DATA NOT AVAILABLE",
    })),
  };

  onProgress?.("bull");
  onProgress?.("bear");
  const [bull, bear] = await Promise.all([
    callAgent(provider, "BullAgent", bullCaseSchema, ...toArgs(buildBullPrompt(snapshot, businessQuality, moat, valuation)), signal),
    callAgent(
      provider,
      "BearAgent",
      bearCaseSchema,
      ...toArgs(buildBearPrompt(snapshot, businessQuality, moneyMachine, moat, valuation)),
      signal
    ),
  ]);

  onProgress?.("fact_checker");
  const judge = await callAgent(provider, "JudgeAgent", judgeVerdictSchema, ...toArgs(buildJudgePrompt(bull, bear)), signal);

  onProgress?.("ic_chairman");
  const chairman = await callAgent(
    provider,
    "IcChairmanAgent",
    icChairmanOutputSchema,
    ...toArgs(
      buildIcChairmanPrompt(snapshot, businessQuality, moneyMachine, valuation, moat, ceoPromiseTracker, institutional, bull, bear, judge)
    ),
    signal
  );

  onProgress?.("done");

  return {
    id: crypto.randomUUID(),
    input: { ticker: bundle.identity.ticker },
    isDemoData: false,
    createdAt: new Date().toISOString(),
    financials: snapshot,
    businessQuality,
    moneyMachine,
    valuation,
    investmentView: chairman.investmentView,
    moat,
    ceoPromiseTracker,
    institutional,
    bull,
    bear,
    judge,
    icMemo: { ...chairman.icMemo, generatedAt: new Date().toISOString() },
  };
}

/** callAgent takes (system, user) as separate args, but every prompt builder here returns { system, user }. */
function toArgs(prompt: { system: string; user: string }): [string, string] {
  return [prompt.system, prompt.user];
}
