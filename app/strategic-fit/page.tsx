"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { getSavedAnalyses } from "@/lib/storage";
import { DEMO_ANALYSES } from "@/lib/demo-data";
import type { Confidence, FullAnalysis } from "@/lib/ai/schemas";

const CONFIDENCE_VARIANT: Record<Confidence, BadgeProps["variant"]> = {
  high: "low",
  medium: "medium",
  low: "neutral",
};

export default function StrategicFitHubPage() {
  const [saved, setSaved] = useState<FullAnalysis[]>([]);

  useEffect(() => {
    setSaved(getSavedAnalyses());
  }, []);

  const analyses = saved.length > 0 ? saved : DEMO_ANALYSES;
  const allMatches = analyses.flatMap((a) =>
    a.strategicFit.matches.map((m) => ({ ...m, company: a.snapshot.companyName, analysisId: a.id }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Network className="text-signal-600" size={22} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Strategic Fit Engine</h1>
          <p className="text-sm text-ink-500">
            Every strategic match found across your analyzed startups. Run a new analysis from{" "}
            <Link href="/analyze" className="text-signal-600 hover:underline">Analyze Startup</Link> to add more.
          </p>
        </div>
      </div>

      {saved.length === 0 && (
        <p className="text-xs text-ink-400">No saved research yet — showing matches from the 3 built-in demo companies.</p>
      )}

      <div className="grid gap-4">
        {allMatches.map((m, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/analyze/${m.analysisId}`} className="text-xs font-medium text-signal-600 hover:underline">
                    {m.company}
                  </Link>
                  <div className="text-base font-semibold text-ink-950">{m.companyOrIndustry}</div>
                </div>
                <Badge variant={CONFIDENCE_VARIANT[m.confidence]}>{m.confidence.toUpperCase()} CONFIDENCE</Badge>
              </div>
              <p className="text-sm text-ink-700">{m.rationale}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
