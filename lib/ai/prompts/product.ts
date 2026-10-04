import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/** ProductAgent — analyzes what's actually differentiated about the product. */
export function buildProductPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: analyze the product itself, not the company or market.

Cover what is genuinely unique, technology differentiation, workflow
differentiation, cost advantage, data advantage, distribution advantage,
customer experience, switching costs, and integration advantage. Be
skeptical — most claimed differentiation is temporary or copyable. Then give
concrete, company-specific reasons customers may choose this product, and
reasons they may not.

You have live web search. Use it to find real, specific facts where they
exist — real integration partnerships, real published benchmarks, real
customer testimonials or case studies — and cite them as "verified_fact".
For fields that are genuinely a judgment call rather than a discrete fact
(e.g. whether a cost or data advantage is real and durable), search for
relevant evidence first, then give your own reasoned assessment as
"ai_analysis" — including an honest "no clear advantage found" when that's
the honest read. That is a completed analysis, not a gap; do not mark it
"unknown" just because the answer isn't a clean yes.
`);

  const user = `
${describeStartup(input)}

Research so far (from ResearchAgent):
${JSON.stringify(snapshot, null, 2)}

Respond with ONLY a JSON object with exactly these keys:
{
  "uniqueAspects": Claim[],
  "technologyDifferentiation": Claim,
  "workflowDifferentiation": Claim,
  "costAdvantage": Claim,
  "dataAdvantage": Claim,
  "distributionAdvantage": Claim,
  "customerExperience": Claim,
  "switchingCosts": Claim,
  "integrationAdvantage": Claim,
  "whyCustomersMayChoose": string[],
  "whyCustomersMayNotChoose": string[]
}
Claim = { "text": string, "status": "verified_fact"|"ai_analysis"|"assumption"|"unknown", "sources"?: [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}], "conflicting"?: boolean }
`.trim();

  return { system, user };
}
