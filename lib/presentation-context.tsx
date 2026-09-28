"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * Presentation Mode: hides the sidebar/nav chrome so the app reads cleanly
 * on a laptop screen during a live demo, plus "Stage Mode" polish — real
 * browser fullscreen and a larger base type scale for back-of-room
 * readability. Toggled from the top bar.
 */
const PresentationModeContext = createContext<{
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
}>({ isPresentationMode: false, togglePresentationMode: () => {} });

export function PresentationModeProvider({ children }: { children: React.ReactNode }) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const togglePresentationMode = useCallback(() => {
    setIsPresentationMode((v) => {
      const next = !v;
      // Feature-detected and silently no-op on failure (denied, unsupported,
      // not called from a user gesture) — fullscreen is a nice-to-have here,
      // never something that should block the toggle itself.
      if (next) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      return next;
    });
  }, []);

  useEffect(() => {
    // Pressing Esc exits fullscreen without going through our toggle — keep
    // presentation mode's own state in sync so the UI doesn't end up saying
    // "in presentation mode" while the browser chrome has already come back.
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setIsPresentationMode(false);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    // Scales the root font-size (see .presentation-mode in globals.css),
    // which bumps every Tailwind rem-based text size app-wide for
    // back-of-room readability — no per-component changes needed.
    document.documentElement.classList.toggle("presentation-mode", isPresentationMode);
  }, [isPresentationMode]);

  return (
    <PresentationModeContext.Provider value={{ isPresentationMode, togglePresentationMode }}>
      {children}
    </PresentationModeContext.Provider>
  );
}

export function usePresentationMode() {
  return useContext(PresentationModeContext);
}
