import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot, MarketIntelligence } from "../schemas";

/**
 * StrategicFitAgent — the hero module. Who could strategically benefit
 * from this startup? Corporations, industries, distributors, tech companies.
 */
export function buildStrategicFitPrompt(
  input: StartupInput,
  snapshot: StartupSnapshot,
  market: MarketIntelligence
) {
  const system = buildSystemPrompt(`
Your job: think like a corporate development / venture-as-a-service analyst.
Identify 3 to 6 real companies, industries, or types of enterprise customers
that could strategically benefit from a relationship with this startup —
as customers, distributors, technology partners, manufacturers, or strategic
investors.

For each match, give: the rationale for the fit, a possible collaboration, a
possible pilot project, a distribution opportunity, a technology integration
angle, and a geographic opportunity. Rate your confidence as "high",
"medium", or "low" and explain why.

CRITICAL: never claim a company "wants to work with" this startup or that a
relationship exists unless you have real evidence. Frame everything as
"potential strategic fit" based on business logic, not a confirmed
relationship.
`);

  const user = `
${describeStartup(input)}

Snapshot: ${JSON.stringify(snapshot, null, 2)}
Market: ${JSON.stringify(market, null, 2)}

Respond with ONLY a JSON object:
{
  "matches": [
    { "companyOrIndustry": string, "rationale": string, "possibleCollaboration": string,
      "possiblePilotProject": string, "distributionOpportunity": string,
      "technologyIntegration": string, "geographicOpportunity": string,
      "confidence": "high"|"medium"|"low", "confidenceReasoning": string }
  ]
}
`.trim();

  return { system, user };
}
