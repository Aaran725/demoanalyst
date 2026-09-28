"use client";

import { useState } from "react";
import { MessageCircleQuestion, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFollowUp } from "@/lib/useFollowUp";
import { buildFollowUpDigest } from "@/lib/ai/prompts/followUpDigest";
import { ClaimBlock } from "./ClaimBlock";
import type { FullAnalysis } from "@/lib/ai/schemas";

/**
 * Live "Ask AARAN Anything" box — mounted above the report tabs (see
 * AnalysisView.tsx) so it's immediately visible, not buried in a tab. Anis
 * can type any question about this specific analysis and get a grounded,
 * evidence-tagged answer, rendered through the exact same <ClaimBlock> every
 * other claim in the app uses.
 */
export function FollowUpQA({ analysis }: { analysis: FullAnalysis }) {
  const [question, setQuestion] = useState("");
  const { entries, ask } = useFollowUp();
  const isAsking = entries[0]?.status === "loading";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    ask(buildFollowUpDigest(analysis), trimmed);
    setQuestion("");
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          <MessageCircleQuestion size={14} className="text-signal-600" />
          Ask AARAN Anything
        </h2>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600"
            placeholder="Ask a follow-up question about this company..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button type="submit" size="md" disabled={!question.trim() || isAsking}>
            {isAsking ? <Loader2 size={14} className="animate-spin" /> : "Ask"}
          </Button>
        </form>

        {entries.length > 0 && (
          <div className="space-y-3 border-t border-ink-100 pt-3">
            {entries.map((entry) => (
              <div key={entry.id} className="space-y-1.5">
                <p className="text-sm font-semibold text-ink-900">{entry.question}</p>
                {entry.status === "loading" && <p className="text-sm text-ink-400">Thinking...</p>}
                {entry.status === "unavailable" && <p className="text-sm text-ink-400">{entry.notice}</p>}
                {entry.status === "error" && <p className="text-sm text-red-600">{entry.error}</p>}
                {entry.status === "success" && <ClaimBlock claim={entry.answer} />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
