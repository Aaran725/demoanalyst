import { Card, CardContent } from "@/components/ui/card";
import { ClaimBlock } from "../ClaimBlock";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import type { BusinessModel } from "@/lib/ai/schemas";

export function BusinessModelSection({ businessModel: bm }: { businessModel: BusinessModel }) {
  return (
    <SectionShell title="Business Model">
      <div className="grid gap-5 sm:grid-cols-2">
        <Card><CardContent className="p-5"><ClaimBlock label="Revenue Model" claim={bm.revenueModel} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Pricing Model" claim={bm.pricingModel} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Recurring Revenue" claim={bm.recurringRevenue} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Gross Margin Potential" claim={bm.grossMarginPotential} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Customer Acquisition" claim={bm.customerAcquisition} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Sales Cycle" claim={bm.salesCycle} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Capital Intensity" claim={bm.capitalIntensity} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Scalability" claim={bm.scalability} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Customer Concentration" claim={bm.customerConcentration} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Expansion Revenue" claim={bm.expansionRevenue} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Distribution" claim={bm.distribution} /></CardContent></Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Strengths</SubHeading>
            <BulletList items={bm.strengths} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Risks</SubHeading>
            <BulletList items={bm.risks} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Open Questions</SubHeading>
            <BulletList items={bm.openQuestions} />
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
