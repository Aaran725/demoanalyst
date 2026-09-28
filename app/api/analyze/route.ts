import { runAnalysisPipeline } from "@/lib/ai/orchestrator";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { findDemoAnalysisForQuery } from "@/lib/demo-data";
import { startupInputSchema } from "@/lib/ai/schemas";
import type { AnalyzeStreamEvent } from "@/lib/ai/streamEvents";

/**
 * POST /api/analyze
 * -------------------
 * This is the ONLY server route that talks to the Claude API. The browser
 * never sees ANTHROPIC_API_KEY — it only ever calls this endpoint.
 *
 * The response is streamed as newline-delimited JSON (see
 * lib/ai/streamEvents.ts) rather than one final JSON blob, so the browser
 * gets a real "progress" event the instant each pipeline round actually
 * finishes — not a fake, timer-driven simulation (see
 * components/analysis/AnalysisProgress.tsx's previous version).
 *
 * Behavior:
 *  - DEMO_MODE=true (or no ANTHROPIC_API_KEY set): always returns one of the
 *    3 built-in demo companies, picked by best name match, as a single
 *    immediate "done" event — there's no real pipeline to report progress
 *    on, so no fake progress events are sent. This is what makes the app
 *    "never fail" during a live presentation.
 *  - Otherwise: runs the real 14-agent Claude pipeline, streaming a
 *    "progress" event at each round boundary. If anything fails (rate
 *    limit, timeout, malformed output even after retry), we send a clear
 *    "error" event PLUS a demo fallback so the UI can offer "Use demo
 *    analysis" instead of a dead end.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedInput = startupInputSchema.safeParse(body);

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AnalyzeStreamEvent) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        } catch {
          // Client already disconnected — nothing to do. request.signal
          // (threaded into runAnalysisPipeline below) is what actually
          // stops in-flight Anthropic spend, not this write succeeding.
        }
      };
      const closeOnce = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          // Already closed/errored — fine, we only ever wanted it closed.
        }
      };

      if (!parsedInput.success) {
        send({ type: "error", error: "Please provide at least a company name." });
        return closeOnce();
      }
      const input = parsedInput.data;
      const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;

      if (demoMode) {
        const analysis = findDemoAnalysisForQuery(input.companyName);
        send({
          type: "done",
          mode: "demo",
          analysis,
          notice: !process.env.ANTHROPIC_API_KEY
            ? "No ANTHROPIC_API_KEY configured — showing demo data."
            : "Demo Mode is enabled — showing demo data.",
        });
        return closeOnce();
      }

      try {
        const provider = createAnthropicProvider();
        // request.signal fires when the browser cancels or disconnects — passing
        // it through to every Claude call means clicking "Cancel" actually stops
        // in-flight and future API calls, not just the browser's own waiting.
        const analysis = await runAnalysisPipeline(
          provider,
          input,
          (step) => send({ type: "progress", step }),
          request.signal,
          (event) => {
            switch (event.type) {
              case "start":
                return send({ type: "agent_start", agent: event.agentName });
              case "search":
                return send({ type: "agent_search", agent: event.agentName, query: event.query });
              case "sources":
                return send({ type: "agent_sources", agent: event.agentName, sources: event.sources });
              case "done":
                return send({
                  type: "agent_done",
                  agent: event.agentName,
                  durationMs: event.durationMs,
                  webSearchCount: event.webSearchCount,
                });
            }
          }
        );
        send({ type: "done", mode: "live", analysis });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Analysis cancelled by client.");
          send({ type: "cancelled" });
        } else {
          console.error("Live analysis failed:", err);
          send({
            type: "error",
            error:
              "Live research unavailable right now. This can happen if the AI service is rate-limited or times out.",
            demoFallback: findDemoAnalysisForQuery(input.companyName),
          });
        }
      } finally {
        closeOnce();
      }
    },
  });

  return new Response(stream, {
    status: parsedInput.success ? 200 : 400,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      // Defensive: tells an nginx-fronted deployment not to buffer this
      // response. Harmless no-op on hosts that don't look at this header.
      "X-Accel-Buffering": "no",
    },
  });
}
