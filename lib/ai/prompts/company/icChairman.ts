import { buildCompanySystemPrompt, describeFinancials } from "./shared";
import type {
  FinancialSnapshot,
  BusinessQuality,
  MoneyMachine,
  ValuationEngine,
  MoatEngine,
  CeoPromiseTracker,
  InstitutionalIntelligence,
  BullCase,
  BearCase,
  JudgeVerdict,
} from "../../company-schemas";

/**
 * IcChairmanAgent — the final step. Synthesizes every specialist's
 * independent research into the Investment View and the Investment
 * Committee Memo. Never emotionally attached to any single agent's
 * conclusion — must weigh the Judge's verdict, not just average the bull
 * and bear cases.
 */
export function buildIcChairmanPrompt(
  snapshot: FinancialSnapshot,
  businessQuality: BusinessQuality,
  moneyMachine: MoneyMachine,
  valuation: ValuationEngine,
  moat: MoatEngine,
  ceoPromiseTracker: CeoPromiseTracker,
  institutional: InstitutionalIntelligence,
  bull: BullCase,
  bear: BearCase,
  judge: JudgeVerdict
) {
  const system = buildCompanySystemPrompt(`
You are the IC Chairman. You have ten specialists' independent research
below. Synthesize it into one Investment View and one Investment Committee
Memo. You are not the average of the bull and bear case — weigh the actual
evidence quality (see the Judge's classification) and the real financial
data, and reach your own view.

"view" must be one of: "buy_range" (durable business, price reasonable
relative to its economics), "hold_watch" (good business, valuation already
demanding, or meaningful unresolved questions), "reduce_sell_review"
(deteriorating fundamentals, or valuation far ahead of realistic scenarios).

baseCaseLow/High, bullCaseValue, bearCaseValue are YOUR price-target
estimates (tag as your own model output, not a promise) — ground them in
the reverse DCF and price-opportunity-zone data in the valuation research,
and in the actual historical growth/margin trend, not vibes.

NEVER state or imply certainty about future price. Always write whyNarrative
in a register like: "the underlying business remains X, but today's
valuation already assumes Y" — explain the tension between quality and
price, don't just declare a verdict.

upgradeConditions/downgradeConditions must be specific and falsifiable
(e.g. "revenue growth reaccelerates above 15%", not "if things improve").
`);

  const user = `
${describeFinancials(snapshot)}

BUSINESS QUALITY: ${JSON.stringify(businessQuality)}
MONEY MACHINE: ${JSON.stringify(moneyMachine)}
VALUATION: ${JSON.stringify(valuation)}
MOAT: ${JSON.stringify(moat)}
CEO PROMISE TRACKER: ${JSON.stringify(ceoPromiseTracker)}
INSTITUTIONAL INTELLIGENCE: ${JSON.stringify(institutional)}
BULL CASE: ${JSON.stringify(bull)}
BEAR CASE: ${JSON.stringify(bear)}
JUDGE VERDICT: ${JSON.stringify(judge)}

Respond with ONLY a JSON object with exactly these keys:
{
  "investmentView": {
    "view": "buy_range"|"hold_watch"|"reduce_sell_review",
    "baseCaseLow": number|null,
    "baseCaseHigh": number|null,
    "bullCaseValue": number|null,
    "bearCaseValue": number|null,
    "timeHorizon": string,
    "confidenceLevel": "high"|"medium"|"low",
    "businessQuality": "strong"|"mixed"|"weak",
    "financialQuality": "strong"|"mixed"|"weak",
    "valuationRisk": "low"|"moderate"|"high"|"extreme",
    "earningsQuality": "strong"|"mixed"|"weak",
    "moatDirection": "strengthening"|"stable"|"weakening",
    "managementExecution": "strong"|"mixed"|"weak",
    "expectationRisk": "low"|"moderate"|"high"|"extreme",
    "whyNarrative": string
  },
  "icMemo": {
    "executiveSummary": string,
    "investmentThesis": string,
    "businessQualitySummary": string,
    "financialQualitySummary": string,
    "valuationSummary": string,
    "managementSummary": string,
    "moatSummary": string,
    "institutionalActivitySummary": string,
    "positiveCatalysts": [{"description": string, "timing": string, "confidence": "verified"|"estimate"|"consensus"|"inference"|"unverified"}],
    "negativeCatalysts": [{"description": string, "timing": string, "confidence": "verified"|"estimate"|"consensus"|"inference"|"unverified"}],
    "risks": string[],
    "bullCaseSummary": string,
    "baseCaseSummary": string,
    "bearCaseSummary": string,
    "marketExpectationsSummary": string,
    "upgradeConditions": string[],
    "downgradeConditions": string[],
    "criticalUnknowns": string[],
    "sources": [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}]
  }
}
`.trim();

  return { system, user };
}
