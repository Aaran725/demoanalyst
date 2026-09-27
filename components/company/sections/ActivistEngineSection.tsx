"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/analysis/SectionShell";
import type { ActivistMemo } from "@/lib/ai/company-schemas";

const FIELDS: { key: keyof ActivistMemo; label: string }[] = [
  { key: "businessVsExecution", label: "Great Business / Weak Execution?" },
  { key: "marginOpportunity", label: "Margin Opportunity" },
  { key: "capitalAllocationCritique", label: "Capital Allocation" },
  { key: "excessCashOrAssetValue", label: "Excess Cash / Asset Value" },
  { key: "buybackOrDivestitureOpportunity", label: "Buyback / Divestiture Opportunity" },
  { key: "pricingPower", label: "Pricing Power" },
  { key: "governanceAndIncentives", label: "Governance & Incentives" },
  { key: "operationalImprovements", label: "Operational Improvements" },
];

/**
 * "Activist Investor Analysis" — on-demand, applies an activist-style
 * operational/capital-allocation lens. Never claims a real activist
 * investor personally endorses these conclusions.
 */
export function ActivistEngineSection({ ticker }: { ticker: string }) {
  const [state, setState] = useState<
    { status: "idle" } | { status: "loading" } | { status: "error"; error: string } | { status: "success"; memo: ActivistMemo; isDemo: boolean }
  >({ status: "idle" });

  async function run() {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/company/activist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      const data = await res.json();
      if (data.mode === "error") {
        setState({ status: "error", error: data.error });
        return;
      }
      setState({ status: "success", memo: data.memo, isDemo: data.mode === "demo" });
    } catch {
      setState({ status: "error", error: "Activist Engine unavailable right now." });
    }
  }

  return (
    <SectionShell
      title="Activist / Ackman-Style Engine"
      description="An activist-style operational review — this is AARAN AI's own analysis, not a claim that any real activist investor endorses these conclusions."
    >
      {state.status === "idle" && (
        <Button size="lg" onClick={run}>
          Run Activist Analysis
        </Button>
      )}
      {state.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <Loader2 size={16} className="animate-spin" /> Building the activist-style review...
        </div>
      )}
      {state.status === "error" && (
        <Card className="border-red-100 bg-red-50/40">
          <CardContent className="flex items-start gap-2 p-5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-risk-high" />
            <p className="text-sm text-ink-800">{state.error}</p>
          </CardContent>
        </Card>
      )}
      {state.status === "success" && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-wide text-ink-500">Activist Investor Analysis</div>
              {state.isDemo && <Badge variant="outline">DEMO DATA</Badge>}
            </div>
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-1 border-b border-ink-100 pb-3 last:border-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{f.label}</div>
                <p className="text-sm leading-relaxed text-ink-800">{state.memo[f.key] as string}</p>
              </div>
            ))}
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Value Unlock Opportunities</div>
              <div className="space-y-2">
                {state.memo.valueUnlockOpportunities.map((v, i) => (
                  <div key={i} className="rounded-md border border-ink-100 p-3">
                    <div className="text-sm font-medium text-ink-900">{v.opportunity}</div>
                    <div className="mt-1 text-sm text-ink-600">{v.rationale}</div>
                    <div className="mt-1 text-xs text-ink-400">Potential impact: {v.potentialImpact}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </SectionShell>
  );
}
