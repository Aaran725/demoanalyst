import { dataPoint, unavailable, type AnnualFigure, type DataPoint } from "./types";
import { resolveCompany, fetchEdgarFinancials, fetchSicDescription, type CompanyIdentity, type EdgarFinancials } from "./sec-edgar";
import { fetchMarketQuote } from "./market-data";

/**
 * Turns raw EDGAR + market data into the metrics every engine (Business
 * Quality, Money Machine, Valuation) actually needs — computed once, here,
 * in plain arithmetic. AI agents are given these numbers as ALREADY-COMPUTED
 * facts and asked to explain/narrate them, not to do the math themselves.
 * This is deliberate: LLMs are unreliable at multi-step arithmetic, and a
 * financial research product cannot afford a hallucinated margin.
 */

function latest(series: AnnualFigure[]): AnnualFigure | null {
  return series.length ? series[series.length - 1] : null;
}
function prior(series: AnnualFigure[], yearsBack: number): AnnualFigure | null {
  if (series.length <= yearsBack) return null;
  return series[series.length - 1 - yearsBack];
}
function pct(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator === 0) return null;
  return numerator / denominator;
}
function growthRate(curr: number | null, prev: number | null): number | null {
  if (curr === null || prev === null || prev === 0) return null;
  return curr / prev - 1;
}
function cagr(curr: number | null, past: number | null, years: number): number | null {
  if (curr === null || past === null || past <= 0 || curr <= 0) return null;
  return Math.pow(curr / past, 1 / years) - 1;
}

function seriesPoint(
  series: AnnualFigure[],
  dataType: string,
  sourceUrl: string,
  offset = 0
): DataPoint<number | null> {
  const idx = series.length - 1 - offset;
  const fig = idx >= 0 ? series[idx] : null;
  if (!fig) return unavailable(dataType, "No SEC filing value available for this period.");
  return dataPoint(fig.value, {
    source: `SEC EDGAR XBRL — ${fig.form} FY${fig.fiscalYear}`,
    sourceUrl,
    reportingPeriod: `FY${fig.fiscalYear} (ended ${fig.periodEnd})`,
    publishedAt: fig.filedAt,
    confidence: "verified",
    dataType,
  });
}

function derivedPoint(
  value: number | null,
  dataType: string,
  note: string,
  reportingPeriod?: string
): DataPoint<number | null> {
  if (value === null) return unavailable(dataType, `Could not compute ${dataType}: ${note}`);
  return dataPoint(value, {
    source: "AARAN AI calculation from SEC EDGAR verified inputs",
    confidence: "estimate",
    dataType,
    reportingPeriod,
    note,
  });
}

export interface FinancialMetrics {
  revenueGrowthYoY: DataPoint<number | null>;
  revenueCagr3y: DataPoint<number | null>;
  revenueCagr5y: DataPoint<number | null>;
  epsGrowthYoY: DataPoint<number | null>;
  grossMargin: DataPoint<number | null>;
  operatingMargin: DataPoint<number | null>;
  netMargin: DataPoint<number | null>;
  fcf: DataPoint<number | null>;
  fcfMargin: DataPoint<number | null>;
  fcfConversion: DataPoint<number | null>;
  roe: DataPoint<number | null>;
  roic: DataPoint<number | null>;
  netDebt: DataPoint<number | null>;
  debtToEquity: DataPoint<number | null>;
  peRatio: DataPoint<number | null>;
  psRatio: DataPoint<number | null>;
  pbRatio: DataPoint<number | null>;
  evToSales: DataPoint<number | null>;
  evToEbitdaApprox: DataPoint<number | null>;
  fcfYield: DataPoint<number | null>;
}

export interface FinancialBundle {
  identity: CompanyIdentity;
  sicDescription: string | null;
  asOf: string;
  edgar: EdgarFinancials;
  price: DataPoint<number | null>;
  marketCap: DataPoint<number | null>;
  enterpriseValue: DataPoint<number | null>;
  metrics: FinancialMetrics;
}

export async function buildFinancialBundle(ticker: string): Promise<FinancialBundle | null> {
  const identity = await resolveCompany(ticker);
  if (!identity) return null;

  const [edgar, quote, sicDescription] = await Promise.all([
    fetchEdgarFinancials(identity),
    fetchMarketQuote(ticker),
    fetchSicDescription(identity.cik),
  ]);
  if (!edgar) return null;

  const url = edgar.companyFactsUrl;
  const rev = edgar.revenue;
  const ni = edgar.netIncome;
  const gp = edgar.grossProfit;
  const opInc = edgar.operatingIncome;
  const ocf = edgar.operatingCashFlow;
  const capex = edgar.capex;
  const eps = edgar.epsDiluted;

  const latestRevenue = latest(rev)?.value ?? null;
  const revenue1yAgo = prior(rev, 1)?.value ?? null;
  const revenue3yAgo = prior(rev, 3)?.value ?? null;
  const revenue5yAgo = prior(rev, 5)?.value ?? null;
  const latestNetIncome = latest(ni)?.value ?? null;
  const netIncome1yAgo = prior(ni, 1)?.value ?? null;
  const latestGrossProfit = gp.length ? latest(gp)?.value ?? null : null;
  const latestOperatingIncome = latest(opInc)?.value ?? null;
  const latestOcf = latest(ocf)?.value ?? null;
  const latestCapex = latest(capex)?.value ?? null;
  const latestEps = latest(eps)?.value ?? null;
  const epsPrior = prior(eps, 1)?.value ?? null;

  const cash = edgar.latestCash.value;
  const ltDebt = edgar.latestLongTermDebt.value ?? 0;
  const curDebt = edgar.latestCurrentDebt.value ?? 0;
  const totalDebt = (edgar.latestLongTermDebt.value !== null || edgar.latestCurrentDebt.value !== null)
    ? ltDebt + curDebt
    : null;
  const equity = edgar.latestStockholdersEquity.value;
  const shares = edgar.latestSharesOutstanding.value;

  const price = quote.price.value;
  const marketCap = price !== null && shares !== null ? price * shares : null;
  const netDebt = totalDebt !== null && cash !== null ? totalDebt - cash : null;
  const enterpriseValue = marketCap !== null && netDebt !== null ? marketCap + netDebt : null;

  const fcf = latestOcf !== null && latestCapex !== null ? latestOcf - Math.abs(latestCapex) : null;
  const roicNumerator =
    latestOperatingIncome !== null ? latestOperatingIncome * (1 - 0.21) : null; // 21% flat statutory-rate approximation, not the effective tax rate
  const investedCapital = equity !== null && totalDebt !== null && cash !== null ? equity + totalDebt - cash : null;

  const metrics: FinancialMetrics = {
    revenueGrowthYoY: derivedPoint(
      growthRate(latestRevenue, revenue1yAgo),
      "revenue_growth_yoy",
      "Latest fiscal year revenue vs. prior fiscal year revenue, both from 10-K filings."
    ),
    revenueCagr3y: derivedPoint(
      cagr(latestRevenue, revenue3yAgo, 3),
      "revenue_cagr_3y",
      "Compound annual growth rate over the trailing 3 fiscal years of filed revenue."
    ),
    revenueCagr5y: derivedPoint(
      cagr(latestRevenue, revenue5yAgo, 5),
      "revenue_cagr_5y",
      "Compound annual growth rate over the trailing 5 fiscal years of filed revenue."
    ),
    epsGrowthYoY: derivedPoint(
      growthRate(latestEps, epsPrior),
      "eps_growth_yoy",
      "Diluted EPS, latest fiscal year vs. prior fiscal year, both from 10-K filings."
    ),
    grossMargin: derivedPoint(
      pct(latestGrossProfit, latestRevenue),
      "gross_margin",
      "Gross profit ÷ revenue, latest fiscal year. Gross profit as tagged by the company; not recomputed from cost of revenue if not separately reported."
    ),
    operatingMargin: derivedPoint(
      pct(latestOperatingIncome, latestRevenue),
      "operating_margin",
      "Operating income ÷ revenue, latest fiscal year."
    ),
    netMargin: derivedPoint(pct(latestNetIncome, latestRevenue), "net_margin", "Net income ÷ revenue, latest fiscal year."),
    fcf: derivedPoint(fcf, "free_cash_flow", "Operating cash flow − capital expenditures, latest fiscal year."),
    fcfMargin: derivedPoint(pct(fcf, latestRevenue), "fcf_margin", "Free cash flow ÷ revenue, latest fiscal year."),
    fcfConversion: derivedPoint(
      pct(fcf, latestNetIncome),
      "fcf_conversion",
      "Free cash flow ÷ net income. Below ~80% sustained is a common earnings-quality flag."
    ),
    roe: derivedPoint(pct(latestNetIncome, equity), "roe", "Net income ÷ latest stockholders' equity (point-in-time, not averaged)."),
    roic: derivedPoint(
      pct(roicNumerator, investedCapital),
      "roic",
      "Approximation: operating income × (1 − 21% flat statutory tax rate) ÷ (debt + equity − cash). Not the company's effective tax rate; treat as directional, not precise."
    ),
    netDebt: derivedPoint(netDebt, "net_debt", "Total debt (long-term + current) − cash and equivalents."),
    debtToEquity: derivedPoint(pct(totalDebt, equity), "debt_to_equity", "Total debt ÷ stockholders' equity."),
    peRatio: derivedPoint(
      price !== null && latestEps !== null && latestEps !== 0 ? price / latestEps : null,
      "pe_ratio",
      "Share price ÷ trailing diluted EPS from the latest 10-K (not forward/adjusted EPS)."
    ),
    psRatio: derivedPoint(pct(marketCap, latestRevenue), "ps_ratio", "Market capitalization ÷ trailing fiscal-year revenue."),
    pbRatio: derivedPoint(pct(marketCap, equity), "pb_ratio", "Market capitalization ÷ latest stockholders' equity."),
    evToSales: derivedPoint(pct(enterpriseValue, latestRevenue), "ev_to_sales", "Enterprise value ÷ trailing fiscal-year revenue."),
    evToEbitdaApprox: derivedPoint(
      pct(enterpriseValue, latestOperatingIncome),
      "ev_to_ebitda_approx",
      "Enterprise value ÷ operating income, used as an EBITDA proxy since depreciation & amortization is not separately extracted. Treat as approximate."
    ),
    fcfYield: derivedPoint(pct(fcf, marketCap), "fcf_yield", "Free cash flow ÷ market capitalization."),
  };

  return {
    identity,
    sicDescription,
    asOf: new Date().toISOString(),
    edgar,
    price: quote.price,
    marketCap:
      marketCap !== null
        ? dataPoint(marketCap, {
            source: "AARAN AI calculation: price × shares outstanding",
            confidence: "estimate",
            dataType: "market_cap",
            note: "Price is an EOD quote; shares outstanding is from the latest SEC filing — the two may be from slightly different dates.",
          })
        : unavailable("market_cap", "Missing price or shares outstanding."),
    enterpriseValue:
      enterpriseValue !== null
        ? dataPoint(enterpriseValue, {
            source: "AARAN AI calculation: market cap + net debt",
            confidence: "estimate",
            dataType: "enterprise_value",
          })
        : unavailable("enterprise_value", "Missing market cap or net debt inputs."),
    metrics,
  };
}

export { seriesPoint };
