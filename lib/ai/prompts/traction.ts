import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/** TractionAgent — evidence of real customer demand. */
export function buildTractionPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: research evidence of traction — real signs customers want this.

Cover revenue, ARR, growth rate, customer count, user count, retention,
partnerships, funding history, product adoption, and international
expansion. For anything not publicly verifiable, use status "unknown" and
say "Not publicly verified" — do not estimate a plausible-sounding number.
Then list qualitative traction signals (press coverage, notable customer
logos if public, hiring trends, etc.) and the traction questions an investor
should still ask.
`);

  const user = `
${describeStartup(input)}

Research so far (from ResearchAgent):
${JSON.stringify(snapshot, null, 2)}

Respond with ONLY a JSON object with exactly these keys:
{
  "revenue": Claim, "arr": Claim, "growth": Claim, "customers": Claim, "users": Claim,
  "retention": Claim, "partnerships": Claim, "funding": Claim, "productAdoption": Claim,
  "internationalExpansion": Claim,
  "signals": string[], "openQuestions": string[]
}
Claim = { "text": string, "status": "verified_fact"|"ai_analysis"|"assumption"|"unknown", "sources"?: [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}], "conflicting"?: boolean }
`.trim();

  return { system, user };
}
