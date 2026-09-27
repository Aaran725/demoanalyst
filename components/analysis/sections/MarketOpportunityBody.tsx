import { Card, CardContent } from "@/components/ui/card";
import { SubHeading, BulletList } from "../SectionShell";
import { JapanEntryStepper } from "../JapanEntryStepper";
import type { JapanPhase } from "@/lib/ai/schemas";

/**
 * The market-opportunity card layout shared by the pinned Japan Opportunity
 * tab (JapanSection.tsx) and the on-demand Market Entry Engine
 * (MarketEntryExplorer.tsx) — japanOpportunitySchema and
 * marketEntryOpportunitySchema are field-for-field identical except for the
 * "could enter X" framing, so this is genuinely shared, not a speculative
 * abstraction.
 */
export function MarketOpportunityBody({
  couldEnterLabel,
  couldEnterText,
  entryStrategyLabel,
  beneficiaryIndustries,
  potentialEnterpriseCustomers,
  potentialStrategicPartners,
  localCompetition,
  localizationRequirements,
  regulatoryRequirements,
  distributionConsiderations,
  pricingConsiderations,
  enterpriseSalesConsiderations,
  languageConsiderations,
  technologyIntegrationConsiderations,
  entryStrategy,
}: {
  couldEnterLabel: string;
  couldEnterText: string;
  entryStrategyLabel: string;
  beneficiaryIndustries: string[];
  potentialEnterpriseCustomers: string[];
  potentialStrategicPartners: string[];
  localCompetition: string[];
  localizationRequirements: string[];
  regulatoryRequirements: string[];
  distributionConsiderations: string;
  pricingConsiderations: string;
  enterpriseSalesConsiderations: string;
  languageConsiderations: string;
  technologyIntegrationConsiderations: string;
  entryStrategy: JapanPhase[];
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="space-y-2 p-5">
          <SubHeading>{couldEnterLabel}</SubHeading>
          <p className="text-sm leading-relaxed text-ink-800">{couldEnterText}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Beneficiary Industries</SubHeading><BulletList items={beneficiaryIndustries} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Potential Enterprise Customers</SubHeading><BulletList items={potentialEnterpriseCustomers} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Potential Strategic Partners</SubHeading><BulletList items={potentialStrategicPartners} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Local Competition</SubHeading><BulletList items={localCompetition} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Localization Requirements</SubHeading><BulletList items={localizationRequirements} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Regulatory Requirements</SubHeading><BulletList items={regulatoryRequirements} /></CardContent></Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Distribution</SubHeading><p className="text-sm text-ink-800">{distributionConsiderations}</p></CardContent></Card>
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Pricing</SubHeading><p className="text-sm text-ink-800">{pricingConsiderations}</p></CardContent></Card>
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Enterprise Sales</SubHeading><p className="text-sm text-ink-800">{enterpriseSalesConsiderations}</p></CardContent></Card>
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Language</SubHeading><p className="text-sm text-ink-800">{languageConsiderations}</p></CardContent></Card>
        <Card><CardContent className="p-5 space-y-1"><SubHeading>Technology Integration</SubHeading><p className="text-sm text-ink-800">{technologyIntegrationConsiderations}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <SubHeading>{entryStrategyLabel}</SubHeading>
          <div className="mt-5">
            <JapanEntryStepper phases={entryStrategy} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
