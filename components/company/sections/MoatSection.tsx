import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading } from "@/components/analysis/SectionShell";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import type { MoatEngine } from "@/lib/ai/company-schemas";
import { cn } from "@/lib/utils";

const DIRECTION_STYLE: Record<MoatEngine["moatDirection"], string> = {
  strengthening: "text-tier-verified",
  stable: "text-tier-estimate",
  weakening: "text-tier-unverified",
};

export function MoatSection({ moat }: { moat: MoatEngine }) {
  return (
    <SectionShell title="Innovation & Moat Engine" description="Is the competitive moat strengthening, stable, or weakening — and why?">
      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <SubHeading>Moat Direction</SubHeading>
            <span className={cn("text-xl font-bold uppercase tracking-wide", DIRECTION_STYLE[moat.moatDirection])}>
              {moat.moatDirection}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-ink-800">{moat.moatNarrative}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>Moat Factors</SubHeading>
          <div className="grid gap-2 sm:grid-cols-2">
            {moat.factors.map((f, i) => (
              <div key={i} className="space-y-1 rounded-md border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{f.factor.replace(/_/g, " ")}</span>
                  <CompanyEvidenceTag tier={f.confidence} />
                </div>
                <p className="text-sm text-ink-700">{f.evidence}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-5">
          <SubHeading>Competitive Landscape</SubHeading>
          <p className="text-sm leading-relaxed text-ink-800">{moat.competitiveLandscapeNarrative}</p>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
