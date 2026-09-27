import type { MarketSizeFigures } from "@/lib/analysis-stats";
import { formatCompactMoney } from "@/lib/analysis-stats";

const ROWS: Array<{ key: keyof MarketSizeFigures; label: string; barClass: string }> = [
  { key: "tam", label: "TAM", barClass: "bg-signal-100 border border-signal-600" },
  { key: "sam", label: "SAM", barClass: "bg-signal-600" },
  { key: "som", label: "SOM", barClass: "bg-signal-700" },
];

/**
 * Only rendered when TAM/SAM/SOM are all real, consistently-ordered numbers
 * (see lib/analysis-stats.ts's extractConsistentMarketSize) — otherwise the
 * calling section falls back to the text+badge cards, so a disclaimer never
 * gets charted as if it were real data.
 */
export function MarketSizeFunnel({ figures }: { figures: MarketSizeFigures }) {
  return (
    <div className="space-y-2.5">
      {ROWS.map((row) => {
        const value = figures[row.key];
        const widthPct = (value / figures.tam) * 100;
        return (
          <div key={row.key} className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-xs font-medium text-ink-600">{row.label}</span>
            <div className="h-4 flex-1 rounded bg-ink-100">
              <div className={`h-full rounded ${row.barClass}`} style={{ width: `${widthPct}%` }} />
            </div>
            <span className="w-16 shrink-0 text-right text-xs font-medium text-ink-900">
              {formatCompactMoney(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
