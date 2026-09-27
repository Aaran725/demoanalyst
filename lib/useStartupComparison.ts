"use client";

import { useState, useCallback } from "react";
import type { ComparisonDigest, StartupComparison } from "./ai/schemas";

type StartupComparisonState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; comparison: StartupComparison }
  | { status: "unavailable"; notice: string }
  | { status: "error"; error: string };

/** Drives the real Startup Comparison Engine behind World Cup Scout. */
export function useStartupComparison() {
  const [state, setState] = useState<StartupComparisonState>({ status: "idle" });

  const compare = useCallback(async (digests: ComparisonDigest[]) => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/compare-startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digests }),
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
      setState({ status: "success", comparison: data.comparison });
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong reaching the comparison service.",
      });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, compare, reset };
}
