"use client";

import { useState, useCallback } from "react";
import type { FollowUpDigest, Claim } from "./ai/schemas";

type FollowUpStatus =
  | { status: "loading" }
  | { status: "success"; answer: Claim }
  | { status: "unavailable"; notice: string }
  | { status: "error"; error: string };

export type FollowUpEntry = { id: string; question: string } & FollowUpStatus;

/**
 * Drives the live "Ask AARAN Anything" box (see
 * components/analysis/FollowUpQA.tsx). Accumulates a LIST of past Q&A pairs
 * (not just the latest), keyed by a generated id per entry rather than array
 * index — index-based patching would race if two questions are submitted in
 * quick succession, which is plausible live on stage.
 */
export function useFollowUp() {
  const [entries, setEntries] = useState<FollowUpEntry[]>([]);

  const patch = useCallback((id: string, next: FollowUpStatus) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { id: e.id, question: e.question, ...next } : e)));
  }, []);

  const ask = useCallback(
    async (digest: FollowUpDigest, question: string) => {
      const id = crypto.randomUUID();
      setEntries((prev) => [{ id, question, status: "loading" }, ...prev]);

      try {
        const res = await fetch("/api/follow-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ digest, question }),
        });
        const data = await res.json();

        if (data.mode === "unavailable") {
          patch(id, { status: "unavailable", notice: data.notice });
          return;
        }
        if (data.mode === "error") {
          patch(id, { status: "error", error: data.error });
          return;
        }
        patch(id, { status: "success", answer: data.result.answer });
      } catch (err) {
        patch(id, {
          status: "error",
          error: err instanceof Error ? err.message : "Something went wrong reaching the follow-up service.",
        });
      }
    },
    [patch]
  );

  return { entries, ask };
}
