"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Swords, FileText, Network, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisSummaryCard } from "@/components/analysis/AnalysisSummaryCard";
import { getSavedAnalyses } from "@/lib/storage";
import { DEMO_ANALYSES } from "@/lib/demo-data";
import type { FullAnalysis } from "@/lib/ai/schemas";

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Search }) {
  return (
    <Card className="rounded-lg">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="font-mono text-3xl font-bold tracking-tight text-ink-950">{value}</div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-signal-50 text-signal-600">
          <Icon size={18} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [saved, setSaved] = useState<FullAnalysis[]>([]);

  useEffect(() => {
    setSaved(getSavedAnalyses());
  }, []);

  const allAnalyses = saved.length > 0 ? saved : DEMO_ANALYSES;
  const strategicMatchCount = allAnalyses.reduce((sum, a) => sum + a.strategicFit.matches.length, 0);
  const memoCount = allAnalyses.filter((a) => a.icMemo).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-signal-600 font-mono text-lg font-extrabold text-white shadow-button">
            A
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">
              AARAN AI <span className="font-medium text-ink-400">Junior VC Copilot</span>
            </h1>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-ink-400">Built by Aaran Chowdhery</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link href="/challenge">
              <Swords size={16} /> Challenge AARAN AI
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/analyze">
              Analyze a Startup <Search size={16} />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Companies Researched" value={allAnalyses.length} icon={Building2} />
        <StatCard label="Strategic Matches" value={strategicMatchCount} icon={Network} />
        <StatCard label="IC Memos" value={memoCount} icon={FileText} />
        <StatCard label="Saved Analyses" value={saved.length} icon={Search} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            {saved.length > 0 ? "Recent Startup Analyses" : "Try a Demo Analysis"}
          </h2>
          {saved.length === 0 && <span className="text-xs text-ink-400">No saved research yet — these are built-in samples</span>}
        </div>
        <Card className="divide-y divide-ink-100 overflow-hidden p-0">
          {allAnalyses.map((a) => (
            <AnalysisSummaryCard key={a.id} analysis={a} />
          ))}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Explore More</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Link href="/tech-radar" className="text-signal-600 hover:underline">Technology Radar →</Link>
            <Link href="/public-markets" className="text-signal-600 hover:underline">Public Market Intelligence →</Link>
            <Link href="/world-cup" className="text-signal-600 hover:underline">Startup World Cup AI Scout →</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Here?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Link href="/how-it-works" className="text-signal-600 hover:underline">How AARAN AI Works →</Link>
            <Link href="/saved" className="text-signal-600 hover:underline">View Saved Research →</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
