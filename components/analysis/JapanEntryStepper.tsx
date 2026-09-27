import type { JapanPhase } from "@/lib/ai/schemas";

/**
 * A 5-phase entry strategy is a fixed, ordered sequence — not really
 * "chartable" data, more a diagram. Plain Tailwind (numbered circles +
 * a connecting line), no charting library needed for this one.
 */
export function JapanEntryStepper({ phases }: { phases: JapanPhase[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 hidden h-px w-[calc(100%-2rem)] bg-ink-200 sm:block" />
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:gap-3">
        {phases.map((phase) => (
          <div key={phase.phase} className="flex gap-3 sm:flex-1 sm:flex-col sm:items-center sm:text-center">
            <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal-600 text-sm font-semibold text-white">
              {phase.phase}
            </div>
            <div className="sm:mt-1 sm:px-1">
              <div className="text-sm font-medium text-ink-900">{phase.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{phase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
