import { Network } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { StrategicFit, Confidence } from "@/lib/ai/schemas";

const CONFIDENCE_CONFIG: Record<Confidence, { label: string; variant: BadgeProps["variant"] }> = {
  high: { label: "HIGH CONFIDENCE", variant: "low" },
  medium: { label: "MEDIUM CONFIDENCE", variant: "medium" },
  low: { label: "LOW CONFIDENCE", variant: "neutral" },
};

/** A hero feature of the product — matches get a dedicated, more spacious
 *  card treatment than a generic list, per the design brief. */
export function StrategicFitSection({ strategicFit }: { strategicFit: StrategicFit }) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-ink-950">Strategic Fit Matches</h2>
          <p className="text-sm text-ink-400">
            Who could strategically benefit from this startup? Corporations, industries, distributors, and technology partners.
          </p>
        </div>
        <span className="font-mono text-xs text-ink-400">
          {strategicFit.matches.length} match{strategicFit.matches.length === 1 ? "" : "es"} identified
        </span>
      </div>

      <div className="space-y-4">
        {strategicFit.matches.map((m, i) => {
          const cfg = CONFIDENCE_CONFIG[m.confidence];
          return (
            <div key={i} className="rounded-xl border border-signal-100 bg-white p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-signal-50 text-signal-600">
                    <Network size={16} />
                  </div>
                  <span className="text-lg font-bold text-ink-950">{m.companyOrIndustry}</span>
                </div>
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{m.rationale}</p>
              <div className="mt-4 grid gap-4 border-t border-ink-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Possible Collaboration" value={m.possibleCollaboration} />
                <Field label="Possible Pilot Project" value={m.possiblePilotProject} />
                <Field label="Distribution Opportunity" value={m.distributionOpportunity} />
                <Field label="Technology Integration" value={m.technologyIntegration} />
                <Field label="Geographic Opportunity" value={m.geographicOpportunity} />
              </div>
              <p className="mt-4 border-t border-ink-100 pt-3 text-xs text-ink-400">
                <span className="font-medium text-ink-500">Why this confidence level: </span>
                {m.confidenceReasoning}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
      <div className="text-sm text-ink-800">{value}</div>
    </div>
  );
}
