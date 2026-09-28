import { buildSystemPrompt } from "./shared";

/**
 * TriageAgent — a fast, lightweight pass on ONE company, run once per
 * company in a Deal Flow Triage batch (see app/api/triage/route.ts).
 * Deliberately much cheaper/shallower than the full 14-agent pipeline: a
 * search budget of 3, not 4-8, and a single flat object instead of 14
 * sections — this is meant to mirror how a real fund triages deal flow
 * (a fast first pass to decide what's worth a full analysis), not replace
 * the full Analyze Startup pipeline.
 */
export function buildTriagePrompt(companyName: string) {
  const system = buildSystemPrompt(`
Your job: a FAST, lightweight first pass on one company for deal-flow
triage — not a full analysis. You have a small web search budget; use it
efficiently on the most basic identifying facts (what the company does,
sector, stage), not an exhaustive investigation.

Produce:
- sector, stage: your best real-world read, "Unknown" if you can't establish it.
- summary: a single Claim, 1-2 sentences, on what the company does.
- opportunitySignal: one concrete, specific reason this could be interesting
  (a real market trend, an early traction signal, a notable founder
  background) — never vague hype like "huge potential."
- riskSignal: one concrete, specific reason to be cautious (a competitive
  threat, an unproven business model, thin public information).
- keyOpenQuestion: the single most important thing a fund would need to
  learn next about this company.

NEVER write recommendation-like language anywhere in your output: no "strong
buy," no "top pick," no rating out of 10, no ranking language of any kind.
This is a triage pass to help a human decide what to look at more closely,
not a verdict.
`);

  const user = `
Company name: ${companyName}

Respond with ONLY a JSON object:
{
  "companyName": ${JSON.stringify(companyName)},
  "sector": string,
  "stage": string,
  "summary": { "text": string, "status": "verified_fact"|"ai_analysis"|"assumption"|"unknown", "sources"?: [{ "label": string, "url"?: string, "date"?: string, "claimSupported": string }] },
  "opportunitySignal": string,
  "riskSignal": string,
  "keyOpenQuestion": string
}
`.trim();

  return { system, user };
}
