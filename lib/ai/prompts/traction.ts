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

You have live web search available, with a larger-than-usual budget (up to
8 searches) because this agent has to check ~10 distinct facts. Don't spend
it all on one generic search — run several separate, targeted searches:
one for funding/valuation history, one for revenue or ARR specifically, one
for customer or user counts, one for retention/repeat-usage, one for
notable partnerships. A single broad search tends to surface only the most
recent funding headline and miss everything else.

If the company is headquartered outside the US, also search using local
press, local-language terms, and local business databases (e.g. a Japanese
company's revenue is often only reported by Nikkei, PR Times, or a
Japan-specific outlet, not English-language sources) — don't limit yourself
to English-only queries just because your default instinct is to.

When a search result supports a claim, set its "status" to "verified_fact"
and add a real "sources" entry (real "label", the actual "url", and
"claimSupported"). Only fall back to "unknown" after you've actually tried a
targeted search for that specific fact — don't mark something unknown
because one earlier, unrelated search didn't happen to mention it.
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
