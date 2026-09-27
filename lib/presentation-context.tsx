"use client";

import { createContext, useContext, useState } from "react";

/**
 * Presentation Mode: hides the sidebar/nav chrome so the app reads cleanly
 * on a laptop screen during a live demo. Toggled from the top bar.
 */
const PresentationModeContext = createContext<{
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
}>({ isPresentationMode: false, togglePresentationMode: () => {} });

export function PresentationModeProvider({ children }: { children: React.ReactNode }) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  return (
    <PresentationModeContext.Provider
      value={{
        isPresentationMode,
        togglePresentationMode: () => setIsPresentationMode((v) => !v),
      }}
    >
      {children}
    </PresentationModeContext.Provider>
  );
}

export function usePresentationMode() {
  return useContext(PresentationModeContext);
}
