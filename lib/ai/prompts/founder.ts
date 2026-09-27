import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/** FounderAgent — publicly available background on the founding team. */
export function buildFounderPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: research the founding team using only publicly available
information — education, previous companies, technical experience, industry
experience, and prior exits.

Do NOT make judgments about intelligence, personality, character, or
competence — those are not researchable facts. Stick to verifiable
background. If you don't have reliable knowledge of the founders, say so
plainly instead of inventing biography details. Then list relevant team
experience, team questions an investor should ask, and specific information
that still needs to be verified.

You have live web search available. Use it to look up each founder by name
plus the company — LinkedIn profiles, press coverage, prior-company
announcements — rather than relying only on what you already know. This
matters most for founders who aren't well known publicly.

When a search result supports a background claim, set its "status" to
"verified_fact" and add a real "sources" entry (real "label", the actual
"url", and "claimSupported"). If searches turn up nothing reliable for a
founder, their background stays "unknown" — don't guess a plausible-sounding
biography just because you looked and found nothing.
`);

  const user = `
${describeStartup(input)}

Research so far (from ResearchAgent):
${JSON.stringify(snapshot, null, 2)}
Known founder names: ${JSON.stringify(snapshot.founders)}

Respond with ONLY a JSON object with exactly these keys:
{
  "founders": [
    { "name": string, "role"?: string, "background": Claim[] }
  ],
  "relevantTeamExperience": string[],
  "teamQuestions": string[],
  "informationToVerify": string[]
}
Claim = { "text": string, "status": "verified_fact"|"ai_analysis"|"assumption"|"unknown", "sources"?: [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}], "conflicting"?: boolean }
`.trim();

  return { system, user };
}
