import { buildSystemPrompt } from "./shared";
import type { ComparisonDigest } from "../schemas";

/**
 * StartupComparisonAgent — compares 2-4 of the user's own already-researched
 * companies (see lib/ai/prompts/comparisonDigest.ts for how each one is
 * condensed before reaching here). Distinct from comparisonResultSchema/
 * "ComparisonAgent" in lib/ai/prompts/comparison.ts, which powers the
 * unrelated "Ask Aaran First" feature.
 *
 * This agent organizes strictly by dimension and never ranks: the output
 * schema (startupComparisonSchema) has no numeric field anywhere, so a
 * "winner" is structurally impossible to express — this prompt's job is to
 * make sure the model doesn't try to express one in prose instead.
 */
export function buildStartupComparisonPrompt(digests: ComparisonDigest[]) {
  const system = buildSystemPrompt(`
Your job: compare ${digests.length} startups the user has already researched,
using only the structured data given below (evidence-status counts, moat
factor counts, competitor category counts, traction claims, top risks,
strategic-fit counts). Do not invent new facts about any company beyond what
is given.

You MUST NOT rank the companies, assign any score, or declare a "winner" or
"best fit." Never use words like "best," "winner," "top pick," "strongest,"
or any numeric rating. Organize your output strictly by dimension (e.g.
"Evidence Quality," "Traction," "Competitive Moat," "Strategic Fit," "Key
Risks") and describe each company's position on that dimension factually and
comparatively (e.g. "Company A has more verified-fact claims and fewer
unknowns than Company B," not "Company A is better than Company B").

Close with open questions a human would still need to answer before making
any decision between these companies — never an answer to that question
yourself.
`);

  const user = `
Companies to compare (already-condensed research digests, not raw company data):
${JSON.stringify(digests, null, 2)}

Respond with ONLY a JSON object:
{
  "companies": [${digests.map((d) => `{"id": "${d.id}", "name": "${d.company.name}"}`).join(", ")}],
  "dimensions": [
    { "dimension": string, "perCompany": [{ "companyId": string, "summary": string }] }
  ],
  "keyDifferentiators": string[],
  "openQuestions": string[],
  "disclaimer": "This is a structured comparison of AI research findings, not an investment recommendation or ranking."
}
`.trim();

  return { system, user };
}
