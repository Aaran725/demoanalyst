import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, FullAnalysis } from "../schemas";
import { buildMemoDigest } from "./memoDigest";

/**
 * MemoAgent — the final step. Every other section of the IC Memo is just a
 * formatted display of sections already produced by earlier agents (see
 * components/analysis/ICMemoView.tsx). This agent's only job is to write the
 * executive summary, compile the list of missing information investors
 * should know about, and consolidate the source list.
 *
 * It gets a condensed digest of the analysis (see memoDigest.ts), not the
 * full nested JSON every other agent produced — the digest already computes
 * the unknown-claims list and the deduped source list deterministically, so
 * MemoAgent's real job here is just writing the executive summary well.
 */
export function buildMemoPrompt(
  input: StartupInput,
  analysis: Omit<FullAnalysis, "id" | "createdAt" | "isDemoData" | "icMemo" | "input">
) {
  const digest = buildMemoDigest(analysis);

  const system = buildSystemPrompt(`
Your job: write the Executive Summary for an Investment Committee memo,
based on the digest of everything the other agents already found. 3-5
sentences. Neutral, precise, evidence-based tone. Do NOT recommend investing
or not investing — summarize what the company does, why it might be
interesting, and what remains unresolved.

The digest already lists the unknown facts ("allUnknownClaims") and every
source cited ("allSources") for you. Pick the most important few unknowns
for "missingInformation" — you don't need to list all of them, just the
ones that matter most to an investor deciding whether to spend more time on
this company. Pass "allSources" through as "sources" unchanged.
`);

  const user = `
${describeStartup(input)}

Analysis digest:
${JSON.stringify(digest, null, 2)}

Respond with ONLY a JSON object:
{
  "executiveSummary": string,
  "missingInformation": string[],
  "sources": [{ "label": string, "url"?: string, "date"?: string, "claimSupported": string }]
}
`.trim();

  return { system, user };
}
