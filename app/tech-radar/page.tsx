"use client";

import { useState } from "react";
import { Radar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SubHeading, BulletList } from "@/components/analysis/SectionShell";
import { TECH_RADAR } from "@/lib/demo-data/tech-radar";
import { cn } from "@/lib/utils";

export default function TechRadarPage() {
  const [activeId, setActiveId] = useState(TECH_RADAR[0].id);
  const active = TECH_RADAR.find((c) => c.id === activeId)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Radar className="text-signal-600" size={22} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Technology Radar</h1>
          <p className="text-sm text-ink-500">
            AI-generated, illustrative industry analysis — a starting point for research, not a
            finished one.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TECH_RADAR.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              c.id === activeId
                ? "border-ink-950 bg-ink-950 text-white"
                : "border-ink-200 text-ink-600 hover:border-ink-400"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>What Is Changing?</SubHeading>
            <p className="text-sm text-ink-800">{active.whatIsChanging}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>Why Now?</SubHeading>
            <p className="text-sm text-ink-800">{active.whyNow}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>Important Startups</SubHeading>
            <BulletList items={active.importantStartups} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>Important Public Companies</SubHeading>
            <BulletList items={active.importantPublicCompanies} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>Industries Affected</SubHeading>
            <BulletList items={active.industriesAffected} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>Potential Corporate Impact</SubHeading>
            <BulletList items={active.potentialCorporateImpact} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>Risks</SubHeading>
            <BulletList items={active.risks} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <SubHeading>5-Year Questions</SubHeading>
            <BulletList items={active.fiveYearQuestions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
