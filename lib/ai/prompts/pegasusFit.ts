import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/**
 * PegasusFitAgent — thinks about the startup through a "VC-as-a-Service"
 * lens: how could startup innovation connect to corporate strategic needs.
 *
 * IMPORTANT: this agent has no real, private knowledge of Pegasus Tech
 * Ventures' actual portfolio or partner relationships. Everything it
 * produces is generic strategic reasoning, explicitly labeled as such.
 */
export function buildPegasusFitPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: analyze this startup through a "VC-as-a-Service" lens — the idea
that a venture firm can create value not just by investing, but by
connecting a startup's innovation to large corporate partners' strategic
needs (enterprise partnerships, technology integration, business
development, international expansion, corporate pilots, distribution, and
strategic investment).

You do NOT have real information about Pegasus Tech Ventures' actual
portfolio companies or corporate partner relationships. Never invent a
specific Pegasus relationship. Every idea you produce must be framed as
"potential fit based on industry characteristics," grounded in the
startup's sector and business model — general strategic reasoning, not
insider knowledge.

You have live web search available. You may use it to check real public
information — Pegasus Tech Ventures' own site or public press coverage, or
how comparable startups have structured real corporate/VC-as-a-Service
partnerships — to make your reasoning more concrete and realistic. This
does not change what you're allowed to claim: even if a search surfaces a
real Pegasus portfolio company or program, you still may not assert that
THIS startup has, or is likely to get, an actual relationship with
Pegasus. Searching and finding nothing does not change your output either
— the "disclaimer" field below stays exactly as written regardless of what
you find.

OPTIONAL "realWorldPrecedent" FIELD: if — and only if — your search
actually turns up a real, specific, checkable precedent (a real named
company Pegasus has publicly worked with in an analogous space, or a real
named Pegasus program like the Startup World Cup, with a real source),
include it as a Claim with status "verified_fact" and a real source URL.
This is a precedent/analogy, never a claim that THIS startup has any actual
relationship with Pegasus. If you don't find anything real and specific,
OMIT this field entirely — do not fill it with a generic or invented claim.
Most runs should omit it; that is expected and correct, not a failure.
`);

  const user = `
${describeStartup(input)}

Snapshot: ${JSON.stringify(snapshot, null, 2)}

Respond with ONLY a JSON object:
{
  "vcAsAServiceRationale": string,
  "enterprisePartnershipIdeas": string[],
  "technologyPartnershipIdeas": string[],
  "businessDevelopmentIdeas": string[],
  "internationalExpansionIdeas": string[],
  "corporatePilotIdeas": string[],
  "distributionIdeas": string[],
  "strategicInvestmentAngle": string,
  "disclaimer": "Potential fit based on industry characteristics — not a confirmed Pegasus relationship.",
  "realWorldPrecedent"?: { "text": string, "status": "verified_fact", "sources": [{ "label": string, "url": string, "date"?: string, "claimSupported": string }] }
}
Omit "realWorldPrecedent" entirely if you found nothing real and specific.
`.trim();

  return { system, user };
}
