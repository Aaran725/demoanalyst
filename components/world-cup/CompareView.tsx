import { Card, CardContent } from "@/components/ui/card";
import type { ScoutStartup } from "@/lib/demo-data/world-cup";

const ROWS: Array<[keyof ScoutStartup, string]> = [
  ["sector", "Sector"],
  ["country", "Country"],
  ["stage", "Stage"],
  ["technology", "Technology"],
  ["businessModel", "Business Model"],
  ["revenueRange", "Revenue Range"],
  ["growth", "Growth"],
  ["corporateFit", "Corporate Fit"],
  ["japanOpportunity", "Japan Opportunity"],
  ["differentiation", "Differentiation"],
  ["strategicFit", "Strategic Fit"],
];

export function CompareView({ startups }: { startups: ScoutStartup[] }) {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-5">
        <table className="w-full min-w-[600px] table-fixed border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 pb-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                Compare
              </th>
              {startups.map((s) => (
                <th key={s.id} className="pb-2 text-left font-semibold text-ink-950">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([key, label]) => (
              <tr key={key} className="border-t border-ink-100">
                <td className="py-2 pr-3 text-xs font-medium uppercase tracking-wide text-ink-400">{label}</td>
                {startups.map((s) => (
                  <td key={s.id} className="py-2 pr-3 align-top text-ink-800">
                    {String(s[key])}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-ink-100">
              <td className="py-2 pr-3 text-xs font-medium uppercase tracking-wide text-ink-400">Risks</td>
              {startups.map((s) => (
                <td key={s.id} className="py-2 pr-3 align-top text-ink-800">
                  <ul className="list-disc pl-4">
                    {s.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
