import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { SectionShell } from "../SectionShell";
import type { CompetitiveMoat, MoatFactor, MoatStrength } from "@/lib/ai/schemas";

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

const STRENGTH_CONFIG: Record<MoatStrength, { label: string; variant: BadgeProps["variant"] }> = {
  strong_evidence: { label: "STRONG EVIDENCE", variant: "low" },
  some_evidence: { label: "SOME EVIDENCE", variant: "signal" },
  weak_evidence: { label: "WEAK EVIDENCE", variant: "medium" },
  unknown: { label: "UNKNOWN", variant: "neutral" },
};

export function MoatSection({ moat }: { moat: CompetitiveMoat }) {
  return (
    <SectionShell
      title="Competitive Moat"
      description="Evidence strength per factor — never a made-up numerical score."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {moat.factors.map((f) => {
          const cfg = STRENGTH_CONFIG[f.strength];
          return (
            <Card key={f.factor}>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink-900">{FACTOR_LABEL[f.factor]}</span>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>
                <p className="text-sm leading-relaxed text-ink-600">{f.reasoning}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SectionShell>
  );
}
