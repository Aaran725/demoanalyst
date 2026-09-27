"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLE_TICKERS = ["NVDA", "PLTR", "AAPL", "MSFT", "GOOGL", "AMZN"];

export function TickerInputForm({ onSubmit }: { onSubmit: (ticker: string) => void }) {
  const [ticker, setTicker] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = ticker.trim().toUpperCase();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            className="w-full rounded-md border border-ink-200 bg-white py-3 pl-9 pr-3 text-base text-ink-900 placeholder:text-ink-300 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600"
            placeholder="Enter ticker or company (e.g. NVDA)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            autoFocus
          />
        </div>
        <Button type="submit" size="lg" disabled={!ticker.trim()}>
          Analyze Company
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
        <span className="font-medium uppercase tracking-wide">Try:</span>
        {EXAMPLE_TICKERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onSubmit(t)}
            className="rounded-sm border border-ink-200 px-2 py-0.5 font-mono text-ink-600 hover:border-ink-400 hover:text-ink-900"
          >
            {t}
          </button>
        ))}
      </div>
    </form>
  );
}
