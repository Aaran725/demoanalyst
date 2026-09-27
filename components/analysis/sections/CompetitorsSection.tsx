import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import { CompetitorCategoryChart } from "../CompetitorCategoryChart";
import { countCompetitorsByCategory } from "@/lib/analysis-stats";
import type { CompetitorMap, Competitor } from "@/lib/ai/schemas";

const CATEGORY_LABEL: Record<Competitor["category"], string> = {
  direct: "Direct Competitor",
  indirect: "Indirect Competitor",
  incumbent: "Incumbent",
  emerging: "Emerging Challenger",
};

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-ink-900">{competitor.name}</span>
          <Badge variant="outline">{CATEGORY_LABEL[competitor.category]}</Badge>
        </div>
        <dl className="space-y-1 text-sm">
          <div><dt className="inline font-medium text-ink-500">Product: </dt><dd className="inline text-ink-800">{competitor.product}</dd></div>
          <div><dt className="inline font-medium text-ink-500">Target Customer: </dt><dd className="inline text-ink-800">{competitor.targetCustomer}</dd></div>
          <div><dt className="inline font-medium text-ink-500">Business Model: </dt><dd className="inline text-ink-800">{competitor.businessModel}</dd></div>
          <div><dt className="inline font-medium text-ink-500">Differentiation: </dt><dd className="inline text-ink-800">{competitor.differentiation}</dd></div>
          {competitor.fundingOrScale && (
            <div><dt className="inline font-medium text-ink-500">Funding / Scale: </dt><dd className="inline text-ink-800">{competitor.fundingOrScale}</dd></div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

export function CompetitorsSection({ competitors }: { competitors: CompetitorMap }) {
  return (
    <SectionShell title="Competitor Map">
      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>By Category</SubHeading>
          <CompetitorCategoryChart counts={countCompetitorsByCategory(competitors.competitors)} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {competitors.competitors.map((c, i) => (
          <CompetitorCard key={i} competitor={c} />
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>What Makes This Startup Different?</SubHeading>
            <BulletList items={competitors.whatMakesThisStartupDifferent} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>What Can Competitors Copy?</SubHeading>
            <BulletList items={competitors.whatCompetitorsCanCopy} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Why Would Customers Switch?</SubHeading>
            <BulletList items={competitors.whyCustomersMightSwitch} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Why Would Customers Stay With an Incumbent?</SubHeading>
            <BulletList items={competitors.whyCustomersMightStayWithIncumbent} />
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
