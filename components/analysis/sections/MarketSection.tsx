import { Card, CardContent } from "@/components/ui/card";
import { ClaimBlock, ClaimList } from "../ClaimBlock";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import { MarketSizeFunnel } from "../MarketSizeFunnel";
import { extractConsistentMarketSize } from "@/lib/analysis-stats";
import type { MarketIntelligence } from "@/lib/ai/schemas";

export function MarketSection({ market }: { market: MarketIntelligence }) {
  const marketSize = extractConsistentMarketSize(market);

  return (
    <SectionShell title="Market Opportunity" description={`Category: ${market.category}`}>
      {marketSize ? (
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>TAM / SAM / SOM</SubHeading>
            <MarketSizeFunnel figures={marketSize} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <ClaimBlock label="TAM" claim={market.tam} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <ClaimBlock label="SAM" claim={market.sam} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <ClaimBlock label="SOM" claim={market.som} />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>Why Now</SubHeading>
          <p className="text-sm leading-relaxed text-ink-800">{market.whyNow}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Growth Rate</SubHeading>
            <ClaimBlock claim={market.growthRate} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Regulatory Environment</SubHeading>
            <ClaimBlock claim={market.regulatoryEnvironment} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Market Drivers</SubHeading>
            <ClaimList claims={market.marketDrivers} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Customer Demand Signals</SubHeading>
            <ClaimList claims={market.customerDemandSignals} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Technology Trends</SubHeading>
            <ClaimList claims={market.technologyTrends} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Geographic Opportunity</SubHeading>
            <ClaimBlock claim={market.geographicOpportunity} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>What Could Change This Market?</SubHeading>
          <BulletList items={market.whatCouldChangeThisMarket} />
        </CardContent>
      </Card>
    </SectionShell>
  );
}
