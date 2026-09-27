"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Ban } from "lucide-react";
import { TickerInputForm } from "@/components/company/TickerInputForm";
import { CompanyProgress } from "@/components/company/CompanyProgress";
import { Card, CardContent } from "@/components/ui/card";
import { useCompanyAnalyze } from "@/lib/useCompanyAnalyze";

export default function AnalyzeCompanyPage() {
  const router = useRouter();
  const { state, runAnalysis, cancel } = useCompanyAnalyze();

  useEffect(() => {
    if (state.status === "success") {
      router.push(`/company/${state.analysis.id}`);
    }
  }, [state, router]);

  if (state.status === "loading") {
    return <CompanyProgress isDone={false} startedAt={state.startedAt} onCancel={cancel} />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Analyze a Public Company</h1>
        <p className="mt-1 text-sm text-ink-500">
          Enter a US-listed ticker. AARAN AI pulls real SEC filings and market data, deploys a 10-agent
          Investment Committee, and shows exactly which claims are verified, estimated, or unverified.
        </p>
      </div>

      {state.status === "cancelled" && (
        <Card className="border-ink-200 bg-ink-50">
          <CardContent className="flex items-center gap-2 p-5">
            <Ban size={16} className="shrink-0 text-ink-400" />
            <p className="text-sm text-ink-700">Cancelled — no further API calls were made. Try again below.</p>
          </CardContent>
        </Card>
      )}

      {state.status === "error" && (
        <Card className="border-red-100 bg-red-50/40">
          <CardContent className="flex items-start gap-2 p-5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-risk-high" />
            <p className="text-sm text-ink-800">{state.error}</p>
          </CardContent>
        </Card>
      )}

      <TickerInputForm onSubmit={runAnalysis} />
    </div>
  );
}
