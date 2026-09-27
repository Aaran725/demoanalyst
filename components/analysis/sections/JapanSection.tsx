import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import type { JapanOpportunity } from "@/lib/ai/schemas";

export function JapanSection({ japan }: { japan: JapanOpportunity }) {
  return (
    <SectionShell
      title="Japan Opportunity"
      description="AI-generated strategic analysis — not confirmed market research."
    >
      <Card>
        <CardContent className="space-y-2 p-5">
          <SubHeading>Could This Startup Enter Japan?</SubHeading>
          <p className="text-sm leading-relaxed text-ink-800">{japan.couldEnterJapan}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Beneficiary Industries</SubHeading><BulletList items={japan.beneficiaryIndustries} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Potential Enterprise Customers</SubHeading><BulletList items={japan.potentialEnterpriseCustomers} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Potential Strategic Partners</SubHeading><BulletList items={japan.potentialStrategicPartners} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Local Competition</SubHeading><BulletList items={japan.localCompetition} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Localization Requirements</SubHeading><BulletList items={japan.localizationRequirements} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Regulatory Requirements</SubHeading><BulletList items={japan.regulatoryRequirements} /></CardContent></Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Distribution</SubHeading><p className="text-sm text-ink-800">{japan.distributionConsiderations}</p></CardContent></Card>
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Pricing</SubHeading><p className="text-sm text-ink-800">{japan.pricingConsiderations}</p></CardContent></Card>
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Enterprise Sales</SubHeading><p className="text-sm text-ink-800">{japan.enterpriseSalesConsiderations}</p></CardContent></Card>
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Language</SubHeading><p className="text-sm text-ink-800">{japan.languageConsiderations}</p></CardContent></Card>
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Technology Integration</SubHeading><p className="text-sm text-ink-800">{japan.technologyIntegrationConsiderations}</p></CardContent></Card>
      </div>

      <div>
        <SubHeading>Possible Japan Entry Strategy</SubHeading>
        <div className="mt-3 grid gap-3 sm:grid-cols-5">
          {japan.entryStrategy.map((phase) => (
            <Card key={phase.phase}>
              <CardContent className="space-y-1.5 p-4">
                <div className="text-xs font-semibold text-signal-600">PHASE {phase.phase}</div>
                <div className="text-sm font-medium text-ink-900">{phase.title}</div>
                <p className="text-xs leading-relaxed text-ink-500">{phase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
