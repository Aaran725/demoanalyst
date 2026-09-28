"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Ban } from "lucide-react";
import { StartupInputForm } from "@/components/analysis/StartupInputForm";
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAnalyze } from "@/lib/useAnalyze";

// useSearchParams() requires a <Suspense> boundary in Next.js 14's App
// Router (it bails the page out of static rendering otherwise), so the page
// component below is a thin wrapper and all the real logic lives in this
// inner component.
function AnalyzeStartupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCompanyName = searchParams.get("company") ?? "";
  const { state, runAnalysis, cancel, useDemoFallback } = useAnalyze();

  useEffect(() => {
    if (state.status === "success") {
      router.push(`/analyze/${state.analysis.id}`);
    }
  }, [state, router]);

  if (state.status === "loading") {
    return (
      <AnalysisProgress
        isDone={false}
        startedAt={state.startedAt}
        currentStep={state.currentStep}
        onCancel={cancel}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Analyze a Startup</h1>
        <p className="mt-1 text-sm text-ink-500">
          Enter what you know — even just a company name or website is enough. AARAN AI will fill in
          the rest and clearly label anything it couldn&apos;t verify.
        </p>
      </div>

      {state.status === "cancelled" && (
        <Card className="border-ink-200 bg-ink-50">
          <CardContent className="flex items-center gap-2 p-5">
            <Ban size={16} className="shrink-0 text-ink-400" />
            <p className="text-sm text-ink-700">
              Cancelled — no further API calls were made for that run. Try again below.
            </p>
          </CardContent>
        </Card>
      )}

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

      <Card>
        <CardContent className="p-6">
          <StartupInputForm onSubmit={runAnalysis} initialCompanyName={initialCompanyName} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyzeStartupPage() {
  return (
    <Suspense fallback={null}>
      <AnalyzeStartupPageInner />
    </Suspense>
  );
}
