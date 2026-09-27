"use client";

import { useMemo, useState } from "react";
import { Trophy, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SCOUT_STARTUPS, type ScoutStartup } from "@/lib/demo-data/world-cup";
import { CompareView } from "@/components/world-cup/CompareView";

const selectClass =
  "rounded-md border border-ink-200 bg-white px-2.5 py-1.5 text-sm text-ink-800 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600";

function uniqueValues<K extends keyof ScoutStartup>(key: K): string[] {
  return Array.from(new Set(SCOUT_STARTUPS.map((s) => String(s[key])))).sort();
}

export default function WorldCupScoutPage() {
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [stage, setStage] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      SCOUT_STARTUPS.filter(
        (s) =>
          (!sector || s.sector === sector) &&
          (!country || s.country === country) &&
          (!stage || s.stage === stage) &&
          (!businessModel || s.businessModel === businessModel)
      ),
    [sector, country, stage, businessModel]
  );

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }

  const selectedStartups = SCOUT_STARTUPS.filter((s) => selected.includes(s.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Trophy className="text-signal-600" size={22} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Startup World Cup AI Scout</h1>
          <p className="text-sm text-ink-500">
            Filter by transparent, stated criteria — not an unexplained ranking. Sample data; production
            use would connect a live company database.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select className={selectClass} value={sector} onChange={(e) => setSector(e.target.value)}>
          <option value="">All Sectors</option>
          {uniqueValues("sector").map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className={selectClass} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All Countries</option>
          {uniqueValues("country").map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className={selectClass} value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">All Stages</option>
          {uniqueValues("stage").map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className={selectClass} value={businessModel} onChange={(e) => setBusinessModel(e.target.value)}>
          <option value="">All Business Models</option>
          {uniqueValues("businessModel").map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-signal-50 px-4 py-2.5 text-sm text-signal-700">
          <Scale size={14} />
          {selected.length} selected for comparison (max 4)
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
        </div>
      )}

      {selectedStartups.length >= 2 && <CompareView startups={selectedStartups} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.id} className={selected.includes(s.id) ? "border-signal-600 ring-1 ring-signal-600" : ""}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-ink-950">{s.name}</div>
                  <div className="text-xs text-ink-400">{s.sector} · {s.country} · {s.stage}</div>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-ink-400">
                  <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} />
                  Compare
                </label>
              </div>
              <p className="text-sm text-ink-700">{s.snapshot}</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">{s.technology}</Badge>
                <Badge variant="outline">Revenue: {s.revenueRange}</Badge>
                <Badge variant="outline">Growth: {s.growth}</Badge>
                <Badge variant="outline">Corporate Fit: {s.corporateFit}</Badge>
                <Badge variant="outline">Japan: {s.japanOpportunity}</Badge>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Differentiation</div>
                <p className="text-sm text-ink-600">{s.differentiation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-400">No startups match these filters.</p>
        )}
      </div>
    </div>
  );
}
