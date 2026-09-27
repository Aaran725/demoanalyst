import { buildSystemPrompt } from "./shared";
import type { AaranAnswers, DevilsAdvocate, CompetitiveMoat, FounderQuestions } from "../schemas";

/**
 * Powers "Ask Aaran First" — compares Aaran's own answers (given BEFORE he
 * sees the AI's output) against what the AI actually found. The goal is
 * never to grade Aaran; it's to show where human intuition and AI research
 * agree, and where each caught something the other missed.
 */
export function buildComparisonPrompt(
  aaranAnswers: AaranAnswers,
  devilsAdvocate: DevilsAdvocate,
  moat: CompetitiveMoat,
  founderQuestions: FounderQuestions
) {
  const system = buildSystemPrompt(`
Your job: compare a human investor's own first-pass answers against the AI's
research findings, on three questions: (1) the biggest risks, (2) the
company's possible moat, (3) the first question to ask a founder.

Do NOT assign a grade or score. Identify genuine overlaps (where the
human's answer and the AI's findings point at the same underlying idea,
even with different words), genuine gaps the AI caught that the human
didn't mention, and genuine gaps the human raised that the AI's structured
output didn't emphasize. Be fair and specific — don't manufacture overlap
or gaps that aren't really there.
`);

  const user = `
Aaran's answers (given before seeing any AI output):
- Biggest risks: ${aaranAnswers.risks}
- Possible moat: ${aaranAnswers.moat}
- First founder question: ${aaranAnswers.founderQuestion}

AI's Devil's Advocate findings:
${JSON.stringify(devilsAdvocate, null, 2)}

AI's Moat analysis:
${JSON.stringify(moat, null, 2)}

AI's Founder Questions:
${JSON.stringify(founderQuestions, null, 2)}

Respond with ONLY a JSON object:
{
  "whereWeAgreed": string[],
  "whatAIFoundThatAaranMissed": string[],
  "whatAaranFoundThatAIMissed": string[]
}
`.trim();

  return { system, user };
}
