import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/** CompetitionAgent — maps the competitive landscape. */
export function buildCompetitionPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: map this startup's competitive landscape.

Identify real, named competitors across four categories: direct competitors
(same product, same customer), indirect competitors (different product,
same problem), incumbents (large established players), and emerging
challengers (newer companies attacking the same space). For each, describe
their product, target customer, business model, key differentiation, and
funding/scale if known. Then answer: what genuinely makes this startup
different, what can competitors copy easily, why customers might switch to
this startup, and why customers might stay with an incumbent instead. If you
do not know real competitors, say so rather than inventing company names.

You have live web search — use it rather than relying on memory alone.
Competitive landscapes change; a remembered competitor list can be stale or
wrong. Search to confirm real, current competitors and their real
funding/scale details before naming them.
`);

  const user = `
${describeStartup(input)}

Research so far (from ResearchAgent):
${JSON.stringify(snapshot, null, 2)}

Respond with ONLY a JSON object with exactly these keys:
{
  "competitors": [
    { "name": string, "category": "direct"|"indirect"|"incumbent"|"emerging",
      "product": string, "targetCustomer": string, "businessModel": string,
      "differentiation": string, "fundingOrScale"?: string }
  ],
  "whatMakesThisStartupDifferent": string[],
  "whatCompetitorsCanCopy": string[],
  "whyCustomersMightSwitch": string[],
  "whyCustomersMightStayWithIncumbent": string[]
}
`.trim();

  return { system, user };
}
