import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FullAnalysis } from "@/lib/ai/schemas";

export function AnalysisSummaryCard({ analysis }: { analysis: FullAnalysis }) {
  const { snapshot, isDemoData, id } = analysis;
  return (
    <Link href={`/analyze/${id}`}>
      <Card className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:border-ink-300">
        <div className="min-w-0">
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
        <ArrowRight
          size={16}
          className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-600"
        />
      </Card>
    </Link>
  );
}
