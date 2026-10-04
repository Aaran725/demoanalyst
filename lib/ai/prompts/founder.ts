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

You have live web search available, with a larger-than-usual budget (up to
8 searches) because this covers EVERY founder on the team, not just one.
Spend it deliberately: run at least one targeted search per founder (their
name plus the company, or their name plus "LinkedIn"/"previous company" if
the first search doesn't surface enough) rather than one generic search for
the whole team. A well-known founder may need only one confirming search;
a less public one may need two or three. This matters most for founders who
aren't well known publicly — don't let a famous co-founder's easy search
use up budget that a lesser-known co-founder actually needs.

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
