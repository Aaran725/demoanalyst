import type { Claim, Competitor, EvidenceStatus, FullAnalysis } from "./ai/schemas";

/**
 * Derived stats computed from an analysis for the charts in
 * components/analysis/. Nothing here calls AI or changes what an agent
 * produced — it's pure math over data that already exists, kept in one
 * place so every chart reads from the same source instead of each
 * component re-deriving its own numbers.
 */

// ---------------------------------------------------------------------------
// Evidence Engine breakdown — how many claims across the whole report are
// VERIFIED FACT vs AI ANALYSIS vs ASSUMPTION vs UNKNOWN.
// ---------------------------------------------------------------------------

export type EvidenceCounts = Record<EvidenceStatus, number>;
export interface EvidenceBreakdown {
  counts: EvidenceCounts;
  total: number;
}

const EVIDENCE_STATUSES: EvidenceStatus[] = ["verified_fact", "ai_analysis", "assumption", "unknown"];

function isClaim(value: unknown): value is Claim {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Record<string, unknown>).text === "string" &&
    EVIDENCE_STATUSES.includes((value as Record<string, unknown>).status as EvidenceStatus)
  );
}

/**
 * Walks every section of an analysis and tallies every Claim it finds by
 * status. Uses structural checks (not a specific field list), so it
 * automatically picks up any new Claim field a schema gains later without
 * needing to be updated by hand.
 */
export function computeEvidenceBreakdown(analysis: FullAnalysis): EvidenceBreakdown {
  const counts: EvidenceCounts = { verified_fact: 0, ai_analysis: 0, assumption: 0, unknown: 0 };

  function walk(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (value && typeof value === "object") {
      if (isClaim(value)) {
        counts[value.status]++;
        return;
      }
      Object.values(value).forEach(walk);
    }
  }

  // Walking the whole analysis (not just the "content" sections) is safe:
  // the other top-level fields (id, input, isDemoData, createdAt, icMemo)
  // are plain strings/booleans or objects with no `status` field, so
  // isClaim() never matches them.
  walk(analysis);

  const total = EVIDENCE_STATUSES.reduce((sum, status) => sum + counts[status], 0);
  return { counts, total };
}

// ---------------------------------------------------------------------------
// Competitor category breakdown
// ---------------------------------------------------------------------------

export type CompetitorCategoryCounts = Record<Competitor["category"], number>;

export function countCompetitorsByCategory(competitors: Competitor[]): CompetitorCategoryCounts {
  const counts: CompetitorCategoryCounts = { direct: 0, indirect: 0, incumbent: 0, emerging: 0 };
  competitors.forEach((c) => counts[c.category]++);
  return counts;
}

// ---------------------------------------------------------------------------
// Money figure parsing — for the TAM/SAM/SOM funnel. Only returns a number
// when the claim is confidently a real figure; never guesses one out of a
// disclaimer, matching the app's "never fake data" rule.
// ---------------------------------------------------------------------------

const MONEY_PATTERN = /\$\s*([\d,.]+)\s*(trillion|billion|million|thousand|[tbmk])?/i;
const MULTIPLIERS: Record<string, number> = {
  trillion: 1e12,
  t: 1e12,
  billion: 1e9,
  b: 1e9,
  million: 1e6,
  m: 1e6,
  thousand: 1e3,
  k: 1e3,
};

export function parseMoneyFigure(claim: Claim): number | null {
  if (claim.status === "unknown") return null;
  const match = claim.text.match(MONEY_PATTERN);
  if (!match) return null;
  const amount = parseFloat(match[1].replace(/,/g, ""));
  if (Number.isNaN(amount)) return null;
  const unit = match[2]?.toLowerCase();
  const multiplier = unit ? MULTIPLIERS[unit] ?? 1 : 1;
  return amount * multiplier;
}

/** Formats a raw number back into compact money notation, e.g. 1200000000 -> "$1.2B". */
export function formatCompactMoney(value: number): string {
  const abs = Math.abs(value);
  const scaled =
    abs >= 1e12
      ? [value / 1e12, "T"]
      : abs >= 1e9
        ? [value / 1e9, "B"]
        : abs >= 1e6
          ? [value / 1e6, "M"]
          : abs >= 1e3
            ? [value / 1e3, "K"]
            : [value, ""];
  const [num, suffix] = scaled as [number, string];
  // Drop a trailing ".0" (show "$50M", not "$50.0M") but keep real precision.
  const rounded = Math.round(num * 10) / 10;
  return `$${rounded}${suffix}`;
}

export interface MarketSizeFigures {
  tam: number;
  sam: number;
  som: number;
}

/**
 * Only returns figures when TAM/SAM/SOM all parse to real numbers AND are
 * consistently ordered (TAM >= SAM >= SOM) — an inconsistent parse is
 * treated as untrustworthy, since a funnel chart built on it would itself
 * be presenting a guess as if it were real data.
 */
export function extractConsistentMarketSize(market: {
  tam: Claim;
  sam: Claim;
  som: Claim;
}): MarketSizeFigures | null {
  const tam = parseMoneyFigure(market.tam);
  const sam = parseMoneyFigure(market.sam);
  const som = parseMoneyFigure(market.som);
  if (tam === null || sam === null || som === null) return null;
  if (tam < sam || sam < som) return null;
  return { tam, sam, som };
}
