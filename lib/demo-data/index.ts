import type { FullAnalysis } from "../ai/schemas";
import { CARGOFOX_ANALYSIS } from "./warehouse-robotics";
import { AVELINE_ANALYSIS } from "./healthcare-ai";
import { LEDGERLINE_ANALYSIS } from "./enterprise-ai-agent";

/** The 3 built-in demo companies. Always available, zero API keys required. */
export const DEMO_ANALYSES: FullAnalysis[] = [CARGOFOX_ANALYSIS, AVELINE_ANALYSIS, LEDGERLINE_ANALYSIS];

export { CARGOFOX_ANALYSIS, AVELINE_ANALYSIS, LEDGERLINE_ANALYSIS };

export function getDemoAnalysisById(id: string): FullAnalysis | undefined {
  return DEMO_ANALYSES.find((a) => a.id === id);
}

/**
 * Picks the closest demo company by name for a free-text search (Challenge
 * Mode / Analyze Startup with demo mode on). Falls back to the first demo
 * company if nothing matches, so the app never has "no result" in demo mode.
 */
export function findDemoAnalysisForQuery(query: string): FullAnalysis {
  const q = query.trim().toLowerCase();
  const match = DEMO_ANALYSES.find(
    (a) =>
      a.snapshot.companyName.toLowerCase().includes(q) ||
      q.includes(a.snapshot.companyName.toLowerCase().split(" ")[0])
  );
  return match ?? DEMO_ANALYSES[0];
}
