import { buildCompanySystemPrompt, describeFinancials } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";

/** MoatAgent — Innovation & Moat + Industry Analyst combined. */
export function buildMoatPrompt(snapshot: FinancialSnapshot) {
  const system = buildCompanySystemPrompt(`
Your job: assess whether this company's competitive moat is strengthening,
stable, or weakening — and say WHY, with real evidence, never a numerical
score (never write "moat score: 8/10").

Cover moat factors from this list, using only factors you have real
evidence for (you may use web search for R&D spend, patents, partnerships,
hiring trends, competitor moves — cite what you find):
technology_rnd, patents_ip, data_advantage, network_effects,
switching_costs, scale_advantages, brand, distribution,
regulatory_barriers, talent_ecosystem, developer_ecosystem.

R&D spend and R&D/revenue are in the financial data given to you when
available — use those real figures, don't estimate them. For anything you
cannot verify (patent counts, hiring trend specifics, research paper
output), tag it "unverified" or "inference" and say so rather than
guessing a number.
`);

  const user = `
${describeFinancials(snapshot)}

Respond with ONLY a JSON object with exactly these keys:
{
  "moatDirection": "strengthening"|"stable"|"weakening",
  "moatNarrative": string,
  "factors": [
    {"factor": "technology_rnd"|"patents_ip"|"data_advantage"|"network_effects"|"switching_costs"|"scale_advantages"|"brand"|"distribution"|"regulatory_barriers"|"talent_ecosystem"|"developer_ecosystem", "evidence": string, "confidence": "verified"|"estimate"|"consensus"|"inference"|"unverified"}
  ],
  "competitiveLandscapeNarrative": string
}
Include at least 4 factors with real evidence — omit factors you genuinely
have nothing to say about rather than padding with "unverified" entries.
`.trim();

  return { system, user };
}
