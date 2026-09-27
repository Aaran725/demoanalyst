"use client";

import { useState, useCallback } from "react";
import type { FullAnalysis, StartupInput } from "./ai/schemas";
import { cacheAnalysis } from "./storage";

type AnalyzeState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; analysis: FullAnalysis; notice?: string }
  | { status: "error"; error: string; demoFallback?: FullAnalysis };

/**
 * Calls POST /api/analyze and manages the request lifecycle. Shared by the
 * Analyze Startup page and Challenge Mode so both get the same "never fail
 * a live demo" behavior (see app/api/analyze/route.ts).
 */
export function useAnalyze() {
  const [state, setState] = useState<AnalyzeState>({ status: "idle" });

  const runAnalysis = useCallback(async (input: StartupInput) => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();

      if (data.mode === "error") {
        setState({ status: "error", error: data.error, demoFallback: data.demoFallback });
        return;
      }

      cacheAnalysis(data.analysis);
      setState({ status: "success", analysis: data.analysis, notice: data.notice });
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong reaching the analysis service.",
      });
    }
  }, []);

  const useDemoFallback = useCallback(() => {
    if (state.status === "error" && state.demoFallback) {
      cacheAnalysis(state.demoFallback);
      setState({ status: "success", analysis: state.demoFallback, notice: "Showing demo analysis." });
    }
  }, [state]);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, runAnalysis, useDemoFallback, reset };
}
