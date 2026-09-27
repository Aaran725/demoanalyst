import { Card, CardContent } from "@/components/ui/card";
import { ClaimBlock } from "../ClaimBlock";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import type { Traction } from "@/lib/ai/schemas";

export function TractionSection({ traction }: { traction: Traction }) {
  return (
    <SectionShell title="Traction Analysis">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card><CardContent className="p-5"><ClaimBlock label="Revenue" claim={traction.revenue} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="ARR" claim={traction.arr} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Growth" claim={traction.growth} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Customers" claim={traction.customers} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Users" claim={traction.users} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Retention" claim={traction.retention} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Partnerships" claim={traction.partnerships} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Funding" claim={traction.funding} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="Product Adoption" claim={traction.productAdoption} /></CardContent></Card>
        <Card><CardContent className="p-5"><ClaimBlock label="International Expansion" claim={traction.internationalExpansion} /></CardContent></Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Traction Signals</SubHeading>
            <BulletList items={traction.signals} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Traction Questions</SubHeading>
            <BulletList items={traction.openQuestions} />
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
