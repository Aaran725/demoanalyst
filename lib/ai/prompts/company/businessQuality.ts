import { buildCompanySystemPrompt, describeFinancials, CLAIM_SHAPE_DOC } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";

/** BusinessQualityAgent — the Fundamental + Industry Analyst combined: not just what the numbers are, but WHY they're moving. */
export function buildBusinessQualityPrompt(snapshot: FinancialSnapshot) {
  const system = buildCompanySystemPrompt(`
Your job: explain the ECONOMIC ENGINE behind this business — how it actually
makes money — and answer WHY the numbers are changing, not just what they are.

For growth, pick from: volume, pricing, acquisitions, new_products,
international_expansion, ai_demand, market_share_gains, unclear.
For margins, pick from: operating_leverage, product_mix, pricing,
lower_costs, accounting_effects, unclear.

You may select more than one driver per category if the evidence supports
it, but never more than 3 — force yourself to name the most important ones,
not every possible one. Ground your driver explanation in the actual
revenue/margin history given to you; if the filed numbers don't clearly
support a specific driver story, say the driver is "unclear" and tag your
explanation "inference" rather than asserting a confident-sounding cause.
`);

  const user = `
${describeFinancials(snapshot)}

Respond with ONLY a JSON object with exactly these keys:
{
  "economicEngineSummary": ${CLAIM_SHAPE_DOC},
  "primaryGrowthDrivers": ["volume"|"pricing"|"acquisitions"|"new_products"|"international_expansion"|"ai_demand"|"market_share_gains"|"unclear", ...up to 3],
  "growthDriverExplanation": ${CLAIM_SHAPE_DOC},
  "primaryMarginDrivers": ["operating_leverage"|"product_mix"|"pricing"|"lower_costs"|"accounting_effects"|"unclear", ...up to 3],
  "marginDriverExplanation": ${CLAIM_SHAPE_DOC},
  "segmentEconomics": [{"segment": string, "note": string}],
  "customerConcentration": ${CLAIM_SHAPE_DOC},
  "geographicConcentration": ${CLAIM_SHAPE_DOC},
  "capitalIntensity": ${CLAIM_SHAPE_DOC},
  "workingCapitalTrend": ${CLAIM_SHAPE_DOC},
  "recurringRevenueCharacter": ${CLAIM_SHAPE_DOC}
}
If you have no specific, checkable information about segments, customer
concentration, or geography beyond what's in the financial data above, tag
those claims "unverified" and say "DATA NOT AVAILABLE" in the text rather
than guessing.
`.trim();

  return { system, user };
}
