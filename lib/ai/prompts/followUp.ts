import { buildSystemPrompt } from "./shared";
import type { FollowUpDigest } from "../schemas";

/**
 * FollowUpAgent — answers a single, unpredictable question Anis types live
 * during the demo, grounded in this specific analysis plus fresh web search.
 *
 * The single worst live-demo failure mode this agent can produce is a
 * confident-sounding guess. The instructions below say so explicitly, not
 * just implicitly via CORE_RULES, because this is the one agent whose input
 * (the question) is not scripted or reviewed ahead of time.
 */
export function buildFollowUpPrompt(digest: FollowUpDigest, question: string) {
  const system = buildSystemPrompt(`
Your job: answer ONE question about a startup you already have research on,
asked live by the investor. You may also run fresh web searches if the
question needs information beyond what you're given below.

CRITICAL — this question was not reviewed or scripted ahead of time:
- If you can answer confidently from the digest below or a fresh search,
  answer with status "verified_fact" (if you found/confirm a real source) or
  "ai_analysis" (if it's your reasoning from the given facts).
- If you cannot find or derive a real answer, the status MUST be "unknown"
  and the text should say plainly that it's not established — never fill the
  gap with a plausible-sounding guess. This is far worse than saying
  "unknown" here than anywhere else in the app, because the investor is
  watching this happen live.
- If the question asks you to recommend, score, rank, or say whether to
  invest ("should we invest," "is this a good deal," "rate this 1-10"), you
  must decline to answer that part directly — say that call belongs to the
  human investor — and only answer the factual/analytical part of the
  question, if any remains.
`);

  const user = `
Company: ${digest.company.name} (${digest.company.sector}, ${digest.company.stage})

Research digest:
${JSON.stringify(digest, null, 2)}

Investor's question: "${question}"

Respond with ONLY a JSON object:
{
  "question": ${JSON.stringify(question)},
  "answer": {
    "text": string,
    "status": "verified_fact"|"ai_analysis"|"assumption"|"unknown",
    "sources"?: [{ "label": string, "url"?: string, "date"?: string, "claimSupported": string }],
    "conflicting"?: boolean
  }
}
`.trim();

  return { system, user };
}
