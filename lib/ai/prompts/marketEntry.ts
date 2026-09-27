import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/**
 * MarketEntryAgent — the generalized, on-demand version of JapanAgent
 * (japan.ts). Japan stays a pinned, always-run part of the main pipeline;
 * this agent runs only when a user explicitly asks about a different
 * market (see components/analysis/MarketEntryExplorer.tsx), on the exact
 * same rubric.
 */
export function buildMarketEntryPrompt(input: StartupInput, snapshot: StartupSnapshot, market: string) {
  const system = buildSystemPrompt(`
Your job: analyze whether and how this startup could enter the ${market}
market. Cover: which industries in ${market} could benefit, potential
enterprise customers, potential strategic partners, localization
requirements, regulatory requirements, distribution, pricing, enterprise
sales norms, language considerations, technology integration, and local
competition.

Then produce a 5-phase entry strategy: Phase 1 Market Validation, Phase 2
Pilot, Phase 3 Strategic Partner, Phase 4 Enterprise Deployment, Phase 5
Scale. Clearly this is AI-generated strategic reasoning, not confirmed
market research — do not claim specific companies in ${market} have
interest unless you have real evidence.

You have live web search available. You may use it to ground this reasoning
in real facts — comparable companies' real entries into ${market}, the
actual regulators or industry associations relevant to this sector there,
real distribution or localization norms — rather than reasoning from
general knowledge alone. This does not relax the rule above: only name a
specific company in ${market} as interested or engaged if you found a real,
citable source saying so. Whether or not your searches turn up anything,
this output is still AI-generated strategic reasoning, not confirmed market
research.
`);

  const user = `
${describeStartup(input)}

Snapshot: ${JSON.stringify(snapshot, null, 2)}

Target market to analyze: ${market}

Respond with ONLY a JSON object:
{
  "market": "${market}",
  "couldEnterMarket": string,
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
