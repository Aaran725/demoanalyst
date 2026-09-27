import type { FinancialBundle } from "../data/company-financials";
import type { FinancialSnapshot } from "./company-schemas";

/** Bridges the real data layer (lib/data/) into the shape every AI prompt reads (see lib/ai/prompts/company/shared.ts). */
export function buildFinancialSnapshot(bundle: FinancialBundle): FinancialSnapshot {
  const metrics: FinancialSnapshot["metrics"] = {};
  for (const dp of Object.values(bundle.metrics)) {
    metrics[dp.dataType] = { value: dp.value, confidence: dp.confidence, source: dp.source, note: dp.note };
  }

  const revenueHistory = bundle.edgar.revenue.map((r) => ({ fiscalYear: r.fiscalYear, value: r.value }));
  const netIncomeHistory = bundle.edgar.netIncome.map((r) => ({ fiscalYear: r.fiscalYear, value: r.value }));

  const ocfByYear = new Map(bundle.edgar.operatingCashFlow.map((r) => [r.fiscalYear, r.value]));
  const capexByYear = new Map(bundle.edgar.capex.map((r) => [r.fiscalYear, r.value]));
  const fcfYears = [...new Set([...ocfByYear.keys(), ...capexByYear.keys()])].sort((a, b) => a - b);
  const fcfHistory = fcfYears.map((fiscalYear) => ({
    fiscalYear,
    operatingCashFlow: ocfByYear.get(fiscalYear) ?? null,
    capex: capexByYear.get(fiscalYear) ?? null,
  }));

  const latestRev = bundle.edgar.revenue[bundle.edgar.revenue.length - 1];
  const latestNi = bundle.edgar.netIncome[bundle.edgar.netIncome.length - 1];
  const latestEps = bundle.edgar.epsDiluted[bundle.edgar.epsDiluted.length - 1];

  return {
    companyName: bundle.identity.name,
    ticker: bundle.identity.ticker,
    cik: bundle.identity.cik,
    sector: bundle.sicDescription,
    price: bundle.price.value,
    priceAsOf: bundle.price.reportingPeriod ?? null,
    priceSource: bundle.price.source,
    marketCap: bundle.marketCap.value,
    revenueLatest: latestRev?.value ?? null,
    revenueFiscalYear: latestRev?.fiscalYear ?? null,
    netIncomeLatest: latestNi?.value ?? null,
    epsLatest: latestEps?.value ?? null,
    metrics,
    revenueHistory,
    netIncomeHistory,
    fcfHistory,
  };
}
