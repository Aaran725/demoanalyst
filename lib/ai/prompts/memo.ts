import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, FullAnalysis } from "../schemas";

/**
 * MemoAgent — the final step. Every other section of the IC Memo is just a
 * formatted display of sections already produced by earlier agents (see
 * components/analysis/ICMemo.tsx). This agent's only job is to write the
 * executive summary, compile the list of missing information investors
 * should know about, and consolidate the source list.
 */
export function buildMemoPrompt(
  input: StartupInput,
  analysis: Omit<FullAnalysis, "id" | "createdAt" | "isDemoData" | "icMemo" | "input">
) {
  const system = buildSystemPrompt(`
Your job: write the Executive Summary for an Investment Committee memo,
based on everything the other agents already found. 3-5 sentences.
Neutral, precise, evidence-based tone. Do NOT recommend investing or not
investing — summarize what the company does, why it might be interesting,
and what remains unresolved.

Also compile a flat list of the most important MISSING INFORMATION across
the whole analysis (facts marked "unknown" that matter most), and a
consolidated list of sources cited anywhere in the analysis.
`);

  const user = `
${describeStartup(input)}

Full analysis so far:
${JSON.stringify(analysis, null, 2)}

Respond with ONLY a JSON object:
{
  "executiveSummary": string,
  "missingInformation": string[],
  "sources": [{ "label": string, "url"?: string, "date"?: string, "claimSupported": string }]
}
`.trim();

  return { system, user };
}
