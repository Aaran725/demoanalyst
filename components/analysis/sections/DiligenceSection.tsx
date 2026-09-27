import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { SectionShell } from "../SectionShell";
import type { NextDiligence, DiligencePriority } from "@/lib/ai/schemas";

const PRIORITY_CONFIG: Record<DiligencePriority, { label: string; variant: BadgeProps["variant"] }> = {
  critical: { label: "CRITICAL", variant: "high" },
  important: { label: "IMPORTANT", variant: "medium" },
  useful: { label: "USEFUL", variant: "neutral" },
};

const ORDER: DiligencePriority[] = ["critical", "important", "useful"];

export function DiligenceSection({ nextDiligence }: { nextDiligence: NextDiligence }) {
  const grouped = ORDER.map((priority) => ({
    priority,
    items: nextDiligence.items.filter((item) => item.priority === priority),
  })).filter((g) => g.items.length > 0);

  return (
    <SectionShell title="Recommended Next Diligence">
      <div className="space-y-6">
        {grouped.map(({ priority, items }) => {
          const cfg = PRIORITY_CONFIG[priority];
          return (
            <div key={priority} className="space-y-3">
              <Badge variant={cfg.variant}>{cfg.label}</Badge>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((item, i) => (
                  <Card key={i}>
                    <CardContent className="space-y-1 p-4">
                      <p className="text-sm font-medium text-ink-900">{item.item}</p>
                      <p className="text-xs text-ink-500">{item.reasoning}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
