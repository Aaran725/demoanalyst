/**
 * Public-equity data primitives.
 * ---------------------------------
 * Every number that ends up on a company dashboard is wrapped in a
 * DataPoint so the UI always knows exactly where it came from, how old it
 * is, and how much to trust it. This is the equivalent of `Claim` in
 * lib/ai/schemas.ts, but for the public-markets side of the app, which
 * uses the 5-tier confidence scale from the product spec instead of the
 * startup side's 4-tier evidence scale (they answer different questions —
 * see ConfidenceTier below).
 */

/**
 * 🟢 verified   — read directly from a primary source (SEC filing, exchange feed)
 * 🟡 estimate   — AARAN AI's own calculation/model (e.g. reverse DCF, ROIC)
 * 🔵 consensus  — an external analyst consensus figure
 * 🟠 inference  — a logical interpretation, not a hard number or fact
 * 🔴 unverified — could not be confirmed; shown instead of ever guessing
 */
export type ConfidenceTier = "verified" | "estimate" | "consensus" | "inference" | "unverified";

export interface DataPoint<T> {
  value: T;
  /** Human-readable source name, e.g. "SEC EDGAR XBRL — 10-K" */
  source: string;
  sourceUrl?: string;
  /** e.g. "FY2024" or "Q2 2025" */
  reportingPeriod?: string;
  /** When the underlying filing/data was published */
  publishedAt?: string;
  /** When AARAN AI fetched this value */
  retrievedAt: string;
  confidence: ConfidenceTier;
  /** e.g. "revenue", "eps_diluted", "reverse_dcf_growth" */
  dataType: string;
  /** Methodology note — shown when the user clicks the confidence badge */
  note?: string;
}

export function dataPoint<T>(
  value: T,
  opts: Omit<DataPoint<T>, "value" | "retrievedAt">
): DataPoint<T> {
  return { value, retrievedAt: new Date().toISOString(), ...opts };
}

/** The "we looked, we could not establish this" value — never fabricated. */
export function unavailable(dataType: string, note?: string): DataPoint<null> {
  return {
    value: null,
    source: "Not available",
    retrievedAt: new Date().toISOString(),
    confidence: "unverified",
    dataType,
    note: note ?? "DATA NOT AVAILABLE — no reliable source returned a value.",
  };
}

export interface AnnualFigure {
  fiscalYear: number;
  periodEnd: string;
  value: number;
  filedAt: string;
  accessionNumber: string;
  form: string;
}
