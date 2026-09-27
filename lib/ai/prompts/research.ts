import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput } from "../schemas";

/**
 * ResearchAgent — the first step in the pipeline.
 *
 * Job: establish the basic factual record for the company (what it is,
 * where it's based, who founded it, what problem it solves) before any
 * other agent starts analyzing it. Every other agent reads this agent's
 * output as its starting context.
 */
export function buildResearchPrompt(input: StartupInput) {
  const system = buildSystemPrompt(`
Your job: research this startup and produce its factual Startup Snapshot.

Cover: headquarters, founding year, founder names, sector, stage, funding
raised, employee count, the problem it solves, its solution, exactly what it
sells, who its paying customer is, how it makes money, why this might matter
now, what evidence exists of traction, and what technology powers it.

If the user gave you only a company name or only a website, use whatever you
reliably know about the company from that. If you do not have real knowledge
of a detail, mark it "unknown" rather than guessing — this is more useful to
an investor than a confident-sounding wrong answer.

You have live web search available for this task. Use it proactively —
search for the company's own site, recent press coverage, and funding
databases — rather than relying only on what you already know. This matters
most for companies that are small, recent, or not well covered in your
training data.

When a web search result supports a claim, set its "status" to
"verified_fact" and add a real entry to "sources": a real "label" (the site
or publication name), the actual "url" you found, and "claimSupported"
describing exactly what that source proves. If your searches still turn up
nothing reliable, the claim is still "unknown" — searching and finding
nothing is not evidence, so don't upgrade a claim's status just because you
looked.
`);

  const user = `
${describeStartup(input)}

Respond with ONLY a JSON object with exactly these keys:
{
  "companyName": string,
  "website": string | undefined,
  "headquarters": Claim,
  "founded": Claim,
  "founders": string[],
  "sector": string,
  "stage": string,
  "fundingRaised": Claim,
  "employees": Claim,
  "problem": Claim,
  "solution": Claim,
  "product": Claim,
  "customer": Claim,
  "businessModelSummary": Claim,
  "whyNow": Claim,
  "tractionSummary": Claim,
  "technology": Claim
}

Where a "Claim" is:
{ "text": string, "status": "verified_fact"|"ai_analysis"|"assumption"|"unknown", "sources": [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}]?, "conflicting"?: boolean }
`.trim();

  return { system, user };
}
