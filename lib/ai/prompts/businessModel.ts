import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/** BusinessModelAgent — how the company actually makes (or plans to make) money. */
export function buildBusinessModelPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: analyze the business model.

Cover revenue model, pricing model, recurring revenue, gross-margin
potential, customer acquisition, sales cycle, capital intensity,
scalability, customer concentration risk, expansion revenue, and
distribution. Never invent specific unit-economics numbers (margin %, CAC,
LTV) unless you have a real basis — mark "unknown" instead. Then summarize
business-model strengths, risks, and open questions.

You have live web search. Use it — a company's pricing model, revenue
model, and distribution approach are often genuinely public (a published
pricing page, press coverage of the business model) even when exact unit
economics (margin %, CAC, LTV) are not. Search before concluding something
is unknown; cite what you find as "verified_fact". For fields that are
inherently a judgment call (scalability, capital intensity), search for
relevant context first, then give your own reasoned "ai_analysis" — an
honest "unclear" or "capital-intensive, typical for this sector" is a
completed judgment, not a gap, so don't mark it "unknown" by default.
`);

  const user = `
${describeStartup(input)}

Research so far (from ResearchAgent):
${JSON.stringify(snapshot, null, 2)}

Respond with ONLY a JSON object with exactly these keys:
{
  "revenueModel": Claim, "pricingModel": Claim, "recurringRevenue": Claim,
  "grossMarginPotential": Claim, "customerAcquisition": Claim, "salesCycle": Claim,
  "capitalIntensity": Claim, "scalability": Claim, "customerConcentration": Claim,
  "expansionRevenue": Claim, "distribution": Claim,
  "strengths": string[], "risks": string[], "openQuestions": string[]
}
Claim = { "text": string, "status": "verified_fact"|"ai_analysis"|"assumption"|"unknown", "sources"?: [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}], "conflicting"?: boolean }
`.trim();

  return { system, user };
}
