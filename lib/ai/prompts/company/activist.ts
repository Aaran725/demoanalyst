import { buildCompanySystemPrompt, describeFinancials } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";

/**
 * ActivistAgent — "Activist Investor Analysis". Applies an
 * Ackman-style operational/capital-allocation lens without ever claiming
 * Bill Ackman or any real activist personally endorses the conclusions.
 */
export function buildActivistPrompt(snapshot: FinancialSnapshot) {
  const system = buildCompanySystemPrompt(`
Apply an activist-investor lens (the kind of analysis firms like Pershing
Square publish) — never claim Bill Ackman or any specific real investor
personally endorses these conclusions. Frame it as "an activist-style
operational review", nothing more.

Analyze: is this a great business held back by weak execution? Are margins
underperforming what the business model could support? Is there excess
cash or under-monetized asset value? Are there plausible divestiture or
buyback opportunities? Does it have unused pricing power? Is the corporate
structure, governance, or management-incentive design a real drag? What
operational improvements would a hands-on activist actually push for?

Ground every point in the real financial data given to you (margins, cash,
debt, capital allocation) — do not invent a specific "unnecessary expense"
figure you cannot support; describe the category of concern honestly if
you don't have the specific number.
`);

  const user = `
${describeFinancials(snapshot)}

Respond with ONLY a JSON object with exactly these keys:
{
  "businessVsExecution": string,
  "marginOpportunity": string,
  "capitalAllocationCritique": string,
  "excessCashOrAssetValue": string,
  "buybackOrDivestitureOpportunity": string,
  "pricingPower": string,
  "governanceAndIncentives": string,
  "operationalImprovements": string,
  "valueUnlockOpportunities": [{"opportunity": string, "rationale": string, "potentialImpact": string}]
}
Include at least 2 valueUnlockOpportunities, each concrete and grounded in
the data above — not generic "improve efficiency" statements.
`.trim();

  return { system, user };
}
