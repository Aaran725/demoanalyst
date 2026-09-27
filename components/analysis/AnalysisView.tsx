"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { FullAnalysis } from "@/lib/ai/schemas";
import { SnapshotSection } from "./sections/SnapshotSection";
import { MarketSection } from "./sections/MarketSection";
import { ProductSection } from "./sections/ProductSection";
import { BusinessModelSection } from "./sections/BusinessModelSection";
import { TractionSection } from "./sections/TractionSection";
import { CompetitorsSection } from "./sections/CompetitorsSection";
import { MoatSection } from "./sections/MoatSection";
import { FoundersSection } from "./sections/FoundersSection";
import { StrategicFitSection } from "./sections/StrategicFitSection";
import { PegasusFitSection } from "./sections/PegasusFitSection";
import { JapanSection } from "./sections/JapanSection";
import { DevilsAdvocateSection } from "./sections/DevilsAdvocateSection";
import { CriticalQuestionsSection } from "./sections/CriticalQuestionsSection";
import { FounderQuestionsSection } from "./sections/FounderQuestionsSection";
import { DiligenceSection } from "./sections/DiligenceSection";
import { ICMemoView } from "./ICMemoView";

const TABS = [
  { value: "snapshot", label: "Snapshot" },
  { value: "market", label: "Market" },
  { value: "product", label: "Product" },
  { value: "business-model", label: "Business Model" },
  { value: "traction", label: "Traction" },
  { value: "competitors", label: "Competitors" },
  { value: "moat", label: "Moat" },
  { value: "founders", label: "Team" },
  { value: "strategic-fit", label: "Strategic Fit" },
  { value: "pegasus-fit", label: "Pegasus Fit" },
  { value: "japan", label: "Japan" },
  { value: "devils-advocate", label: "Devil's Advocate" },
  { value: "critical-questions", label: "5 Critical Questions" },
  { value: "founder-questions", label: "Founder Questions" },
  { value: "diligence", label: "Next Diligence" },
  { value: "memo", label: "IC Memo" },
];

export function AnalysisView({ analysis }: { analysis: FullAnalysis }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">{analysis.snapshot.companyName}</h1>
          <p className="text-sm text-ink-400">
            {analysis.snapshot.sector} · {analysis.snapshot.stage}
          </p>
        </div>
        {analysis.isDemoData && <Badge variant="outline">DEMO DATA</Badge>}
      </div>

      <Tabs defaultValue="snapshot">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="snapshot"><SnapshotSection snapshot={analysis.snapshot} /></TabsContent>
        <TabsContent value="market"><MarketSection market={analysis.market} /></TabsContent>
        <TabsContent value="product"><ProductSection product={analysis.product} /></TabsContent>
        <TabsContent value="business-model"><BusinessModelSection businessModel={analysis.businessModel} /></TabsContent>
        <TabsContent value="traction"><TractionSection traction={analysis.traction} /></TabsContent>
        <TabsContent value="competitors"><CompetitorsSection competitors={analysis.competitors} /></TabsContent>
        <TabsContent value="moat"><MoatSection moat={analysis.moat} /></TabsContent>
        <TabsContent value="founders"><FoundersSection founders={analysis.founders} /></TabsContent>
        <TabsContent value="strategic-fit"><StrategicFitSection strategicFit={analysis.strategicFit} /></TabsContent>
        <TabsContent value="pegasus-fit"><PegasusFitSection pegasusFit={analysis.pegasusFit} /></TabsContent>
        <TabsContent value="japan"><JapanSection japan={analysis.japan} /></TabsContent>
        <TabsContent value="devils-advocate"><DevilsAdvocateSection devilsAdvocate={analysis.devilsAdvocate} /></TabsContent>
        <TabsContent value="critical-questions"><CriticalQuestionsSection criticalQuestions={analysis.criticalQuestions} /></TabsContent>
        <TabsContent value="founder-questions"><FounderQuestionsSection founderQuestions={analysis.founderQuestions} /></TabsContent>
        <TabsContent value="diligence"><DiligenceSection nextDiligence={analysis.nextDiligence} /></TabsContent>
        <TabsContent value="memo"><ICMemoView analysis={analysis} /></TabsContent>
      </Tabs>
    </div>
  );
}
