"use client";

import { useState, useCallback } from "react";
import type { TriageEntry } from "./ai/schemas";

export type TriageResultRow =
  | { companyName: string; status: "ok"; entry: TriageEntry }
  | { companyName: string; status: "error"; error: string };

type TriageState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; results: TriageResultRow[] }
  | { status: "unavailable"; notice: string }
  | { status: "error"; error: string };

/** Drives the Deal Flow Triage page (see app/triage/page.tsx). */
export function useTriage() {
  const [state, setState] = useState<TriageState>({ status: "idle" });

  const run = useCallback(async (companyNames: string[]) => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyNames }),
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
      setState({ status: "success", results: data.results });
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong reaching the triage service.",
      });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, run, reset };
}
