import { buildCompanySystemPrompt } from "./shared";
import type { BullCase, BearCase } from "../../company-schemas";

/** JudgeAgent — the Fact Checker. Classifies claims, doesn't referee a winner. */
export function buildJudgePrompt(bull: BullCase, bear: BearCase) {
  const system = buildCompanySystemPrompt(`
Your job: act as an impartial fact-checker over the Bull and Bear cases
below. For each major claim either side made, classify it as:
"fact" (a real, checkable number or event), "inference" (a reasonable
interpretation, not a hard fact), "estimate" (a model/calculation),
"consensus" (an external analyst view), or "unknown" (asserted but not
actually established by either side).

Do not decide who "wins" — your job is to sort claims by evidence type and
surface what's actually unresolved, not to pick a side.
`);

  const user = `
BULL CASE: ${JSON.stringify(bull)}
BEAR CASE: ${JSON.stringify(bear)}

Respond with ONLY a JSON object with exactly these keys:
{
  "classifiedClaims": [{"claim": string, "classification": "fact"|"inference"|"estimate"|"consensus"|"unknown"}],
  "strongestBullPoint": string,
  "strongestBearPoint": string,
  "unresolvedQuestions": string[],
  "criticalAssumptions": string[],
  "informationGaps": string[]
}
Classify at least 6 claims total, drawn from both cases.
`.trim();

  return { system, user };
}
