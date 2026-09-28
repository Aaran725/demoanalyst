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

You have live web search available. You may use it to ground this reasoning
in real facts — comparable companies' real Japan market entries, the actual
regulators or industry associations relevant to this sector, real
distribution or localization norms — rather than reasoning from general
knowledge alone. This does not relax the rule above: only name a specific
Japanese company as interested or engaged if you found a real, citable
source saying so. Whether or not your searches turn up anything, this
output is still AI-generated strategic reasoning, not confirmed market
research.

OPTIONAL "realWorldPrecedent" FIELD: if — and only if — your search
actually turns up a real, specific, checkable precedent (a real comparable
company's real Japan market entry, a real named Japanese partner/customer
in an analogous space, with a real source), include it as a Claim with
status "verified_fact" and a real source URL. This is a precedent/analogy,
never a claim that a real Japanese company has interest in THIS specific
startup unless you truly found that exact fact. If you don't find anything
real and specific, OMIT this field entirely — do not fill it with a generic
or invented claim. Most runs should omit it; that is expected and correct,
not a failure.
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
  ],
  "realWorldPrecedent"?: { "text": string, "status": "verified_fact", "sources": [{ "label": string, "url": string, "date"?: string, "claimSupported": string }] }
}
Omit "realWorldPrecedent" entirely if you found nothing real and specific.
`.trim();

  return { system, user };
}
