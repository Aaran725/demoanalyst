import { dataPoint, unavailable, type AnnualFigure, type DataPoint } from "./types";

/**
 * SEC EDGAR adapter — the only "verified" tier data source in this app that
 * needs zero API key and zero cost. Everything here is real: no invented
 * numbers, no synthetic filings. If EDGAR doesn't have it, we say so.
 *
 * SEC requires every request to carry an identifying User-Agent
 * (https://www.sec.gov/os/webmaster-faq#developers). Set SEC_EDGAR_USER_AGENT
 * in .env.local to your own "AppName contact@email.com" — a reasonable
 * default is used otherwise so the app still works out of the box.
 */
const USER_AGENT =
  process.env.SEC_EDGAR_USER_AGENT || "AARAN-AI-Research contact@aaranai.app";

const EDGAR_HEADERS = {
  "User-Agent": USER_AGENT,
  "Accept-Encoding": "gzip, deflate",
};

let tickerToCikCache: Map<string, { cik: string; title: string }> | null = null;
let tickerToCikCacheAt = 0;
const TICKER_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // company_tickers.json changes rarely

async function fetchTickerMap(): Promise<Map<string, { cik: string; title: string }>> {
  if (tickerToCikCache && Date.now() - tickerToCikCacheAt < TICKER_CACHE_TTL_MS) {
    return tickerToCikCache;
  }
  const res = await fetch("https://www.sec.gov/files/company_tickers.json", {
    headers: EDGAR_HEADERS,
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`SEC ticker map fetch failed: ${res.status}`);
  const raw = (await res.json()) as Record<
    string,
    { cik_str: number; ticker: string; title: string }
  >;
  const map = new Map<string, { cik: string; title: string }>();
  for (const entry of Object.values(raw)) {
    map.set(entry.ticker.toUpperCase(), {
      cik: String(entry.cik_str).padStart(10, "0"),
      title: entry.title,
    });
  }
  tickerToCikCache = map;
  tickerToCikCacheAt = Date.now();
  return map;
}

export interface CompanyIdentity {
  ticker: string;
  cik: string;
  name: string;
}

const sicCache = new Map<string, { sicDescription: string | null; at: number }>();

/** Fetches the company's SEC-registered industry (SIC) description — real classification, not a guess. */
export async function fetchSicDescription(cik: string): Promise<string | null> {
  const cached = sicCache.get(cik);
  if (cached && Date.now() - cached.at < FACTS_CACHE_TTL_MS) return cached.sicDescription;
  try {
    const res = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
      headers: EDGAR_HEADERS,
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { sicDescription?: string };
    const sicDescription = data.sicDescription ?? null;
    sicCache.set(cik, { sicDescription, at: Date.now() });
    return sicDescription;
  } catch {
    return null;
  }
}

/** Resolves a ticker to its SEC CIK + registered company name. Real lookup, no guessing. */
export async function resolveCompany(ticker: string): Promise<CompanyIdentity | null> {
  try {
    const map = await fetchTickerMap();
    const hit = map.get(ticker.trim().toUpperCase());
    if (!hit) return null;
    return { ticker: ticker.trim().toUpperCase(), cik: hit.cik, name: hit.title };
  } catch {
    return null;
  }
}

interface XbrlFact {
  fy: number;
  fp: string;
  form: string;
  filed: string;
  end: string;
  val: number;
  accn: string;
}

interface CompanyFactsResponse {
  entityName: string;
  facts: {
    "us-gaap"?: Record<string, { units: Record<string, XbrlFact[]> }>;
    dei?: Record<string, { units: Record<string, XbrlFact[]> }>;
  };
}

const factsCache = new Map<string, { data: CompanyFactsResponse; at: number }>();
const FACTS_CACHE_TTL_MS = 60 * 60 * 1000;

async function fetchCompanyFacts(cik: string): Promise<CompanyFactsResponse | null> {
  const cached = factsCache.get(cik);
  if (cached && Date.now() - cached.at < FACTS_CACHE_TTL_MS) return cached.data;
  try {
    const res = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
      headers: EDGAR_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as CompanyFactsResponse;
    factsCache.set(cik, { data, at: Date.now() });
    return data;
  } catch {
    return null;
  }
}

/**
 * XBRL tag synonyms — different companies (and different years) tag the same
 * economic concept differently. We try each in order and use the first that
 * has data. This is the single biggest source of "why is this field empty"
 * bugs in EDGAR integrations, so the list is intentionally generous.
 */
const TAGS = {
  revenue: [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "RevenueFromContractWithCustomerIncludingAssessedTax",
    "Revenues",
    "SalesRevenueNet",
  ],
  costOfRevenue: ["CostOfRevenue", "CostOfGoodsAndServicesSold", "CostOfGoodsSold"],
  grossProfit: ["GrossProfit"],
  rnd: ["ResearchAndDevelopmentExpense"],
  operatingIncome: ["OperatingIncomeLoss"],
  netIncome: ["NetIncomeLoss", "ProfitLoss"],
  epsDiluted: ["EarningsPerShareDiluted"],
  epsBasic: ["EarningsPerShareBasic"],
  operatingCashFlow: [
    "NetCashProvidedByUsedInOperatingActivities",
    "NetCashProvidedByUsedInOperatingActivitiesContinuingOperations",
  ],
  capex: [
    "PaymentsToAcquirePropertyPlantAndEquipment",
    "PaymentsForCapitalImprovements",
    "PaymentsToAcquireProductiveAssets",
  ],
  cash: [
    "CashAndCashEquivalentsAtCarryingValue",
    "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents",
  ],
  longTermDebt: ["LongTermDebtNoncurrent", "LongTermDebt"],
  currentDebt: ["LongTermDebtCurrent", "ShortTermBorrowings", "DebtCurrent"],
  stockholdersEquity: ["StockholdersEquity", "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest"],
  sharesOutstanding: ["CommonStockSharesOutstanding"],
  stockCompensation: ["ShareBasedCompensation"],
  totalAssets: ["Assets"],
} as const;

type MetricKey = keyof typeof TAGS;

function dedupeAnnual(facts: XbrlFact[]): AnnualFigure[] {
  const byFy = new Map<number, XbrlFact>();
  for (const f of facts) {
    if (!f.fy || f.form !== "10-K") continue;
    const existing = byFy.get(f.fy);
    if (!existing || new Date(f.filed) > new Date(existing.filed)) byFy.set(f.fy, f);
  }
  return [...byFy.values()]
    .sort((a, b) => a.fy - b.fy)
    .map((f) => ({
      fiscalYear: f.fy,
      periodEnd: f.end,
      value: f.val,
      filedAt: f.filed,
      accessionNumber: f.accn,
      form: f.form,
    }));
}

function extractAnnualSeries(
  companyFacts: CompanyFactsResponse,
  metric: MetricKey
): { series: AnnualFigure[]; tagUsed: string } | null {
  for (const tag of TAGS[metric]) {
    const concept = companyFacts.facts["us-gaap"]?.[tag];
    if (!concept) continue;
    const unitKey = metric === "sharesOutstanding" ? "shares" : metric.startsWith("eps") ? "USD/shares" : "USD";
    const facts = concept.units[unitKey] || concept.units.USD || concept.units.shares;
    if (!facts?.length) continue;
    const series = dedupeAnnual(facts);
    if (series.length > 0) return { series, tagUsed: tag };
  }
  return null;
}

/** Latest single instant value for balance-sheet-style concepts (10-K or 10-Q, most recent filed). */
function extractLatestInstant(
  companyFacts: CompanyFactsResponse,
  metric: MetricKey
): { value: number; end: string; filed: string; tagUsed: string; form: string } | null {
  for (const tag of TAGS[metric]) {
    const concept = companyFacts.facts["us-gaap"]?.[tag];
    if (!concept) continue;
    const unitKey = metric === "sharesOutstanding" ? "shares" : "USD";
    const facts = concept.units[unitKey];
    if (!facts?.length) continue;
    const latest = [...facts]
      .filter((f) => f.form === "10-K" || f.form === "10-Q")
      .sort((a, b) => new Date(b.end).getTime() - new Date(a.end).getTime())[0];
    if (latest) {
      return { value: latest.val, end: latest.end, filed: latest.filed, tagUsed: tag, form: latest.form };
    }
  }
  return null;
}

export interface EdgarFinancials {
  identity: CompanyIdentity;
  companyFactsUrl: string;
  revenue: AnnualFigure[];
  costOfRevenue: AnnualFigure[];
  grossProfit: AnnualFigure[];
  rnd: AnnualFigure[];
  operatingIncome: AnnualFigure[];
  netIncome: AnnualFigure[];
  epsDiluted: AnnualFigure[];
  operatingCashFlow: AnnualFigure[];
  capex: AnnualFigure[];
  stockCompensation: AnnualFigure[];
  latestCash: DataPoint<number | null>;
  latestLongTermDebt: DataPoint<number | null>;
  latestCurrentDebt: DataPoint<number | null>;
  latestStockholdersEquity: DataPoint<number | null>;
  latestSharesOutstanding: DataPoint<number | null>;
  latestTotalAssets: DataPoint<number | null>;
}

/**
 * Pulls everything the Business Quality / Money Machine / Valuation engines
 * need from one company's SEC filings. Returns null only if EDGAR has no
 * record of this CIK at all (never fabricates a partial result).
 */
export async function fetchEdgarFinancials(identity: CompanyIdentity): Promise<EdgarFinancials | null> {
  const companyFacts = await fetchCompanyFacts(identity.cik);
  if (!companyFacts) return null;

  const companyFactsUrl = `https://data.sec.gov/api/xbrl/companyfacts/CIK${identity.cik}.json`;
  const filingUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${identity.cik}&type=10-K`;

  const revenueSeries = extractAnnualSeries(companyFacts, "revenue");
  const costOfRevenueSeries = extractAnnualSeries(companyFacts, "costOfRevenue");
  const grossProfitSeries = extractAnnualSeries(companyFacts, "grossProfit");
  const rndSeries = extractAnnualSeries(companyFacts, "rnd");
  const operatingIncomeSeries = extractAnnualSeries(companyFacts, "operatingIncome");
  const netIncomeSeries = extractAnnualSeries(companyFacts, "netIncome");
  const epsSeries = extractAnnualSeries(companyFacts, "epsDiluted") ?? extractAnnualSeries(companyFacts, "epsBasic");
  const ocfSeries = extractAnnualSeries(companyFacts, "operatingCashFlow");
  const capexSeries = extractAnnualSeries(companyFacts, "capex");
  const sbcSeries = extractAnnualSeries(companyFacts, "stockCompensation");

  const cash = extractLatestInstant(companyFacts, "cash");
  const ltDebt = extractLatestInstant(companyFacts, "longTermDebt");
  const curDebt = extractLatestInstant(companyFacts, "currentDebt");
  const equity = extractLatestInstant(companyFacts, "stockholdersEquity");
  const shares = extractLatestInstant(companyFacts, "sharesOutstanding");
  const assets = extractLatestInstant(companyFacts, "totalAssets");

  const mk = (m: ReturnType<typeof extractLatestInstant>, dataType: string): DataPoint<number | null> =>
    m
      ? dataPoint(m.value, {
          source: `SEC EDGAR XBRL — ${m.form} (${m.tagUsed})`,
          sourceUrl: companyFactsUrl,
          reportingPeriod: m.end,
          publishedAt: m.filed,
          confidence: "verified",
          dataType,
        })
      : unavailable(dataType, `No ${dataType} tag found in this company's EDGAR XBRL facts.`);

  return {
    identity,
    companyFactsUrl,
    revenue: revenueSeries?.series ?? [],
    costOfRevenue: costOfRevenueSeries?.series ?? [],
    grossProfit: grossProfitSeries?.series ?? [],
    rnd: rndSeries?.series ?? [],
    operatingIncome: operatingIncomeSeries?.series ?? [],
    netIncome: netIncomeSeries?.series ?? [],
    epsDiluted: epsSeries?.series ?? [],
    operatingCashFlow: ocfSeries?.series ?? [],
    capex: capexSeries?.series ?? [],
    stockCompensation: sbcSeries?.series ?? [],
    latestCash: mk(cash, "cash"),
    latestLongTermDebt: mk(ltDebt, "long_term_debt"),
    latestCurrentDebt: mk(curDebt, "current_debt"),
    latestStockholdersEquity: mk(equity, "stockholders_equity"),
    latestSharesOutstanding: mk(shares, "shares_outstanding"),
    latestTotalAssets: mk(assets, "total_assets"),
  };
}
