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
