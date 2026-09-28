import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "../SectionShell";
import { ClaimBlock } from "../ClaimBlock";
import { MarketOpportunityBody } from "./MarketOpportunityBody";
import { MarketEntryExplorer } from "../MarketEntryExplorer";
import type { JapanOpportunity, StartupInput, StartupSnapshot } from "@/lib/ai/schemas";

export function JapanSection({
  japan,
  input,
  snapshot,
}: {
  japan: JapanOpportunity;
  input: StartupInput;
  snapshot: StartupSnapshot;
}) {
  return (
    <SectionShell
      title="Japan Opportunity"
      description="AI-generated strategic analysis — not confirmed market research."
    >
      <MarketOpportunityBody
        couldEnterLabel="Could This Startup Enter Japan?"
        couldEnterText={japan.couldEnterJapan}
        entryStrategyLabel="Possible Japan Entry Strategy"
        beneficiaryIndustries={japan.beneficiaryIndustries}
        potentialEnterpriseCustomers={japan.potentialEnterpriseCustomers}
        potentialStrategicPartners={japan.potentialStrategicPartners}
        localCompetition={japan.localCompetition}
        localizationRequirements={japan.localizationRequirements}
        regulatoryRequirements={japan.regulatoryRequirements}
        distributionConsiderations={japan.distributionConsiderations}
        pricingConsiderations={japan.pricingConsiderations}
        enterpriseSalesConsiderations={japan.enterpriseSalesConsiderations}
        languageConsiderations={japan.languageConsiderations}
        technologyIntegrationConsiderations={japan.technologyIntegrationConsiderations}
        entryStrategy={japan.entryStrategy}
      />

      {/* Rare by design — only present when live web search actually found a
          real, checkable precedent (see lib/ai/prompts/japan.ts). Most runs
          omit this entirely; that's expected, not a bug. */}
      {japan.realWorldPrecedent && (
        <Card>
          <CardContent className="p-5">
            <ClaimBlock label="Closest Real-World Precedent Found" claim={japan.realWorldPrecedent} />
          </CardContent>
        </Card>
      )}

      <MarketEntryExplorer input={input} snapshot={snapshot} />
    </SectionShell>
  );
}
