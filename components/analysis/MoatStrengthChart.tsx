import type { MoatFactor, MoatStrength } from "@/lib/ai/schemas";

const FACTOR_LABEL: Record<MoatFactor["factor"], string> = {
  technology: "Technology",
  proprietary_data: "Proprietary Data",
  network_effects: "Network Effects",
  distribution: "Distribution",
  brand: "Brand",
  intellectual_property: "Intellectual Property",
  switching_costs: "Switching Costs",
  economies_of_scale: "Economies of Scale",
  regulatory_advantage: "Regulatory Advantage",
  customer_relationships: "Customer Relationships",
};

// Strength is one ordered scale (strong -> weak), not four unrelated
// categories, so it gets one hue at varying darkness (sequential) rather
// than four different colors (categorical) — see docs/DATAVIZ notes in
// the mega-upgrade plan. "unknown" gets no fill at all: it's the absence
// of evidence, not a data point on the scale.
const STRENGTH_CONFIG: Record<MoatStrength, { widthPct: number; fillClass: string; dashed?: boolean }> = {
  strong_evidence: { widthPct: 100, fillClass: "bg-signal-700" },
  some_evidence: { widthPct: 65, fillClass: "bg-signal-600" },
  weak_evidence: { widthPct: 30, fillClass: "bg-signal-100 border border-signal-600" },
  unknown: { widthPct: 0, fillClass: "", dashed: true },
};

/**
 * Supplements MoatSection's existing 10 cards (their reasoning text is real
 * content worth keeping) with an at-a-glance view of which specific
 * factors are strong vs. weak, since that's hard to scan from 10 separate
 * cards.
 */
export function MoatStrengthChart({ factors }: { factors: MoatFactor[] }) {
  return (
    <div className="space-y-2.5">
      {factors.map((f) => {
        const cfg = STRENGTH_CONFIG[f.strength];
        return (
          <div key={f.factor} className="flex items-center gap-3">
            <span className="w-40 shrink-0 text-xs font-medium text-ink-600">{FACTOR_LABEL[f.factor]}</span>
            <div
              className={`h-2.5 flex-1 rounded-full ${cfg.dashed ? "border border-dashed border-ink-200" : "bg-ink-100"}`}
              title={`${FACTOR_LABEL[f.factor]}: ${f.strength.replace(/_/g, " ")}`}
            >
              {!cfg.dashed && (
                <div
                  className={`h-full rounded-full ${cfg.fillClass}`}
                  style={{ width: `${cfg.widthPct}%` }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
