import { Card, CardContent } from "@/components/ui/card";
import { SubHeading, BulletList } from "@/components/analysis/SectionShell";
import type { StartupComparison } from "@/lib/ai/schemas";

/**
 * Renders a real, AI-generated comparison across 2-4 companies the user has
 * actually researched — never a ranking (see startupComparisonSchema: no
 * numeric field exists anywhere in this shape).
 */
export function CompareView({ comparison }: { comparison: StartupComparison }) {
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="overflow-x-auto p-5">
          <table className="w-full min-w-[600px] table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 pb-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Dimension
                </th>
                {comparison.companies.map((c) => (
                  <th key={c.id} className="pb-2 text-left font-semibold text-ink-950">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.dimensions.map((d) => (
                <tr key={d.dimension} className="border-t border-ink-100">
                  <td className="py-2.5 pr-3 align-top text-xs font-medium uppercase tracking-wide text-ink-400">
                    {d.dimension}
                  </td>
                  {comparison.companies.map((c) => (
                    <td key={c.id} className="py-2.5 pr-3 align-top text-ink-800">
                      {d.perCompany.find((p) => p.companyId === c.id)?.summary ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>Key Differentiators</SubHeading>
            <BulletList items={comparison.keyDifferentiators} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>Open Questions</SubHeading>
            <BulletList items={comparison.openQuestions} />
          </CardContent>
        </Card>
      </div>

      <p className="text-xs italic text-ink-400">{comparison.disclaimer}</p>
    </div>
  );
}
