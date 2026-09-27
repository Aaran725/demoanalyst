import type { InstitutionalIntelligence } from "../ai/company-schemas";

/**
 * Smart Money / Institutional Intelligence.
 * ------------------------------------------
 * Real 13F aggregation (which institutions hold a ticker, and how their
 * position changed quarter over quarter) needs either a licensed provider
 * (Financial Modeling Prep, WhaleWisdom, Fintel all offer this in the
 * ~$15-30/mo range) or a bulk EDGAR 13F-parsing pipeline that's out of
 * scope for a single-ticker lookup. Neither is connected yet, so this is
 * built as a real adapter with an honest "not available" result — never a
 * fabricated holder list. Once INSTITUTIONAL_DATA_PROVIDER + its API key
 * are set in .env.local, replace this function's body with a real fetch;
 * everything downstream (schema, UI) already expects this exact shape.
 */
export function getInstitutionalIntelligence(demoMode: boolean): InstitutionalIntelligence {
  if (!demoMode) {
    return {
      dataAvailable: false,
      notice:
        "No institutional-ownership data provider is connected. Real 13F holder data requires a licensed feed (e.g. Financial Modeling Prep, WhaleWisdom, Fintel) — set INSTITUTIONAL_DATA_PROVIDER in .env.local once one is connected. AARAN AI will never fabricate holder names or position changes.",
      reportingPeriod: null,
      filingDate: null,
      dataAgeDays: null,
      institutionalOwnershipPct: null,
      newPositions: null,
      increasingPositions: null,
      reducingPositions: null,
      exitedPositions: null,
      interpretation: null,
      topHolders: [],
      isDemoData: false,
    };
  }

  // Illustrative shape only, clearly labeled DEMO DATA everywhere it's shown —
  // never presented as real filings. See docs/DEMO_GUIDE.md.
  return {
    dataAvailable: true,
    notice: "DEMO DATA — illustrates what a connected 13F provider would show. Not a real filing.",
    reportingPeriod: "Q2 2025 (demo)",
    filingDate: "2025-08-14 (demo)",
    dataAgeDays: 90,
    institutionalOwnershipPct: 0.68,
    newPositions: 31,
    increasingPositions: 94,
    reducingPositions: 48,
    exitedPositions: 11,
    interpretation: "accumulation",
    topHolders: [
      { name: "Vanguard Group Inc (demo)", currentShares: 42_000_000, previousShares: 39_500_000, changeSharesPct: 0.063, classification: "increased" },
      { name: "BlackRock Inc (demo)", currentShares: 38_500_000, previousShares: 38_600_000, changeSharesPct: -0.003, classification: "unchanged" },
      { name: "State Street Corp (demo)", currentShares: 19_200_000, previousShares: 14_000_000, changeSharesPct: 0.371, classification: "conviction_increase" },
    ],
    isDemoData: true,
  };
}
