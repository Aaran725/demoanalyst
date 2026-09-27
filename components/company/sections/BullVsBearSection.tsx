import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading, BulletList } from "@/components/analysis/SectionShell";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import type { BullCase, BearCase, JudgeVerdict } from "@/lib/ai/company-schemas";

const CLASSIFICATION_STYLE: Record<string, string> = {
  fact: "text-tier-verified",
  estimate: "text-tier-estimate",
  consensus: "text-tier-consensus",
  inference: "text-tier-inference",
  unknown: "text-tier-unverified",
};

export function BullVsBearSection({ bull, bear, judge }: { bull: BullCase; bear: BearCase; judge: JudgeVerdict }) {
  return (
    <SectionShell title="Bull vs. Bear" description="The Bear Agent's instruction: destroy this investment thesis. Judge AI classifies every claim.">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-tier-verified/30">
          <CardContent className="space-y-3 p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-tier-verified">Bull AI</div>
            <p className="text-sm font-medium text-ink-900">{bull.thesisStatement}</p>
            <div className="space-y-2">
              {bull.strongestEvidence.map((e, i) => (
                <div key={i} className="flex items-start justify-between gap-2 rounded-md border border-ink-100 p-2.5">
                  <p className="text-sm text-ink-700">{e.point}</p>
                  <CompanyEvidenceTag tier={e.confidence} className="shrink-0" />
                </div>
              ))}
            </div>
            <SubHeading>Key Drivers</SubHeading>
            <BulletList items={bull.keyDrivers} />
          </CardContent>
        </Card>

        <Card className="border-tier-unverified/30">
          <CardContent className="space-y-3 p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-tier-unverified">Bear AI</div>
            <p className="text-sm font-medium text-ink-900">{bear.attackStatement}</p>
            <div className="space-y-2">
              {bear.strongestEvidence.map((e, i) => (
                <div key={i} className="flex items-start justify-between gap-2 rounded-md border border-ink-100 p-2.5">
                  <p className="text-sm text-ink-700">{e.point}</p>
                  <CompanyEvidenceTag tier={e.confidence} className="shrink-0" />
                </div>
              ))}
            </div>
            <SubHeading>Key Risks</SubHeading>
            <BulletList items={bear.keyRisks} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-ink-900">
        <CardContent className="space-y-4 p-5">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-900">Judge AI — Fact Checker Verdict</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-tier-verifiedBg p-3">
              <div className="text-xs font-semibold uppercase text-ink-500">Strongest Bull Point</div>
              <p className="mt-1 text-sm text-ink-800">{judge.strongestBullPoint}</p>
            </div>
            <div className="rounded-md bg-tier-unverifiedBg p-3">
              <div className="text-xs font-semibold uppercase text-ink-500">Strongest Bear Point</div>
              <p className="mt-1 text-sm text-ink-800">{judge.strongestBearPoint}</p>
            </div>
          </div>

          <div>
            <SubHeading>Claim Classification</SubHeading>
            <div className="mt-2 space-y-1.5">
              {judge.classifiedClaims.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-ink-700">{c.claim}</span>
                  <span className={`shrink-0 text-xs font-bold uppercase ${CLASSIFICATION_STYLE[c.classification]}`}>
                    {c.classification}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <SubHeading>Unresolved Questions</SubHeading>
              <BulletList items={judge.unresolvedQuestions} />
            </div>
            <div>
              <SubHeading>Critical Assumptions</SubHeading>
              <BulletList items={judge.criticalAssumptions} />
            </div>
            <div>
              <SubHeading>Information Gaps</SubHeading>
              <BulletList items={judge.informationGaps} />
            </div>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
