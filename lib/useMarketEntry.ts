"use client";

import { useState, useCallback } from "react";
import type { StartupInput, StartupSnapshot, MarketEntryOpportunity } from "./ai/schemas";

type MarketEntryState =
  | { status: "idle" }
  | { status: "loading"; market: string }
  | { status: "success"; market: string; result: MarketEntryOpportunity }
  | { status: "unavailable"; notice: string }
  | { status: "error"; error: string };

/**
 * Drives the on-demand "explore another market" tool (see
 * components/analysis/MarketEntryExplorer.tsx). Deliberately separate from
 * useAnalyze — that hook is tied to StartupInput -> FullAnalysis and caches
 * into sessionStorage, neither of which applies to this single, smaller,
 * not-cached agent call.
 */
export function useMarketEntry() {
  const [state, setState] = useState<MarketEntryState>({ status: "idle" });

  const run = useCallback(async (input: StartupInput, snapshot: StartupSnapshot, market: string) => {
    setState({ status: "loading", market });
    try {
      const res = await fetch("/api/market-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, snapshot, market }),
      });
      const data = await res.json();

      if (data.mode === "unavailable") {
        setState({ status: "unavailable", notice: data.notice });
        return;
      }
      if (data.mode === "error") {
        setState({ status: "error", error: data.error });
        return;
      }
      setState({ status: "success", market, result: data.result });
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong reaching the market entry service.",
      });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, run, reset };
}
