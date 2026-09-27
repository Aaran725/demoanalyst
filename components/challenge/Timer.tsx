"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** A visible stopwatch that runs while `running` is true and freezes when it stops. */
export function Timer({ running }: { running: boolean }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsedMs;
    const interval = setInterval(() => {
      if (startRef.current !== null) setElapsedMs(Date.now() - startRef.current);
    }, 250);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return (
    <div className="inline-flex items-center gap-2 rounded-md bg-ink-950 px-3 py-1.5 font-mono text-sm text-white">
      <Clock size={14} />
      {formatElapsed(elapsedMs)}
    </div>
  );
}
