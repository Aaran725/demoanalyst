"use client";

import { useState, useCallback, useRef } from "react";
import type { FullCompanyAnalysis } from "./ai/company-schemas";
import { cacheCompanyAnalysis } from "./company-storage";

type CompanyAnalyzeState =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; analysis: FullCompanyAnalysis; notice?: string }
  | { status: "error"; error: string }
  | { status: "cancelled" };

/** Mirrors lib/useAnalyze.ts for the public-equity pipeline — real cancellation, same "never fail a live demo" contract. */
export function useCompanyAnalyze() {
  const [state, setState] = useState<CompanyAnalyzeState>({ status: "idle" });
  const abortControllerRef = useRef<AbortController | null>(null);

  const runAnalysis = useCallback(async (ticker: string) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setState({ status: "loading", startedAt: Date.now() });

    try {
      const res = await fetch("/api/company/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
        signal: controller.signal,
      });
      const data = await res.json();

      if (data.mode === "cancelled") {
        setState({ status: "cancelled" });
        return;
      }
      if (data.mode === "error") {
        setState({ status: "error", error: data.error });
        return;
      }

      cacheCompanyAnalysis(data.analysis);
      setState({ status: "success", analysis: data.analysis, notice: data.notice });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setState({ status: "cancelled" });
        return;
      }
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong reaching the analysis service.",
      });
    }
  }, []);

  const cancel = useCallback(() => abortControllerRef.current?.abort(), []);
  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, runAnalysis, cancel, reset };
}
