import type { Claim, EvidenceStatus, Source } from "../ai/schemas";

/**
 * Small helpers for writing demo-data files without repeating
 * `{ text, status: "..." }` a hundred times. Used only by the three sample
 * companies in this folder — real AI output never goes through here.
 */
export function claim(text: string, status: EvidenceStatus, sources?: Source[]): Claim {
  return { text, status, sources };
}

export const fact = (text: string, sources: Source[]) => claim(text, "verified_fact", sources);
export const analysis = (text: string) => claim(text, "ai_analysis");
export const assumption = (text: string) => claim(text, "assumption");
export const unknown = (text: string = "Not publicly verified.") => claim(text, "unknown");
