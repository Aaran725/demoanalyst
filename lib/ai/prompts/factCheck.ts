import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";
import type { CollectedClaim } from "../factCheckCollector";

/**
 * FactCheckerAgent — an independent re-verification pass. It does NOT trust
 * the claim text it's handed; it runs its own fresh searches and reports
 * only what it can itself confirm, contradict, or fails to resolve.
 *
 * Candidates are pre-sorted highest-stakes first (see factCheckCollector.ts)
 * and the prompt tells the model explicitly to prioritize in that order
 * under its search budget — it is expected and fine for lower-stakes claims
 * near the end of the list to go unchecked.
 */
export function buildFactCheckPrompt(input: StartupInput, snapshot: StartupSnapshot, candidates: CollectedClaim[]) {
  const system = buildSystemPrompt(`
Your job: independently re-verify a list of claims that another agent already
labeled "verified_fact." Do not assume they're correct just because they're
labeled that way — run your own fresh web searches and reach your own
conclusion from what you actually find.

For each claim you have search budget to check, report one verdict:
  - "confirmed"     — you found a real, checkable source that supports it.
    Include that source.
  - "contradicted"  — you found a real, checkable source that conflicts with
    it (a different figure, a different fact). Include that source.
  - "inconclusive"  — you searched and could not find anything that either
    confirms or contradicts it (too obscure, private figure, paywalled, etc).
    No source needed.

Prioritize the claims at the TOP of the list first — they were pre-sorted by
stakes (funding amounts, traction/revenue figures, founder background). Your
search budget will likely run out before the end of the list; that's
expected. Only include an entry in "checked" for a claim you actually
searched for. Never include an entry for a claim you skipped, and never
guess a verdict without having actually searched.

Never invent a source. A "source" must be a real, specific reference (a URL
or a named, checkable publication/filing), never a vague "industry reports"
or "public information."
`);

  const claimLines = candidates
    .map((c) => `- id: ${c.id} | ${c.label} | claim: "${c.claim.text}"`)
    .join("\n");

  const user = `
${describeStartup(input)}

Company snapshot for context: ${JSON.stringify(snapshot, null, 2)}

Claims to independently re-verify (highest stakes first):
${claimLines}

Respond with ONLY a JSON object:
{
  "checked": [
    { "id": string, "verdict": "confirmed"|"contradicted"|"inconclusive", "source"?: { "label": string, "url"?: string, "date"?: string, "claimSupported": string } }
  ]
}
`.trim();

  return { system, user };
}
