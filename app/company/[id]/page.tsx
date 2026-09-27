"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CompanyAnalysisView } from "@/components/company/CompanyAnalysisView";
import { Button } from "@/components/ui/button";
import { findCompanyAnalysis } from "@/lib/company-storage";
import type { FullCompanyAnalysis } from "@/lib/ai/company-schemas";

export default function CompanyAnalysisResultPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = useState<FullCompanyAnalysis | null | undefined>(undefined);

  useEffect(() => {
    setAnalysis(findCompanyAnalysis(params.id) ?? null);
  }, [params.id]);

  if (analysis === undefined) {
    return <p className="py-16 text-center text-sm text-ink-400">Loading...</p>;
  }

  if (analysis === null) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-16 text-center">
        <h1 className="text-lg font-semibold text-ink-950">Analysis not found</h1>
        <p className="text-sm text-ink-500">
          This analysis isn&apos;t in this browser session. Analyses that aren&apos;t explicitly saved are
          only kept for the current tab session.
        </p>
        <Button asChild>
          <Link href="/company">Run a New Analysis</Link>
        </Button>
      </div>
    );
  }

  return <CompanyAnalysisView analysis={analysis} />;
}
