import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { initials, formatRelativeTime } from "@/lib/utils";
import type { FullAnalysis } from "@/lib/ai/schemas";

/** One row in the Dashboard's Recent Analyses list — meant to sit inside a
 *  single shared Card with `divide-y` between rows, not as its own card. */
export function AnalysisSummaryCard({ analysis }: { analysis: FullAnalysis }) {
  const { snapshot, isDemoData, id, createdAt } = analysis;
  return (
    <Link
      href={`/analyze/${id}`}
      className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-ink-50"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink-100 font-mono text-xs font-bold text-ink-600">
        {initials(snapshot.companyName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-ink-900">{snapshot.companyName}</span>
          {isDemoData && (
            <Badge variant="outline" className="shrink-0">
              DEMO DATA
            </Badge>
          )}
        </div>
        <p className="truncate text-sm text-ink-400">{snapshot.sector}</p>
      </div>
      <span className="shrink-0 font-mono text-xs text-ink-300">{formatRelativeTime(createdAt)}</span>
      <ArrowRight
        size={16}
        className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-600"
      />
    </Link>
  );
}
