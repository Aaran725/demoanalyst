"use client";

import { useState } from "react";
import { LineChart, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SubHeading, BulletList } from "@/components/analysis/SectionShell";
import { MARKET_THEMES } from "@/lib/demo-data/public-markets";
import { cn } from "@/lib/utils";

export default function PublicMarketsPage() {
  const [activeId, setActiveId] = useState(MARKET_THEMES[0].id);
  const active = MARKET_THEMES.find((t) => t.id === activeId)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LineChart className="text-signal-600" size={22} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Public Market Intelligence</h1>
          <p className="text-sm text-ink-500">
            Traces startup innovation through to public companies it could affect. Never a buy/sell call
            or price prediction.
          </p>
        </div>
      </div>

      <Card className="border-ink-200 bg-ink-50">
        <CardContent className="flex flex-wrap items-center justify-center gap-2 p-4 text-xs font-semibold uppercase tracking-wide text-ink-500">
          <span>Startup Innovation</span>
          <ArrowDown size={12} className="rotate-[-90deg]" />
          <span>Emerging Technology</span>
          <ArrowDown size={12} className="rotate-[-90deg]" />
          <span>Industry Disruption</span>
          <ArrowDown size={12} className="rotate-[-90deg]" />
          <span>Public Companies Affected</span>
          <ArrowDown size={12} className="rotate-[-90deg]" />
          <span>Investment Research</span>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {MARKET_THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              t.id === activeId
                ? "border-ink-950 bg-ink-950 text-white"
                : "border-ink-200 text-ink-600 hover:border-ink-400"
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-2 p-5">
          <SubHeading>Startup Innovation</SubHeading>
          <p className="text-sm text-ink-800">{active.startupInnovation}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-3">
        <Card><CardContent className="space-y-2 p-5"><SubHeading>Industries Affected</SubHeading><BulletList items={active.industriesAffected} /></CardContent></Card>
        <Card><CardContent className="space-y-2 p-5"><SubHeading>Potential Beneficiaries</SubHeading><BulletList items={active.potentialBeneficiaries} /></CardContent></Card>
        <Card><CardContent className="space-y-2 p-5"><SubHeading>Potentially Disrupted</SubHeading><BulletList items={active.potentiallyDisrupted} /></CardContent></Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Public Companies to Watch</h2>
        <div className="space-y-4">
          {active.companies.map((c, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-5">
                <div className="font-semibold text-ink-950">{c.companyCategory}</div>
                <p className="text-sm text-ink-800">{c.whyItMatters}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Revenue Exposure" value={c.revenueExposure} />
                  <Field label="Competitive Impact" value={c.competitiveImpact} />
                  <Field label="Time Horizon" value={c.timeHorizon} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <SubHeading>Risks</SubHeading>
                    <BulletList items={c.risks} />
                  </div>
                  <div>
                    <SubHeading>What Investors Should Monitor</SubHeading>
                    <BulletList items={c.whatToMonitor} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
      <div className="text-sm text-ink-800">{value}</div>
    </div>
  );
}
