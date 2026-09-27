import { buildSystemPrompt, describeStartup } from "./shared";
import type {
  StartupInput,
  StartupSnapshot,
  BusinessModel,
  Traction,
  CompetitorMap,
  DevilsAdvocate,
} from "../schemas";

/**
 * DiligenceAgent — turns everything learned so far into the questions and
 * next steps an investor actually needs. Produces three related outputs:
 * the 5 Critical Questions, the Founder Questions, and the Next Diligence
 * checklist.
 */
export function buildDiligencePrompt(
  input: StartupInput,
  snapshot: StartupSnapshot,
  businessModel: BusinessModel,
  traction: Traction,
  competitors: CompetitorMap,
  devilsAdvocate: DevilsAdvocate
) {
  const system = buildSystemPrompt(`
Your job: convert the research into three concrete, company-specific
outputs for the investor.

1. FIVE CRITICAL QUESTIONS — the five unanswered questions most likely to
   materially change the investment thesis if answered. Must be specific to
   this company, not generic ("What is your TAM?" is too generic; "What
   percentage of revenue comes from the top 3 customers?" is specific).

2. FOUNDER QUESTIONS — up to 10 short, specific, challenging questions to
   ask the founders directly, grouped into: product, market, competition,
   economics, execution.

3. NEXT DILIGENCE — a prioritized list of what to investigate next
   (customer reference calls, technical diligence, competitor interviews,
   founder references, market validation, financial review, IP
   verification, security review, regulatory review, etc. — pick what's
   relevant to this company). Prioritize each as "critical", "important",
   or "useful", with a one-line reasoning for the priority.
`);

  const user = `
${describeStartup(input)}

Snapshot: ${JSON.stringify(snapshot, null, 2)}
Business model: ${JSON.stringify(businessModel, null, 2)}
Traction: ${JSON.stringify(traction, null, 2)}
Competitors: ${JSON.stringify(competitors, null, 2)}
Devil's advocate findings: ${JSON.stringify(devilsAdvocate, null, 2)}

Respond with ONLY a JSON object:
{
  "criticalQuestions": {
    "questions": [
      { "question": string, "whyItMatters": string }
    ]
  },
  "founderQuestions": {
    "product": string[], "market": string[], "competition": string[],
    "economics": string[], "execution": string[]
  },
  "nextDiligence": {
    "items": [
      { "item": string, "priority": "critical"|"important"|"useful", "reasoning": string }
    ]
  }
}
"criticalQuestions.questions" must contain exactly 5 items.
`.trim();

  return { system, user };
}
