import type { ConfidenceTier, FullCompanyAnalysis } from "./ai/company-schemas";

/**
 * Truth Mode / Source Audit — computed by walking the real analysis object
 * and counting every confidence-tagged node, exactly the way
 * lib/analysis-stats.ts does for the startup side. This is deliberately
 * NOT another AI call: "Data Integrity %" has to be an exact count of what
 * the agents actually tagged, not one more thing an LLM could get wrong.
 */

const TIERS: ConfidenceTier[] = ["verified", "estimate", "consensus", "inference", "unverified"];

export type ConfidenceCounts = Record<ConfidenceTier, number>;

export interface SourceAudit {
  counts: ConfidenceCounts;
  total: number;
  /** VERIFIED + ESTIMATE + CONSENSUS, i.e. claims backed by something concrete, vs. bare inference/unverified. */
  dataIntegrityPct: number | null;
}

function isConfidenceTagged(value: unknown): value is { confidence: ConfidenceTier } {
  return (
    !!value &&
    typeof value === "object" &&
    TIERS.includes((value as Record<string, unknown>).confidence as ConfidenceTier)
  );
}

export function computeSourceAudit(analysis: FullCompanyAnalysis): SourceAudit {
  const counts: ConfidenceCounts = { verified: 0, estimate: 0, consensus: 0, inference: 0, unverified: 0 };

  function walk(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (value && typeof value === "object") {
      if (isConfidenceTagged(value)) {
        counts[value.confidence]++;
        // Still walk children in case a tagged node nests other tagged nodes
        // (e.g. a CompanyClaim with a `sources` array) — sources themselves
        // aren't confidence-tagged, so this can't double count.
      }
      Object.values(value).forEach(walk);
    }
  }

  walk(analysis);

  const total = TIERS.reduce((sum, t) => sum + counts[t], 0);
  const groundedTotal = counts.verified + counts.estimate + counts.consensus;
  const dataIntegrityPct = total > 0 ? Math.round((groundedTotal / total) * 100) : null;

  return { counts, total, dataIntegrityPct };
}
