"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { StartupInputForm } from "@/components/analysis/StartupInputForm";
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAnalyze } from "@/lib/useAnalyze";

export default function AnalyzeStartupPage() {
  const router = useRouter();
  const { state, runAnalysis, useDemoFallback } = useAnalyze();

  useEffect(() => {
    if (state.status === "success") {
      router.push(`/analyze/${state.analysis.id}`);
    }
  }, [state, router]);

  if (state.status === "loading") {
    return <AnalysisProgress isDone={false} />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Analyze a Startup</h1>
        <p className="mt-1 text-sm text-ink-500">
          Enter what you know — even just a company name or website is enough. AARAN AI will fill in
          the rest and clearly label anything it couldn&apos;t verify.
        </p>
      </div>

      {state.status === "error" && (
        <Card className="border-red-100 bg-red-50/40">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-risk-high" />
              <p className="text-sm text-ink-800">{state.error}</p>
            </div>
            {state.demoFallback && (
              <Button size="sm" variant="secondary" onClick={useDemoFallback}>
                Use Demo Analysis Instead
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <StartupInputForm onSubmit={runAnalysis} />
    </div>
  );
}
