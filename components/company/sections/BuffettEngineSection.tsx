"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/analysis/SectionShell";
import { BulletList } from "@/components/analysis/SectionShell";
import type { BuffettMemo } from "@/lib/ai/company-schemas";

const FIELDS: { key: keyof BuffettMemo; label: string }[] = [
  { key: "business", label: "Business" },
  { key: "competitiveAdvantage", label: "Competitive Advantage" },
  { key: "economics", label: "Economics" },
  { key: "management", label: "Management" },
  { key: "capitalAllocation", label: "Capital Allocation" },
  { key: "financialQuality", label: "Financial Quality" },
  { key: "valuation", label: "Valuation" },
  { key: "risks", label: "Risks" },
];

/**
 * "Analyze Like Buffett" — on-demand, not part of the default pipeline.
 * Applies long-term quality/value-investing principles; never claims Warren
 * Buffett himself reviewed this company.
 */
export function BuffettEngineSection({ ticker }: { ticker: string }) {
  const [state, setState] = useState<
    { status: "idle" } | { status: "loading" } | { status: "error"; error: string } | { status: "success"; memo: BuffettMemo; isDemo: boolean }
  >({ status: "idle" });

  async function run() {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/company/buffett", {
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
      setState({ status: "error", error: "Buffett Engine unavailable right now." });
    }
  }

  return (
    <SectionShell
      title="Buffett Engine"
      description="Applies long-term quality/value-investing principles — this is AARAN AI's own analysis, not a claim that Warren Buffett reviewed this company."
    >
      {state.status === "idle" && (
        <Button size="lg" onClick={run}>
          Analyze Like Buffett
        </Button>
      )}
      {state.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <Loader2 size={16} className="animate-spin" /> Building the long-term quality investment memo...
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
              <div className="text-sm font-semibold uppercase tracking-wide text-ink-500">Long-Term Quality Investment Memo</div>
              {state.isDemo && <Badge variant="outline">DEMO DATA</Badge>}
            </div>
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-1 border-b border-ink-100 pb-3 last:border-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{f.label}</div>
                <p className="text-sm leading-relaxed text-ink-800">{state.memo[f.key] as string}</p>
              </div>
            ))}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">What Must Be True</div>
                <BulletList items={state.memo.whatMustBeTrue} />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">What Could Break the Thesis</div>
                <BulletList items={state.memo.whatCouldBreakTheThesis} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </SectionShell>
  );
}
