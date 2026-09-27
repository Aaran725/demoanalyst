import { buildCompanySystemPrompt, describeFinancials } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";

/** CeoPromiseTrackerAgent — the Management Analyst. Tracks specific, measurable promises against actual outcomes — never an arbitrary "visionary score". */
export function buildCeoPromiseTrackerPrompt(snapshot: FinancialSnapshot) {
  const system = buildCompanySystemPrompt(`
Your job: find SPECIFIC, MEASURABLE promises management made over roughly
the last 3-5 years — in earnings calls, shareholder letters, investor
presentations, or guidance — and check them against actual outcomes using
the real financial data given to you plus web search for the original
statements.

Only include a promise if you can point to something close to the actual
statement (a real quote or a specific paraphrase you found via search) AND
have a real basis for the "actual outcome" (either the financial data given
to you, or a specific figure you found and can cite). Do NOT invent a
management quote. If you cannot find real, checkable promises via search,
return fewer promises rather than fabricating plausible-sounding ones — an
empty or short list is far better than invented management quotes.

NEVER produce an arbitrary numerical "visionary" or "execution" score.
The only counts allowed are the exact tallies in executionRecord.

Also cover, briefly and only with real basis: major acquisitions, buybacks,
share issuance, debt decisions, R&D investment trend, and whether strategy
has been consistent or has repeatedly changed direction.
`);

  const user = `
${describeFinancials(snapshot)}

Use web search to find real earnings-call statements, shareholder letters,
or investor-presentation guidance for ${snapshot.companyName} (${snapshot.ticker})
from roughly the past 3-5 years, and check them against real outcomes.

Respond with ONLY a JSON object with exactly these keys:
{
  "promises": [
    {"statementText": string, "statementDate": string, "targetMetric": string, "actualOutcome": string, "status": "achieved"|"partially_achieved"|"behind_trajectory"|"missed"|"pending", "confidence": "verified"|"estimate"|"consensus"|"inference"|"unverified", "sources": [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}]}
  ],
  "executionRecord": {"promisesTracked": number, "achieved": number, "partiallyAchieved": number, "missed": number, "pending": number},
  "capitalAllocationHistory": string[],
  "strategicConsistencyNarrative": string
}
executionRecord's counts must exactly match the promises array you return.
If web search finds nothing reliable, return an empty "promises" array and
say so honestly in strategicConsistencyNarrative — do not fabricate to fill
the schema.
`.trim();

  return { system, user };
}
