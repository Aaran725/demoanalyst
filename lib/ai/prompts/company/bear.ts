import { buildCompanySystemPrompt, describeFinancials } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";
import type { BusinessQuality, MoneyMachine, MoatEngine, ValuationEngine } from "../../company-schemas";

/** BearAgent — receives one instruction: destroy the bull thesis. Still evidence-bound. */
export function buildBearPrompt(
  snapshot: FinancialSnapshot,
  businessQuality: BusinessQuality,
  moneyMachine: MoneyMachine,
  moat: MoatEngine,
  valuation: ValuationEngine
) {
  const system = buildCompanySystemPrompt(`
DESTROY THIS INVESTMENT THESIS. Your job is to find every real reason this
could be a bad investment — but "real" is the operating word: every point
must trace back to a real number or specific, checkable evidence from the
research below, or genuinely known industry/competitive facts you can name.
Investigate: competition, accounting quality, customer concentration,
regulation, technological disruption, debt, valuation, margin pressure,
execution risk, geopolitical risk, cyclicality, capital requirements.
Do not invent insider-selling or institutional-selling figures — if you
don't have real data on those, say "unverified" and explain what data
source would be needed rather than guessing a number.
`);

  const user = `
${describeFinancials(snapshot)}

Business quality research: ${JSON.stringify(businessQuality)}
Money Machine / earnings quality research: ${JSON.stringify(moneyMachine)}
Moat research: ${JSON.stringify(moat)}
Valuation research: ${JSON.stringify(valuation)}

Respond with ONLY a JSON object with exactly these keys:
{
  "attackStatement": string,
  "strongestEvidence": [
    {"point": string, "confidence": "verified"|"estimate"|"consensus"|"inference"|"unverified", "sources"?: [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}]}
  ],
  "keyRisks": string[]
}
Include at least 3 strongestEvidence entries, each a real, specific attack
on the thesis — not generic "the market could decline" risk statements.
`.trim();

  return { system, user };
}
