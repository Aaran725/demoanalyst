import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import type { PegasusFit } from "@/lib/ai/schemas";

export function PegasusFitSection({ pegasusFit }: { pegasusFit: PegasusFit }) {
  return (
    <SectionShell title="Pegasus Strategic Fit" description={pegasusFit.disclaimer}>
      <Card>
        <CardContent className="p-5">
          <p className="text-sm leading-relaxed text-ink-800">{pegasusFit.vcAsAServiceRationale}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Enterprise Partnership Ideas</SubHeading><BulletList items={pegasusFit.enterprisePartnershipIdeas} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Technology Partnership Ideas</SubHeading><BulletList items={pegasusFit.technologyPartnershipIdeas} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Business Development Ideas</SubHeading><BulletList items={pegasusFit.businessDevelopmentIdeas} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>International Expansion Ideas</SubHeading><BulletList items={pegasusFit.internationalExpansionIdeas} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Corporate Pilot Ideas</SubHeading><BulletList items={pegasusFit.corporatePilotIdeas} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Distribution Ideas</SubHeading><BulletList items={pegasusFit.distributionIdeas} /></CardContent></Card>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>Strategic Investment Angle</SubHeading>
          <p className="text-sm leading-relaxed text-ink-800">{pegasusFit.strategicInvestmentAngle}</p>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
