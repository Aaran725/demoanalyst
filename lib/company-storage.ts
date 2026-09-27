import type { FullCompanyAnalysis } from "./ai/company-schemas";

/** Mirrors lib/storage.ts for public-equity analyses — kept as a separate namespace so the two products never collide. */
const STORAGE_KEY = "aaran-ai:saved-company-analyses";
const SESSION_CACHE_KEY = "aaran-ai:recent-company-analyses";
const SESSION_CACHE_LIMIT = 20;

export function getSavedCompanyAnalyses(): FullCompanyAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FullCompanyAnalysis[]) : [];
  } catch {
    return [];
  }
}

export function saveCompanyAnalysis(analysis: FullCompanyAnalysis): void {
  if (typeof window === "undefined") return;
  const existing = getSavedCompanyAnalyses().filter((a) => a.id !== analysis.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([analysis, ...existing]));
}

export function deleteCompanyAnalysis(id: string): void {
  if (typeof window === "undefined") return;
  const updated = getSavedCompanyAnalyses().filter((a) => a.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function cacheCompanyAnalysis(analysis: FullCompanyAnalysis): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    const existing: FullCompanyAnalysis[] = raw ? JSON.parse(raw) : [];
    const updated = [analysis, ...existing.filter((a) => a.id !== analysis.id)].slice(0, SESSION_CACHE_LIMIT);
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(updated));
  } catch {
    // sessionStorage can throw in private browsing — non-critical.
  }
}

export function getCachedCompanyAnalysisById(id: string): FullCompanyAnalysis | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    const existing: FullCompanyAnalysis[] = raw ? JSON.parse(raw) : [];
    return existing.find((a) => a.id === id);
  } catch {
    return undefined;
  }
}

export function findCompanyAnalysis(id: string): FullCompanyAnalysis | undefined {
  return getCachedCompanyAnalysisById(id) ?? getSavedCompanyAnalyses().find((a) => a.id === id);
}
