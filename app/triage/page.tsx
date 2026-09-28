"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, ArrowRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvidenceTag } from "@/components/analysis/EvidenceTag";
import { useTriage } from "@/lib/useTriage";

/**
 * Deal Flow Triage — paste 2-10 company names, get a fast lightweight pass
 * on all of them side by side. Mirrors how a real VC fund actually triages
 * deal flow: a quick first pass to decide what's worth a full analysis, not
 * a replacement for the full 14-agent Analyze Startup pipeline (see
 * lib/ai/prompts/triage.ts for why this is deliberately cheaper/shallower).
 */
export default function DealFlowTriagePage() {
  const [text, setText] = useState("");
  const { state, run } = useTriage();

  const lines = Array.from(
    new Set(
      text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    )
  );
  const canSubmit = lines.length >= 2 && lines.length <= 10;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    run(lines);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center gap-3">
        <ClipboardList className="text-signal-600" size={22} />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Deal Flow Triage</h1>
          <p className="text-sm text-ink-500">
            Paste 2-10 company names for a fast first pass, side by side — the same triage step a real
            fund runs before committing to a full deep dive.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Company names (one per line, 2-10)
            </label>
            <textarea
              className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600"
              rows={6}
              placeholder={"Cargofox Robotics\nExample AI Inc.\nAnother Startup Co."}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-400">
                {lines.length} {lines.length === 1 ? "company" : "companies"} entered
                {lines.length > 10 && " — max 10"}
              </p>
              <Button type="submit" disabled={!canSubmit || state.status === "loading"}>
                Run Triage
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {state.status === "loading" && <p className="text-sm text-ink-400">Running triage on {lines.length} companies...</p>}

      {state.status === "unavailable" && (
        <Card className="border-evidence-assumptionBg bg-evidence-assumptionBg/40">
          <CardContent className="p-4 text-sm text-ink-700">{state.notice}</CardContent>
        </Card>
      )}

      {state.status === "error" && (
        <Card className="border-red-100 bg-red-50/40">
          <CardContent className="p-4 text-sm text-ink-700">{state.error}</CardContent>
        </Card>
      )}

      {state.status === "success" && (
        <div className="space-y-3">
          {state.results.map((row) => (
            <Card key={row.companyName}>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-ink-950">{row.companyName}</div>
                    {row.status === "ok" && (
                      <div className="text-xs text-ink-400">
                        {row.entry.sector} &middot; {row.entry.stage}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/analyze?company=${encodeURIComponent(row.companyName)}`}
                    className="flex shrink-0 items-center gap-1 text-xs font-semibold text-signal-600 hover:underline"
                  >
                    Full Analysis <ArrowRight size={12} />
                  </Link>
                </div>

                {row.status === "error" ? (
                  <div className="flex items-start gap-2 text-sm text-red-600">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    {row.error}
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-ink-700">{row.entry.summary.text}</p>
                      <EvidenceTag status={row.entry.summary.status} />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <p className="text-xs text-ink-600">
                        <span className="font-semibold text-evidence-fact">Opportunity: </span>
                        {row.entry.opportunitySignal}
                      </p>
                      <p className="text-xs text-ink-600">
                        <span className="font-semibold text-evidence-assumption">Risk: </span>
                        {row.entry.riskSignal}
                      </p>
                    </div>
                    <p className="text-xs text-ink-400">
                      <span className="font-semibold">Key open question: </span>
                      {row.entry.keyOpenQuestion}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
