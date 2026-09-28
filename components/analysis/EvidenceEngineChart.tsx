import { Card, CardContent } from "@/components/ui/card";
import type { EvidenceBreakdown, SourceCorroboration } from "@/lib/analysis-stats";
import type { EvidenceStatus } from "@/lib/ai/schemas";

const SEGMENT_CONFIG: Record<EvidenceStatus, { label: string; barClass: string; dotClass: string }> = {
  verified_fact: { label: "Verified Fact", barClass: "bg-evidence-fact", dotClass: "bg-evidence-fact" },
  ai_analysis: { label: "AI Analysis", barClass: "bg-evidence-analysis", dotClass: "bg-evidence-analysis" },
  assumption: { label: "Assumption", barClass: "bg-evidence-assumption", dotClass: "bg-evidence-assumption" },
  // Uses a chart-specific color, not evidence.unknown — see tailwind.config.ts.
  unknown: { label: "Unknown", barClass: "bg-chartUnknown", dotClass: "bg-chartUnknown" },
};

const ORDER: EvidenceStatus[] = ["verified_fact", "ai_analysis", "assumption", "unknown"];

/**
 * The Evidence Engine breakdown — what fraction of every claim in this
 * report is a verified fact vs. AI reasoning vs. an assumption vs. unknown.
 * This is the single chart most worth seeing first: it's visual proof of
 * the whole app's core idea, before the reader has read a single section.
 */
export function EvidenceEngineChart({
  breakdown,
  corroboration,
}: {
  breakdown: EvidenceBreakdown;
  corroboration?: SourceCorroboration;
}) {
  const { counts, total } = breakdown;

  if (total === 0) return null;

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Evidence Engine Breakdown
          </h2>
          <span className="text-xs text-ink-400">{total} claims across this report</span>
        </div>

        {/* The stacked bar: one pill-capped row, 2px gaps between segments,
            rounded outer ends only (square where segments meet each other). */}
        <div className="flex h-7 w-full gap-[2px]">
          {ORDER.map((status, i) => {
            const count = counts[status];
            if (count === 0) return null;
            const pct = (count / total) * 100;
            const isFirst = i === ORDER.findIndex((s) => counts[s] > 0);
            const remaining = ORDER.slice(i + 1).some((s) => counts[s] > 0);
            const isLast = !remaining;
            return (
              <div
                key={status}
                title={`${SEGMENT_CONFIG[status].label}: ${count} (${Math.round(pct)}%)`}
                className={`${SEGMENT_CONFIG[status].barClass} ${isFirst ? "rounded-l-full" : ""} ${
                  isLast ? "rounded-r-full" : ""
                }`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>

        {/* Legend: mandatory at 4 series, and carries the exact counts the
            bar itself is too thin to label inline. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
          {ORDER.map((status) => (
            <div key={status} className="flex items-center gap-1.5 text-xs">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${SEGMENT_CONFIG[status].dotClass}`} />
              <span className="text-ink-600">{SEGMENT_CONFIG[status].label}</span>
              <span className="font-mono font-semibold text-ink-900">{counts[status]}</span>
            </div>
          ))}
        </div>

        {/* Worded "backed by," not "verified by our fact-check pass" — this
            counts any verified-fact claim with 2+ sources, including ones
            an agent already cited independently, not only claims the
            Fact-Checker agent itself touched. */}
        {corroboration && corroboration.totalVerifiedFacts > 0 && (
          <p className="border-t border-ink-100 pt-2 text-xs text-ink-500">
            <span className="font-mono font-semibold text-ink-900">
              {corroboration.corroborated} of {corroboration.totalVerifiedFacts}
            </span>{" "}
            verified facts are backed by 2+ independent sources.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
