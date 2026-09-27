"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionShell, SubHeading } from "@/components/analysis/SectionShell";
import { ClaimBlock } from "@/components/analysis/ClaimBlock";
import { CompetitorsSection } from "@/components/analysis/sections/CompetitorsSection";
import { StrategicFitSection } from "@/components/analysis/sections/StrategicFitSection";
import { JapanSection } from "@/components/analysis/sections/JapanSection";
import { DevilsAdvocateSection } from "@/components/analysis/sections/DevilsAdvocateSection";
import { CriticalQuestionsSection } from "@/components/analysis/sections/CriticalQuestionsSection";
import { FounderQuestionsSection } from "@/components/analysis/sections/FounderQuestionsSection";
import { DiligenceSection } from "@/components/analysis/sections/DiligenceSection";
import { ICMemoView } from "@/components/analysis/ICMemoView";
import type { FullAnalysis } from "@/lib/ai/schemas";

/**
 * The curated view built for the live demo moment: exactly the sections
 * the product spec calls out as strongest in front of an investor, in the
 * order they should be walked through, ending with the IC Brief.
 */
export function ChallengeResults({ analysis }: { analysis: FullAnalysis }) {
  const [showMemo, setShowMemo] = useState(false);

  if (showMemo) {
    return <ICMemoView analysis={analysis} />;
  }

  return (
    <div className="space-y-12">
      <SectionShell title="What the Company Does">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card><CardContent className="p-5"><ClaimBlock label="Problem" claim={analysis.snapshot.problem} /></CardContent></Card>
          <Card><CardContent className="p-5"><ClaimBlock label="Solution" claim={analysis.snapshot.solution} /></CardContent></Card>
        </div>
      </SectionShell>

      <SectionShell title="Why Now">
        <Card><CardContent className="p-5 text-sm leading-relaxed text-ink-800">{analysis.market.whyNow}</CardContent></Card>
      </SectionShell>

      <SectionShell title="Why It Could Become Important">
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Why customers may choose it</SubHeading>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-800">
              {analysis.product.whyCustomersMayChoose.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </SectionShell>

      <SectionShell title="What Could Kill It">
        <Card className="bg-ink-950">
          <CardContent className="p-5">
            <ol className="space-y-2">
              {analysis.devilsAdvocate.reasonsThisCouldFail.map((reason, i) => (
                <li key={i} className="flex gap-3 text-sm text-white">
                  <span className="font-mono text-risk-high">{i + 1}</span>
                  {reason}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </SectionShell>

      <CompetitorsSection competitors={analysis.competitors} />
      <StrategicFitSection strategicFit={analysis.strategicFit} />
      <JapanSection japan={analysis.japan} input={analysis.input} snapshot={analysis.snapshot} />
      <DevilsAdvocateSection devilsAdvocate={analysis.devilsAdvocate} />
      <CriticalQuestionsSection criticalQuestions={analysis.criticalQuestions} />
      <FounderQuestionsSection founderQuestions={analysis.founderQuestions} />
      <DiligenceSection nextDiligence={analysis.nextDiligence} />

      <div className="flex justify-center border-t border-ink-100 pt-8">
        <Button size="lg" onClick={() => setShowMemo(true)}>
          <FileText size={16} /> Generate IC Brief
        </Button>
      </div>
    </div>
  );
}
