import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/** JapanAgent — could this startup enter Japan, and how. */
export function buildJapanPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: analyze whether and how this startup could enter the Japanese
market. Cover: which Japanese industries could benefit, potential enterprise
customers, potential strategic partners, localization requirements,
regulatory requirements, distribution, pricing, enterprise sales norms,
language considerations, technology integration, and local competition.

Then produce a 5-phase entry strategy: Phase 1 Market Validation, Phase 2
Pilot, Phase 3 Strategic Partner, Phase 4 Enterprise Deployment, Phase 5
Scale. Clearly this is AI-generated strategic reasoning, not confirmed
market research — do not claim specific Japanese companies have interest
unless you have real evidence.
`);

  const user = `
${describeStartup(input)}

Snapshot: ${JSON.stringify(snapshot, null, 2)}

Respond with ONLY a JSON object:
{
  "couldEnterJapan": string,
  "beneficiaryIndustries": string[],
  "potentialEnterpriseCustomers": string[],
  "potentialStrategicPartners": string[],
  "localizationRequirements": string[],
  "regulatoryRequirements": string[],
  "distributionConsiderations": string,
  "pricingConsiderations": string,
  "enterpriseSalesConsiderations": string,
  "languageConsiderations": string,
  "technologyIntegrationConsiderations": string,
  "localCompetition": string[],
  "entryStrategy": [
    { "phase": 1, "title": "Market Validation", "description": string },
    { "phase": 2, "title": "Pilot", "description": string },
    { "phase": 3, "title": "Strategic Partner", "description": string },
    { "phase": 4, "title": "Enterprise Deployment", "description": string },
    { "phase": 5, "title": "Scale", "description": string }
  ]
}
`.trim();

  return { system, user };
}
