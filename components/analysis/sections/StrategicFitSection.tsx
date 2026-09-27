import { Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { SectionShell } from "../SectionShell";
import type { StrategicFit, Confidence } from "@/lib/ai/schemas";

const CONFIDENCE_CONFIG: Record<Confidence, { label: string; variant: BadgeProps["variant"] }> = {
  high: { label: "HIGH CONFIDENCE", variant: "low" },
  medium: { label: "MEDIUM CONFIDENCE", variant: "medium" },
  low: { label: "LOW CONFIDENCE", variant: "neutral" },
};

export function StrategicFitSection({ strategicFit }: { strategicFit: StrategicFit }) {
  return (
    <SectionShell
      title="Strategic Fit Engine"
      description="Who could strategically benefit from this startup? Corporations, industries, distributors, and technology partners."
    >
      <div className="grid gap-4">
        {strategicFit.matches.map((m, i) => {
          const cfg = CONFIDENCE_CONFIG[m.confidence];
          return (
            <Card key={i} className="border-signal-100">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Network size={16} className="text-signal-600" />
                    <span className="text-base font-semibold text-ink-950">{m.companyOrIndustry}</span>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>
                <p className="text-sm text-ink-600">{m.rationale}</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Possible Collaboration" value={m.possibleCollaboration} />
                  <Field label="Possible Pilot Project" value={m.possiblePilotProject} />
                  <Field label="Distribution Opportunity" value={m.distributionOpportunity} />
                  <Field label="Technology Integration" value={m.technologyIntegration} />
                  <Field label="Geographic Opportunity" value={m.geographicOpportunity} />
                </div>
                <p className="border-t border-ink-100 pt-3 text-xs text-ink-400">
                  <span className="font-medium text-ink-500">Why this confidence level: </span>
                  {m.confidenceReasoning}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SectionShell>
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
