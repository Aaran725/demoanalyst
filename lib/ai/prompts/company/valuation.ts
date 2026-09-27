import { buildCompanySystemPrompt, describeFinancials } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";
import type { ReverseDcfResult, PriceZoneBoundary } from "../../../data/valuation-models";

/**
 * ValuationAgent. The actual math (ratios, reverse DCF growth rate, price
 * zone boundaries) is computed deterministically before this prompt ever
 * runs — see lib/data/valuation-models.ts — because LLM arithmetic on
 * multi-step DCF math is not reliable enough for a financial product. This
 * agent's job is narrative only: explain what the numbers mean, and the
 * orchestrator overwrites any numeric field it returns with the real
 * computed value regardless of what it writes here.
 */
export function buildValuationPrompt(
  snapshot: FinancialSnapshot,
  reverseDcf: ReverseDcfResult,
  priceZones: PriceZoneBoundary[]
) {
  const system = buildCompanySystemPrompt(`
Your job: explain what today's valuation already assumes, and lay out the
Expectation Gap. You are given the ALREADY-COMPUTED reverse DCF result and
price-opportunity-zone boundaries below — do not recompute them, just
explain them in plain English and write the rationale for each zone.

For "analystConsensusSummary": you do not have a licensed analyst-consensus
data feed. Unless you were given a real consensus figure elsewhere in this
prompt (you were not), tag this claim "unverified" and say plainly that no
licensed consensus feed is connected — never invent a consensus price
target or rating.

For base/bull/bear scenario text: ground these in the actual revenue
history, margin trend, and reverse DCF growth requirement given to you.
The base scenario should read as the most likely path given the historical
trend; bull/bear should be real alternative paths, not generic optimism/pessimism.
`);

  const reverseDcfLine = reverseDcf.impliedRevenueGrowthPct !== null
    ? `Reverse DCF says the current enterprise value requires roughly ${reverseDcf.impliedRevenueGrowthPct.toFixed(1)}% annual revenue growth for ${reverseDcf.yearsModeled} years (FCF margin held at today's level, ${reverseDcf.discountRatePct.toFixed(0)}% discount rate, ${reverseDcf.impliedTerminalGrowthPct.toFixed(0)}% terminal growth).`
    : "Reverse DCF could not be computed — insufficient data (missing enterprise value, revenue, or a positive FCF margin).";

  const zonesLines = priceZones
    .map((z) => {
      const range =
        z.rangeLow !== null || z.rangeHigh !== null
          ? `$${z.rangeLow?.toFixed(2) ?? "0"} – $${z.rangeHigh?.toFixed(2) ?? "∞"}`
          : "DATA NOT AVAILABLE (insufficient FCF data)";
      return `- ${z.zone}: ${range} (implies FCF yield ${z.fcfYieldHigh ? `up to ${(z.fcfYieldHigh * 100).toFixed(1)}%` : `above ${((z.fcfYieldLow ?? 0) * 100).toFixed(1)}%`})`;
    })
    .join("\n");

  const user = `
${describeFinancials(snapshot)}

COMPUTED REVERSE DCF (do not recompute — explain this): ${reverseDcfLine}

COMPUTED PRICE OPPORTUNITY ZONES (do not recompute the ranges — explain each):
${zonesLines}

Respond with ONLY a JSON object with exactly these keys:
{
  "valuationSummaryNarrative": string,
  "reverseDcf": {
    "impliedRevenueGrowthPct": ${reverseDcf.impliedRevenueGrowthPct},
    "impliedOperatingMarginPct": ${reverseDcf.impliedOperatingMarginPct},
    "impliedTerminalGrowthPct": ${reverseDcf.impliedTerminalGrowthPct},
    "yearsModeled": ${reverseDcf.yearsModeled},
    "assumptionsNarrative": string,
    "methodologyNote": "${reverseDcf.methodologyNote.replace(/"/g, '\\"')}"
  },
  "priceOpportunityZones": [
    ${priceZones.map((z) => `{"zone": "${z.zone}", "rangeLow": ${z.rangeLow}, "rangeHigh": ${z.rangeHigh}, "rationale": string}`).join(",\n    ")}
  ],
  "expectationGap": {
    "marketImpliedSummary": string,
    "historicalPerformanceSummary": string,
    "analystConsensusSummary": {"text": string, "confidence": "unverified", "sources"?: []},
    "baseScenario": string,
    "bullScenario": string,
    "bearScenario": string
  }
}
Return the exact numeric values shown above for reverseDcf and each zone's
rangeLow/rangeHigh (copy them verbatim) — only "assumptionsNarrative",
"rationale", and the other text fields are yours to write.
`.trim();

  return { system, user };
}
