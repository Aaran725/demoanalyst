import type { FullAnalysis } from "./ai/schemas";
import { DEMO_ANALYSES } from "./demo-data";

/**
 * "Saved Research" storage.
 *
 * Without Supabase configured, saved analyses live in the browser's
 * localStorage — good enough for a solo demo laptop, and it means the app
 * has zero backend dependency out of the box. See supabase/schema.sql for
 * the real database structure this would migrate to for shared/multi-user use.
 */
const STORAGE_KEY = "aaran-ai:saved-analyses";

export function getSavedAnalyses(): FullAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FullAnalysis[]) : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(analysis: FullAnalysis): void {
  if (typeof window === "undefined") return;
  const existing = getSavedAnalyses().filter((a) => a.id !== analysis.id);
  const updated = [analysis, ...existing];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteAnalysis(id: string): void {
  if (typeof window === "undefined") return;
  const updated = getSavedAnalyses().filter((a) => a.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSavedAnalysisById(id: string): FullAnalysis | undefined {
  return getSavedAnalyses().find((a) => a.id === id);
}

/**
 * Session cache for analyses the user just ran but hasn't explicitly saved.
 * Lets /analyze/[id] and /challenge/[id] work as real, linkable pages
 * without requiring every analysis to be saved first. Cleared when the
 * browser tab closes (sessionStorage), unlike the permanent "saved" list.
 */
const SESSION_CACHE_KEY = "aaran-ai:recent-analyses";
const SESSION_CACHE_LIMIT = 20;

export function cacheAnalysis(analysis: FullAnalysis): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    const existing: FullAnalysis[] = raw ? JSON.parse(raw) : [];
    const updated = [analysis, ...existing.filter((a) => a.id !== analysis.id)].slice(
      0,
      SESSION_CACHE_LIMIT
    );
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(updated));
  } catch {
    // sessionStorage can throw in private browsing contexts — non-critical, ignore.
  }
}

export function getCachedAnalysisById(id: string): FullAnalysis | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    const existing: FullAnalysis[] = raw ? JSON.parse(raw) : [];
    return existing.find((a) => a.id === id);
  } catch {
    return undefined;
  }
}

export function getCachedAnalyses(): FullAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    return raw ? (JSON.parse(raw) as FullAnalysis[]) : [];
  } catch {
    return [];
  }
}

/**
 * Every analysis available to pick from for the Startup Comparison Engine
 * (see app/world-cup/page.tsx): the 3 real built-in demo companies, plus
 * whatever the user has saved or run this session, deduped by id and
 * newest first. Including the real demo analyses (not a separate fake
 * dataset) means this list is never empty even before anyone runs a live
 * analysis, and everything in it is a genuine FullAnalysis the comparison
 * engine can digest directly.
 */
export function getAllAvailableAnalyses(): FullAnalysis[] {
  const all = [...DEMO_ANALYSES, ...getSavedAnalyses(), ...getCachedAnalyses()];
  const seen = new Set<string>();
  const deduped = all.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
  return deduped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
