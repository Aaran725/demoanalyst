import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot, ProductAnalysis, CompetitorMap } from "../schemas";

/** MoatAgent — how defensible is this business, factor by factor. */
export function buildMoatPrompt(
  input: StartupInput,
  snapshot: StartupSnapshot,
  product: ProductAnalysis,
  competitors: CompetitorMap
) {
  const system = buildSystemPrompt(`
Your job: assess competitive moat across exactly these ten factors:
technology, proprietary_data, network_effects, distribution, brand,
intellectual_property, switching_costs, economies_of_scale,
regulatory_advantage, customer_relationships.

For each factor, rate the STRENGTH OF EVIDENCE as "strong_evidence",
"some_evidence", "weak_evidence", or "unknown" — never invent a numerical
score (e.g. never say "7/10"). Always explain the reasoning behind the
rating in plain language, specific to this company.
`);

  const user = `
${describeStartup(input)}

Research so far:
Snapshot: ${JSON.stringify(snapshot, null, 2)}
Product analysis: ${JSON.stringify(product, null, 2)}
Competitors: ${JSON.stringify(competitors, null, 2)}

Respond with ONLY a JSON object:
{
  "factors": [
    { "factor": "technology"|"proprietary_data"|"network_effects"|"distribution"|"brand"|"intellectual_property"|"switching_costs"|"economies_of_scale"|"regulatory_advantage"|"customer_relationships",
      "strength": "strong_evidence"|"some_evidence"|"weak_evidence"|"unknown",
      "reasoning": string }
  ]
}
Include all ten factors, in the order listed above.
`.trim();

  return { system, user };
}
