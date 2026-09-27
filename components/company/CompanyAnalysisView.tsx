"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CompanyHeader } from "./sections/CompanyHeader";
import { InvestmentViewSection } from "./sections/InvestmentViewSection";
import { BusinessQualitySection } from "./sections/BusinessQualitySection";
import { MoneyMachineSection } from "./sections/MoneyMachineSection";
import { ValuationSection } from "./sections/ValuationSection";
import { MoatSection } from "./sections/MoatSection";
import { CeoPromiseTrackerSection } from "./sections/CeoPromiseTrackerSection";
import { SmartMoneySection } from "./sections/SmartMoneySection";
import { BullVsBearSection } from "./sections/BullVsBearSection";
import { TruthModeSection } from "./sections/TruthModeSection";
import { CompanyIcMemoSection } from "./sections/CompanyIcMemoSection";
import { BuffettEngineSection } from "./sections/BuffettEngineSection";
import { ActivistEngineSection } from "./sections/ActivistEngineSection";
import type { FullCompanyAnalysis } from "@/lib/ai/company-schemas";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "business", label: "Business Quality" },
  { value: "money-machine", label: "Money Machine" },
  { value: "valuation", label: "Valuation" },
  { value: "moat", label: "Moat" },
  { value: "management", label: "CEO Execution" },
  { value: "smart-money", label: "Smart Money" },
  { value: "bull-bear", label: "Bull vs Bear" },
  { value: "buffett", label: "Buffett Engine" },
  { value: "activist", label: "Activist Engine" },
  { value: "truth-mode", label: "Truth Mode" },
  { value: "memo", label: "IC Memo" },
];

export function CompanyAnalysisView({ analysis }: { analysis: FullCompanyAnalysis }) {
  return (
    <div className="space-y-6">
      <CompanyHeader financials={analysis.financials} isDemoData={analysis.isDemoData} />

      <Tabs defaultValue="overview">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <InvestmentViewSection view={analysis.investmentView} currentPrice={analysis.financials.price} />
        </TabsContent>
        <TabsContent value="business">
          <BusinessQualitySection businessQuality={analysis.businessQuality} financials={analysis.financials} />
        </TabsContent>
        <TabsContent value="money-machine">
          <MoneyMachineSection moneyMachine={analysis.moneyMachine} financials={analysis.financials} />
        </TabsContent>
        <TabsContent value="valuation">
          <ValuationSection valuation={analysis.valuation} financials={analysis.financials} />
        </TabsContent>
        <TabsContent value="moat">
          <MoatSection moat={analysis.moat} />
        </TabsContent>
        <TabsContent value="management">
          <CeoPromiseTrackerSection tracker={analysis.ceoPromiseTracker} />
        </TabsContent>
        <TabsContent value="smart-money">
          <SmartMoneySection institutional={analysis.institutional} />
        </TabsContent>
        <TabsContent value="bull-bear">
          <BullVsBearSection bull={analysis.bull} bear={analysis.bear} judge={analysis.judge} />
        </TabsContent>
        <TabsContent value="buffett">
          <BuffettEngineSection ticker={analysis.financials.ticker} />
        </TabsContent>
        <TabsContent value="activist">
          <ActivistEngineSection ticker={analysis.financials.ticker} />
        </TabsContent>
        <TabsContent value="truth-mode">
          <TruthModeSection analysis={analysis} />
        </TabsContent>
        <TabsContent value="memo">
          <CompanyIcMemoSection memo={analysis.icMemo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
