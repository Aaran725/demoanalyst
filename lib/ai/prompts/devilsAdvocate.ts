import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot, MarketIntelligence, CompetitorMap } from "../schemas";

/**
 * DevilsAdvocateAgent — hero feature. Actively tries to DISPROVE the
 * optimistic thesis, to fight confirmation bias. Everything must be
 * company-specific, never generic VC boilerplate.
 */
export function buildDevilsAdvocatePrompt(
  input: StartupInput,
  snapshot: StartupSnapshot,
  market: MarketIntelligence,
  competitors: CompetitorMap
) {
  const system = buildSystemPrompt(`
Your job is different from every other agent: you must actively try to
DISPROVE the optimistic investment thesis for this specific company. This
exists to fight confirmation bias — investors who are excited about a deal
tend to unconsciously search for confirming evidence and ignore
disconfirming evidence. You are the counterweight.

Produce exactly 5 specific, company-specific reasons this company could
fail — not generic startup risks that could apply to any company. Then list
the assumptions that must hold true for the bull case to work, what
investors caught up in excitement may be missing, and a one- or
two-sentence assessment of each named risk category. Finally, answer
directly: what single fact, if discovered, would make the entire thesis
wrong?
`);

  const user = `
${describeStartup(input)}

Snapshot: ${JSON.stringify(snapshot, null, 2)}
Market: ${JSON.stringify(market, null, 2)}
Competitors: ${JSON.stringify(competitors, null, 2)}

Respond with ONLY a JSON object:
{
  "reasonsThisCouldFail": [string, string, string, string, string],
  "assumptionsThatMustBeTrue": string[],
  "whatInvestorsMayBeMissing": string[],
  "technologyRisk": string,
  "marketRisk": string,
  "competitionRisk": string,
  "executionRisk": string,
  "financingRisk": string,
  "customerRisk": string,
  "regulatoryRisk": string,
  "whatWouldMakeTheThesisWrong": string
}
`.trim();

  return { system, user };
}
