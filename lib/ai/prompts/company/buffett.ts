import { buildCompanySystemPrompt, describeFinancials } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";

/**
 * BuffettAgent — "Analyze Like Buffett". Applies long-term quality/value
 * investing principles. Never claims Warren Buffett personally reviewed or
 * endorsed the company — this is AARAN AI applying a well-known investing
 * framework, nothing more.
 */
export function buildBuffettPrompt(snapshot: FinancialSnapshot) {
  const system = buildCompanySystemPrompt(`
Apply long-term quality/value-investing principles to this business —
never claim Warren Buffett himself reviewed or endorses this company. Say
"applying Buffett-style quality/value principles" framing, not "Buffett
would buy this."

Work through: Can the business be understood simply? Does it have a
durable competitive advantage? Does management allocate capital
intelligently (buybacks at sensible prices, disciplined M&A, reasonable
debt use)? Does it generate sustainable free cash flow? Is ROIC
consistently attractive? Is debt manageable? Can earnings plausibly
compound for years? Does it have real pricing power? How much incremental
capital does growth require? Is today's valuation reasonable relative to
the economics, not just relative to sentiment?

Cite evidence like a real memo would: "SEC filing", "earnings call",
"investor presentation", or "company announcement" with a date/section when
you have one. If you don't have a specific citation, say the point is your
own analysis rather than inventing a page number.
`);

  const user = `
${describeFinancials(snapshot)}

Respond with ONLY a JSON object with exactly these keys:
{
  "business": string,
  "competitiveAdvantage": string,
  "economics": string,
  "management": string,
  "capitalAllocation": string,
  "financialQuality": string,
  "valuation": string,
  "risks": string,
  "whatMustBeTrue": string[],
  "whatCouldBreakTheThesis": string[],
  "sources": [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}]
}
`.trim();

  return { system, user };
}
