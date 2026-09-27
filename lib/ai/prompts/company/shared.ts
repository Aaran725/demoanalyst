import type { FinancialSnapshot } from "../../company-schemas";

/**
 * Shared rules every public-equity agent follows — the equivalent of
 * lib/ai/prompts/shared.ts for the startup side, but built around the
 * 5-tier confidence scale (verified/estimate/consensus/inference/unverified)
 * instead of the startup side's 4-tier evidence scale, and around a bundle
 * of REAL pre-fetched SEC EDGAR numbers instead of open-ended research.
 */

export const COMPANY_CORE_RULES = `
You are one specialist agent inside AARAN AI's Investment Committee, an
institutional-style public-equity research system. You analyze a business.
You do NOT tell the user to buy or sell — that call always belongs to the
human, and AARAN AI never claims to predict the market with certainty.

TONE: analytical, skeptical, concise, evidence-driven. Never hyped. Prefer
"revenue growth decelerated from 24% to 11%, driven mainly by..." over
"explosive growth potential ahead."

EVIDENCE DISCIPLINE — the most important rule in this app. Every claim you
make must be tagged with exactly one confidence tier:
  - "verified"   — read directly from the SEC EDGAR data or sources given to you
  - "estimate"   — your own calculation or model output, computed from verified inputs
  - "consensus"  — an external analyst consensus figure (only use if you actually have one — do not invent an analyst consensus number)
  - "inference"  — a logical interpretation, not a hard number or fact
  - "unverified" — you could not establish this; say so plainly, never guess

YOU ARE GIVEN REAL, PRE-COMPUTED FINANCIAL DATA BELOW. Use ONLY those
numbers for anything quantitative (revenue, margins, growth rates, cash,
debt, ratios). NEVER invent, adjust, or "round for cleanliness" a financial
figure. If a number you need is missing from the data given to you, say so
("DATA NOT AVAILABLE") instead of estimating one from general knowledge —
the only exception is where your own instructions explicitly ask you to
build a model (e.g. reverse DCF), in which case tag the output "estimate"
and state your assumptions plainly.

You may be given live web search. Use it only for qualitative, checkable
context (earnings-call quotes, product announcements, competitive
positioning, management statements) — never to "confirm" a financial figure
you then report as if EDGAR had given it to you. When a search result
supports a claim, tag it "verified" (if it's a primary source: SEC filing,
company IR page, official transcript) or leave it "inference"/"unverified"
if it's secondhand commentary — and add a real source with the actual URL.

OUTPUT FORMAT: Respond with ONLY a single valid JSON object matching the
schema you are given. No markdown fences, no commentary before or after.

RESPONSE LENGTH: Be information-dense. Direct sentences, no filler
("It's worth noting that..."). Never change how many items you output to
save space — exact counts and required object keys always win over
brevity; word each piece tightly instead.
`.trim();

export function buildCompanySystemPrompt(agentInstructions: string): string {
  return `${COMPANY_CORE_RULES}\n\n${agentInstructions.trim()}`;
}

/** Formats a fmt-friendly compact string for a nullable number, e.g. money or percent. */
function fmt(value: number | null, kind: "money" | "pct" | "ratio" | "number" = "number"): string {
  if (value === null || Number.isNaN(value)) return "DATA NOT AVAILABLE";
  if (kind === "pct") return `${(value * 100).toFixed(1)}%`;
  if (kind === "ratio") return `${value.toFixed(2)}x`;
  if (kind === "money") {
    const abs = Math.abs(value);
    if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(2)}`;
  }
  return String(value);
}

/**
 * Renders the FinancialSnapshot into a plain-text block every agent prompt
 * includes verbatim. Centralizing this means every agent sees the exact
 * same numbers, worded the exact same way — no risk of one agent's prompt
 * silently drifting from another's.
 */
export function describeFinancials(snap: FinancialSnapshot): string {
  const m = snap.metrics;
  const get = (key: string) => m[key];
  const line = (label: string, key: string, kind: "money" | "pct" | "ratio" | "number" = "number") => {
    const dp = get(key);
    if (!dp) return `${label}: DATA NOT AVAILABLE`;
    return `${label}: ${fmt(dp.value, kind)} [${dp.confidence.toUpperCase()} — ${dp.source}]`;
  };

  const revHistory = snap.revenueHistory.map((r) => `FY${r.fiscalYear}: ${fmt(r.value, "money")}`).join(", ");
  const niHistory = snap.netIncomeHistory.map((r) => `FY${r.fiscalYear}: ${fmt(r.value, "money")}`).join(", ");
  const fcfHistory = snap.fcfHistory
    .map((r) => `FY${r.fiscalYear}: OCF ${fmt(r.operatingCashFlow, "money")} / Capex ${fmt(r.capex, "money")}`)
    .join(", ");

  return `
COMPANY: ${snap.companyName} (${snap.ticker}), SEC CIK ${snap.cik}
CURRENT PRICE: ${fmt(snap.price, "money")} as of ${snap.priceAsOf ?? "unknown date"} — source: ${snap.priceSource}
MARKET CAP: ${fmt(snap.marketCap, "money")}
LATEST FISCAL YEAR: FY${snap.revenueFiscalYear ?? "unknown"}
LATEST REVENUE: ${fmt(snap.revenueLatest, "money")}
LATEST NET INCOME: ${fmt(snap.netIncomeLatest, "money")}
LATEST DILUTED EPS: ${snap.epsLatest !== null ? `$${snap.epsLatest.toFixed(2)}` : "DATA NOT AVAILABLE"}

REVENUE HISTORY (annual, from 10-K filings): ${revHistory || "DATA NOT AVAILABLE"}
NET INCOME HISTORY: ${niHistory || "DATA NOT AVAILABLE"}
OPERATING CASH FLOW / CAPEX HISTORY: ${fcfHistory || "DATA NOT AVAILABLE"}

COMPUTED METRICS (already calculated for you — do not recompute, just cite and explain):
${line("Revenue growth YoY", "revenue_growth_yoy", "pct")}
${line("Revenue CAGR (3y)", "revenue_cagr_3y", "pct")}
${line("Revenue CAGR (5y)", "revenue_cagr_5y", "pct")}
${line("EPS growth YoY", "eps_growth_yoy", "pct")}
${line("Gross margin", "gross_margin", "pct")}
${line("Operating margin", "operating_margin", "pct")}
${line("Net margin", "net_margin", "pct")}
${line("Free cash flow", "free_cash_flow", "money")}
${line("FCF margin", "fcf_margin", "pct")}
${line("FCF conversion (FCF/NI)", "fcf_conversion", "pct")}
${line("ROE", "roe", "pct")}
${line("ROIC (approx.)", "roic", "pct")}
${line("Net debt", "net_debt", "money")}
${line("Debt/Equity", "debt_to_equity", "ratio")}
${line("P/E (trailing)", "pe_ratio", "ratio")}
${line("P/S", "ps_ratio", "ratio")}
${line("P/B", "pb_ratio", "ratio")}
${line("EV/Sales", "ev_to_sales", "ratio")}
${line("EV/EBITDA (approx., operating income proxy)", "ev_to_ebitda_approx", "ratio")}
${line("FCF yield", "fcf_yield", "pct")}
`.trim();
}

export const CLAIM_SHAPE_DOC = `{"text": string, "confidence": "verified"|"estimate"|"consensus"|"inference"|"unverified", "sources"?: [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}]}`;
