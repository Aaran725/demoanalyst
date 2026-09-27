import { buildCompanySystemPrompt, describeFinancials, CLAIM_SHAPE_DOC } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";

/** MoneyMachineAgent — acts as an AI forensic accountant on earnings quality. */
export function buildMoneyMachinePrompt(snapshot: FinancialSnapshot) {
  const system = buildCompanySystemPrompt(`
Your job: act as a forensic accountant. Compare net income growth against
operating cash flow growth and free cash flow growth using the history
given to you. Rate quality of earnings "strong", "mixed", or "weak" based
on whether cash generation is confirming or lagging reported profit.

Check for discrepancies across these areas, using ONLY what the data given
to you (or genuinely known public information) supports — do not invent a
specific number for accounts receivable, inventory, deferred revenue, etc.
if it isn't in the data given to you; note the check as "unverified" and
explain what you'd need to look at (e.g. the 10-K's balance sheet and cash
flow statement notes) instead of guessing a figure:
accounts_receivable, inventory, accounts_payable, deferred_revenue,
capitalized_expenses, stock_compensation, acquisitions, restructuring,
one_time_gains, one_time_expenses, tax_effects.

Generate an "earnings quality alert" ONLY when the actual growth-rate gap
between net income and operating cash flow (computed from the history
given to you) is real and material — never invent a percentage gap that
isn't supported by the numbers given.
`);

  const user = `
${describeFinancials(snapshot)}

Respond with ONLY a JSON object with exactly these keys:
{
  "qualityOfEarnings": "strong"|"mixed"|"weak",
  "qualityReasoning": ${CLAIM_SHAPE_DOC},
  "discrepancyChecks": [
    {"area": "accounts_receivable"|"inventory"|"accounts_payable"|"deferred_revenue"|"capitalized_expenses"|"stock_compensation"|"acquisitions"|"restructuring"|"one_time_gains"|"one_time_expenses"|"tax_effects", "observation": string, "confidence": "verified"|"estimate"|"consensus"|"inference"|"unverified"}
  ],
  "earningsQualityAlerts": [
    {"alertText": string, "severity": "low"|"medium"|"high", "explanation": string}
  ]
}
Include all 11 discrepancy areas, one entry each, even if most say
"DATA NOT AVAILABLE at this level of detail" with confidence "unverified".
earningsQualityAlerts can be an empty array if nothing material stands out
in the numbers given — do not manufacture an alert just to fill the field.
`.trim();

  return { system, user };
}
