"use client";

import { useState, useCallback, useRef } from "react";
import type { FullAnalysis, StartupInput } from "./ai/schemas";
import { cacheAnalysis } from "./storage";

type AnalyzeState =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; analysis: FullAnalysis; notice?: string }
  | { status: "error"; error: string; demoFallback?: FullAnalysis }
  | { status: "cancelled" };

/**
 * Calls POST /api/analyze and manages the request lifecycle. Shared by the
 * Analyze Startup page and Challenge Mode so both get the same "never fail
 * a live demo" behavior (see app/api/analyze/route.ts).
 *
 * Cancellation is real, not cosmetic: the AbortController's signal is sent
 * with the fetch, and the API route forwards it into every Claude call
 * (see lib/ai/orchestrator.ts). Clicking Cancel stops in-flight and future
 * API spend immediately — it doesn't just stop the browser from waiting.
 */
export function useAnalyze() {
  const [state, setState] = useState<AnalyzeState>({ status: "idle" });
  const abortControllerRef = useRef<AbortController | null>(null);

  const runAnalysis = useCallback(async (input: StartupInput) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setState({ status: "loading", startedAt: Date.now() });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      const data = await res.json();

      if (data.mode === "cancelled") {
        setState({ status: "cancelled" });
        return;
      }

      if (data.mode === "error") {
        setState({ status: "error", error: data.error, demoFallback: data.demoFallback });
        return;
      }

      cacheAnalysis(data.analysis);
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

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const useDemoFallback = useCallback(() => {
    if (state.status === "error" && state.demoFallback) {
      cacheAnalysis(state.demoFallback);
      setState({ status: "success", analysis: state.demoFallback, notice: "Showing demo analysis." });
    }
  }, [state]);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, runAnalysis, cancel, useDemoFallback, reset };
}
