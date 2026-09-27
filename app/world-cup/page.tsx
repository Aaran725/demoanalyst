"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllAvailableAnalyses } from "@/lib/storage";
import { buildComparisonDigest } from "@/lib/ai/prompts/comparisonDigest";
import { useStartupComparison } from "@/lib/useStartupComparison";
import { CompareView } from "@/components/world-cup/CompareView";
import type { FullAnalysis } from "@/lib/ai/schemas";

const selectClass =
  "rounded-md border border-ink-200 bg-white px-2.5 py-1.5 text-sm text-ink-800 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600";

/**
 * "Which of your researched companies could be a strong Startup World Cup
 * candidate?" — Pegasus Tech Ventures runs the real Startup World Cup, so
 * this is a direct, honest hook into their actual flagship program, backed
 * by the user's own real analyzed companies (the 3 built-in demo companies
 * plus anything saved/run this session — see getAllAvailableAnalyses) and a
 * real AI comparison, not a hardcoded fictional dataset.
 */
export default function WorldCupScoutPage() {
  const [available, setAvailable] = useState<FullAnalysis[]>([]);
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const { state, compare, reset } = useStartupComparison();

  useEffect(() => {
    setAvailable(getAllAvailableAnalyses());
  }, []);

  const sectors = useMemo(
    () => Array.from(new Set(available.map((a) => a.snapshot.sector))).sort(),
    [available]
  );
  const stages = useMemo(
    () => Array.from(new Set(available.map((a) => a.snapshot.stage))).sort(),
    [available]
  );

  const filtered = available.filter(
    (a) => (!sector || a.snapshot.sector === sector) && (!stage || a.snapshot.stage === stage)
  );

  function toggleSelect(id: string) {
    reset();
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }

  const selectedAnalyses = available.filter((a) => selected.includes(a.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Trophy className="text-signal-600" size={22} />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Startup World Cup AI Scout</h1>
          <p className="text-sm text-ink-500">
            Which of your researched companies could be a strong Startup World Cup candidate? Backed by
            your own real analyses — select 2–4 to compare.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select className={selectClass} value={sector} onChange={(e) => setSector(e.target.value)}>
          <option value="">All Sectors</option>
          {sectors.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className={selectClass} value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">All Stages</option>
          {stages.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-md bg-signal-50 px-4 py-2.5 text-sm text-signal-700">
          <Scale size={14} />
          {selected.length} selected for comparison (max 4)
          <Button size="sm" variant="ghost" onClick={() => { setSelected([]); reset(); }}>Clear</Button>
          {selected.length >= 2 && (
            <Button
              size="sm"
              onClick={() => compare(selectedAnalyses.map(buildComparisonDigest))}
              disabled={state.status === "loading"}
            >
              Compare {selected.length} Companies
            </Button>
          )}
        </div>
      )}

      {state.status === "loading" && <p className="text-sm text-ink-400">Comparing...</p>}

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

      {state.status === "success" && <CompareView comparison={state.comparison} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Card
            key={a.id}
            className={selected.includes(a.id) ? "border-signal-600 ring-1 ring-signal-600" : ""}
          >
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-ink-950">
                    {a.snapshot.companyName}
                    {a.isDemoData && <Badge variant="outline">DEMO DATA</Badge>}
                  </div>
                  <div className="text-xs text-ink-400">
                    {a.snapshot.sector} &middot; {a.snapshot.stage}
                  </div>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-ink-400">
                  <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} />
                  Compare
                </label>
              </div>
              <p className="text-sm text-ink-700">{a.snapshot.solution.text}</p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-400">
            No researched companies match these filters.
          </p>
        )}
      </div>
    </div>
  );
}
