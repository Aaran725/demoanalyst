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
  "disclaimer": "Potential fit based on industry characteristics — not a confirmed Pegasus relationship."
}
`.trim();

  return { system, user };
}
