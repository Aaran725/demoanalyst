"use client";

import { Sidebar } from "./Sidebar";
import { usePresentationMode } from "@/lib/presentation-context";
import { Presentation, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isPresentationMode, togglePresentationMode } = usePresentationMode();

  if (isPresentationMode) {
    return (
      <div className="min-h-screen bg-paper">
        <div className="no-print fixed right-4 top-4 z-50">
          <Button variant="secondary" size="sm" onClick={togglePresentationMode}>
            <X size={14} /> Exit Presentation Mode
          </Button>
        </div>
        <main className="mx-auto max-w-5xl px-8 py-10">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex-1">
        <div className="no-print flex justify-end border-b border-ink-100 bg-white px-6 py-2.5">
          <Button variant="ghost" size="sm" onClick={togglePresentationMode}>
            <Presentation size={14} /> Presentation Mode
          </Button>
        </div>
        <main className="mx-auto max-w-6xl px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
