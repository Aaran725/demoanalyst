import type { FullAnalysis } from "./ai/schemas";
import { getDemoAnalysisById } from "./demo-data";
import { getCachedAnalysisById, getSavedAnalysisById } from "./storage";

/**
 * Finds an analysis by id wherever it might live: the 3 built-in demo
 * companies, this session's just-run cache, or the user's explicitly saved
 * research. Used by any page that renders `/analyze/[id]` or `/challenge/[id]`.
 */
export function findAnalysisById(id: string): FullAnalysis | undefined {
  return getDemoAnalysisById(id) ?? getCachedAnalysisById(id) ?? getSavedAnalysisById(id);
}
