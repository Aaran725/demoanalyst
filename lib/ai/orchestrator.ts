import type { AIProvider } from "./provider";
import type { ProgressStep } from "./progress";
import { callAgent } from "./callAgent";
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
 *            CompetitionAgent, FounderAgent  (all just need Round 1's output)
 *   Round 3: MoatAgent, StrategicFitAgent, PegasusFitAgent, JapanAgent,
 *            DevilsAdvocateAgent, DiligenceAgent (need Round 2's output)
 *   Round 4: MemoAgent (needs everything)
 */

export async function runAnalysisPipeline(
  provider: AIProvider,
  rawInput: unknown,
  onProgress?: (step: ProgressStep) => void
): Promise<FullAnalysis> {
  const input: StartupInput = startupInputSchema.parse(rawInput);

  onProgress?.("researching");
  const researchPrompt = buildResearchPrompt(input);
  const snapshot = await callAgent(
    provider,
    "ResearchAgent",
    startupSnapshotSchema,
    researchPrompt.system,
    researchPrompt.user
  );

  ["product", "market", "business_model", "traction", "competitors", "founders"].forEach((s) =>
    onProgress?.(s as ProgressStep)
  );
  const [market, product, businessModel, traction, competitors, founders] = await Promise.all([
    runStep(provider, "MarketAgent", marketIntelligenceSchema, buildMarketPrompt(input, snapshot)),
    runStep(provider, "ProductAgent", productAnalysisSchema, buildProductPrompt(input, snapshot)),
    runStep(
      provider,
      "BusinessModelAgent",
      businessModelSchema,
      buildBusinessModelPrompt(input, snapshot)
    ),
    runStep(provider, "TractionAgent", tractionSchema, buildTractionPrompt(input, snapshot)),
    runStep(
      provider,
      "CompetitionAgent",
      competitorMapSchema,
      buildCompetitionPrompt(input, snapshot)
    ),
    runStep(provider, "FounderAgent", founderAnalysisSchema, buildFounderPrompt(input, snapshot)),
  ]);

  ["moat", "strategic_fit", "pegasus_fit", "japan", "devils_advocate"].forEach((s) =>
    onProgress?.(s as ProgressStep)
  );
  const [moat, strategicFit, pegasusFit, japan, devilsAdvocate] = await Promise.all([
    runStep(
      provider,
      "MoatAgent",
      competitiveMoatSchema,
      buildMoatPrompt(input, snapshot, product, competitors)
    ),
    runStep(
      provider,
      "StrategicFitAgent",
      strategicFitSchema,
      buildStrategicFitPrompt(input, snapshot, market)
    ),
    runStep(provider, "PegasusFitAgent", pegasusFitSchema, buildPegasusFitPrompt(input, snapshot)),
    runStep(provider, "JapanAgent", japanOpportunitySchema, buildJapanPrompt(input, snapshot)),
    runStep(
      provider,
      "DevilsAdvocateAgent",
      devilsAdvocateSchema,
      buildDevilsAdvocatePrompt(input, snapshot, market, competitors)
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
    buildDiligencePrompt(input, snapshot, businessModel, traction, competitors, devilsAdvocate)
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
    buildMemoPrompt(input, analysisSoFar)
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
  };
}

/** Small helper so Promise.all entries above read as one line each. */
function runStep<T>(
  provider: AIProvider,
  agentName: string,
  schema: z.ZodType<T>,
  prompt: { system: string; user: string }
): Promise<T> {
  return callAgent(provider, agentName, schema, prompt.system, prompt.user);
}
