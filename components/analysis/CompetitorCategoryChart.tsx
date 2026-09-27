import type { CompetitorCategoryCounts } from "@/lib/analysis-stats";
import type { Competitor } from "@/lib/ai/schemas";

const CATEGORY_CONFIG: Record<Competitor["category"], { label: string; barClass: string }> = {
  direct: { label: "Direct", barClass: "bg-competitor-direct" },
  incumbent: { label: "Incumbent", barClass: "bg-competitor-incumbent" },
  indirect: { label: "Indirect", barClass: "bg-competitor-indirect" },
  emerging: { label: "Emerging", barClass: "bg-competitor-emerging" },
};

const ORDER: Competitor["category"][] = ["direct", "incumbent", "indirect", "emerging"];

/** How many competitors fall into each category, at a glance. */
export function CompetitorCategoryChart({ counts }: { counts: CompetitorCategoryCounts }) {
  const max = Math.max(...ORDER.map((c) => counts[c]), 1);
  const visible = ORDER.filter((c) => counts[c] > 0);

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {visible.map((category) => {
        const cfg = CATEGORY_CONFIG[category];
        const count = counts[category];
        return (
          <div key={category} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-medium text-ink-600">{cfg.label}</span>
            <div className="h-3 flex-1 rounded bg-ink-100">
              <div
                className={`h-full rounded ${cfg.barClass}`}
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="w-4 shrink-0 text-right text-xs font-medium text-ink-900">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
