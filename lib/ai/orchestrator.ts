import type { AIProvider } from "./provider";
import type { ProgressStep } from "./progress";
import { callAgent, type AgentTraceInfo } from "./callAgent";
import {
  startupInputSchema,
  startupSnapshotSchema,
  marketIntelligenceSchema,
  productAnalysisSchema,
  businessModelSchema,
  tractionSchema,
  competitorMapSchema,
  competitiveMoatSchema,
  founderAnalysisSchema,
  strategicFitSchema,
  pegasusFitSchema,
  japanOpportunitySchema,
  devilsAdvocateSchema,
  criticalQuestionsSchema,
  founderQuestionsSchema,
  nextDiligenceSchema,
  icMemoSchema,
  type StartupInput,
  type FullAnalysis,
  type AgentTraceEntry,
} from "./schemas";
import { buildResearchPrompt } from "./prompts/research";
import { buildMarketPrompt } from "./prompts/market";
import { buildProductPrompt } from "./prompts/product";
import { buildBusinessModelPrompt } from "./prompts/businessModel";
import { buildTractionPrompt } from "./prompts/traction";
import { buildCompetitionPrompt } from "./prompts/competition";
import { buildMoatPrompt } from "./prompts/moat";
import { buildFounderPrompt } from "./prompts/founder";
import { buildStrategicFitPrompt } from "./prompts/strategicFit";
import { buildPegasusFitPrompt } from "./prompts/pegasusFit";
import { buildJapanPrompt } from "./prompts/japan";
import { buildDevilsAdvocatePrompt } from "./prompts/devilsAdvocate";
import { buildDiligencePrompt } from "./prompts/diligence";
import { buildMemoPrompt } from "./prompts/memo";
import { z } from "zod";

/**
 * The AARAN AI pipeline.
 * -----------------------
 * Conceptually the 14 agents run one after another (see docs/AI_AGENTS.md
 * for the full diagram). In practice, many of them only need the same
 * up-front research and don't depend on each other, so we run those in
 * parallel batches — this keeps a real Claude-backed analysis to roughly
 * 4 network round-trips deep instead of 14, which matters a lot for a live
 * demo with a five-minute clock running.
 *
 *   Round 1: ResearchAgent (everything else needs this first)
 *   Round 2: MarketAgent, ProductAgent, BusinessModelAgent, TractionAgent,
 *            CompetitionAgent, FounderAgent, PegasusFitAgent, JapanAgent
 *            (all just need Round 1's output — Pegasus/Japan only ever
 *            needed the snapshot, so there's no reason to make them wait
 *            behind Round 2 the way they used to)
 *   Round 3: MoatAgent, StrategicFitAgent, DevilsAdvocateAgent
 *            (the only agents that actually need Round 2's output)
 *   Round 4: DiligenceAgent, then MemoAgent (need everything)
 */

export async function runAnalysisPipeline(
  provider: AIProvider,
  rawInput: unknown,
  onProgress?: (step: ProgressStep) => void,
  signal?: AbortSignal
): Promise<FullAnalysis> {
  const input: StartupInput = startupInputSchema.parse(rawInput);

  // Real per-agent timing/web-search instrumentation for the Agent Trace
  // panel (components/analysis/AgentTracePanel.tsx) — see AgentTraceInfo in
  // callAgent.ts. Collected locally rather than threaded through onProgress
  // since it's meant to be inspected after the fact, not streamed live.
  const traces: AgentTraceEntry[] = [];
  const recordTrace = (round: number) => (t: AgentTraceInfo) =>
    traces.push({ ...t, round, usedWebSearch: t.webSearchCount > 0 });

  onProgress?.("researching");
  const researchPrompt = buildResearchPrompt(input);
  const snapshot = await callAgent(
    provider,
    "ResearchAgent",
    startupSnapshotSchema,
    researchPrompt.system,
    researchPrompt.user,
    signal,
    true,
    recordTrace(1)
  );

  [
    "product",
    "market",
    "business_model",
    "traction",
    "competitors",
    "founders",
    "pegasus_fit",
    "japan",
  ].forEach((s) => onProgress?.(s as ProgressStep));
  const [market, product, businessModel, traction, competitors, founders, pegasusFit, japan] =
    await Promise.all([
      runStep(
        provider,
        "MarketAgent",
        marketIntelligenceSchema,
        buildMarketPrompt(input, snapshot),
        signal,
        undefined,
        recordTrace(2)
      ),
      runStep(
        provider,
        "ProductAgent",
        productAnalysisSchema,
        buildProductPrompt(input, snapshot),
        signal,
        undefined,
        recordTrace(2)
      ),
      runStep(
        provider,
        "BusinessModelAgent",
        businessModelSchema,
        buildBusinessModelPrompt(input, snapshot),
        signal,
        undefined,
        recordTrace(2)
      ),
      runStep(
        provider,
        "TractionAgent",
        tractionSchema,
        buildTractionPrompt(input, snapshot),
        signal,
        true,
        recordTrace(2)
      ),
      runStep(
        provider,
        "CompetitionAgent",
        competitorMapSchema,
        buildCompetitionPrompt(input, snapshot),
        signal,
        undefined,
        recordTrace(2)
      ),
      runStep(
        provider,
        "FounderAgent",
        founderAnalysisSchema,
        buildFounderPrompt(input, snapshot),
        signal,
        true,
        recordTrace(2)
      ),
      runStep(
        provider,
        "PegasusFitAgent",
        pegasusFitSchema,
        buildPegasusFitPrompt(input, snapshot),
        signal,
        true,
        recordTrace(2)
      ),
      runStep(
        provider,
        "JapanAgent",
        japanOpportunitySchema,
        buildJapanPrompt(input, snapshot),
        signal,
        true,
        recordTrace(2)
      ),
    ]);

  ["moat", "strategic_fit", "devils_advocate"].forEach((s) => onProgress?.(s as ProgressStep));
  const [moat, strategicFit, devilsAdvocate] = await Promise.all([
    runStep(
      provider,
      "MoatAgent",
      competitiveMoatSchema,
      buildMoatPrompt(input, snapshot, product, competitors),
      signal,
      undefined,
      recordTrace(3)
    ),
    runStep(
      provider,
      "StrategicFitAgent",
      strategicFitSchema,
      buildStrategicFitPrompt(input, snapshot, market),
      signal,
      undefined,
      recordTrace(3)
    ),
    runStep(
      provider,
      "DevilsAdvocateAgent",
      devilsAdvocateSchema,
      buildDevilsAdvocatePrompt(input, snapshot, market, competitors),
      signal,
      undefined,
      recordTrace(3)
    ),
  ]);

  onProgress?.("diligence");
  const diligenceSchema = z.object({
    criticalQuestions: criticalQuestionsSchema,
    founderQuestions: founderQuestionsSchema,
    nextDiligence: nextDiligenceSchema,
  });
  const diligence = await runStep(
    provider,
    "DiligenceAgent",
    diligenceSchema,
    buildDiligencePrompt(input, snapshot, businessModel, traction, competitors, devilsAdvocate),
    signal,
    undefined,
    recordTrace(4)
  );

  const analysisSoFar = {
    snapshot,
    market,
    product,
    businessModel,
    traction,
    competitors,
    moat,
    founders,
    strategicFit,
    pegasusFit,
    japan,
    devilsAdvocate,
    criticalQuestions: diligence.criticalQuestions,
    founderQuestions: diligence.founderQuestions,
    nextDiligence: diligence.nextDiligence,
  };

  onProgress?.("memo");
  const memoOutput = await runStep(
    provider,
    "MemoAgent",
    z.object({
      executiveSummary: z.string(),
      missingInformation: z.array(z.string()),
      sources: icMemoSchema.shape.sources,
    }),
    buildMemoPrompt(input, analysisSoFar),
    signal,
    undefined,
    recordTrace(4)
  );

  onProgress?.("done");

  return {
    id: crypto.randomUUID(),
    input,
    isDemoData: false,
    createdAt: new Date().toISOString(),
    ...analysisSoFar,
    icMemo: {
      ...memoOutput,
      generatedAt: new Date().toISOString(),
    },
    agentTrace: traces,
  };
}

/** Small helper so Promise.all entries above read as one line each. */
function runStep<T>(
  provider: AIProvider,
  agentName: string,
  schema: z.ZodType<T>,
  prompt: { system: string; user: string },
  signal?: AbortSignal,
  enableWebSearch?: boolean,
  onTrace?: (info: AgentTraceInfo) => void
): Promise<T> {
  return callAgent(provider, agentName, schema, prompt.system, prompt.user, signal, enableWebSearch, onTrace);
}
