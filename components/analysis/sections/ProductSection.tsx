import { Card, CardContent } from "@/components/ui/card";
import { ClaimBlock, ClaimList } from "../ClaimBlock";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import type { ProductAnalysis } from "@/lib/ai/schemas";

export function ProductSection({ product }: { product: ProductAnalysis }) {
  return (
    <SectionShell title="Product Analysis">
      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>What&apos;s Unique</SubHeading>
          <ClaimList claims={product.uniqueAspects} />
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card><CardContent className="p-5"><ClaimBlock label="Technology Differentiation" claim={product.technologyDifferentiation} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Workflow Differentiation" claim={product.workflowDifferentiation} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Cost Advantage" claim={product.costAdvantage} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Data Advantage" claim={product.dataAdvantage} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Distribution Advantage" claim={product.distributionAdvantage} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Customer Experience" claim={product.customerExperience} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Switching Costs" claim={product.switchingCosts} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Integration Advantage" claim={product.integrationAdvantage} /></CardContent></Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Why Customers May Choose This</SubHeading>
            <BulletList items={product.whyCustomersMayChoose} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Why Customers May Not Choose It</SubHeading>
            <BulletList items={product.whyCustomersMayNotChoose} />
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
