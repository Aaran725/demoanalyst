import { Flame } from "lucide-react";
import type { DevilsAdvocate } from "@/lib/ai/schemas";

const RISK_ROWS: Array<[keyof DevilsAdvocate, string]> = [
  ["technologyRisk", "Technology Risk"],
  ["marketRisk", "Market Risk"],
  ["competitionRisk", "Competition Risk"],
  ["executionRisk", "Execution Risk"],
  ["financingRisk", "Financing Risk"],
  ["customerRisk", "Customer Risk"],
  ["regulatoryRisk", "Regulatory Risk"],
];

/**
 * Deliberately its own high-contrast dark theme (see `noir` in
 * tailwind.config.ts) — the one tab that should NOT look like the rest of
 * the app, since its whole job is to argue against the deal on purpose.
 *
 * Note: the design brief this was built from showed a numeric "Deal Risk
 * Score" and a 1-10 bar per risk category. Those don't exist here on
 * purpose — devilsAdvocateSchema only has free-text risk reasoning per
 * category (lib/ai/schemas.ts), no ordinal rating. Inventing a number to
 * fill a bar would be exactly the kind of fabricated-looking-real data
 * this app's Evidence Engine exists to prevent, so this stays text-only.
 */
export function DevilsAdvocateSection({ devilsAdvocate: da }: { devilsAdvocate: DevilsAdvocate }) {
  return (
    <section className="-mx-8 space-y-6 rounded-xl bg-noir-bg px-6 py-8 sm:px-8">
      <div className="flex items-center gap-2 text-noir-accent">
        <Flame size={16} />
        <span className="text-xs font-semibold uppercase tracking-widest">Devil&apos;s Advocate — Adversarial Review</span>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-noir-text">
          Five reasons this deal could fail
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-noir-muted">
          This section exists to fight confirmation bias — it argues against the deal on purpose.
        </p>
      </div>

      <ol className="space-y-3">
        {da.reasonsThisCouldFail.map((reason, i) => (
          <li key={i} className="rounded-lg bg-noir-track/60 p-4">
            <div className="flex gap-3">
              <span className="shrink-0 font-mono text-lg font-extrabold text-noir-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-noir-text">{reason}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-noir-track/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-noir-muted">
            Assumptions That Must Be True
          </div>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-noir-text/90">
            {da.assumptionsThatMustBeTrue.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-noir-track/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-noir-muted">
            What Investors May Be Missing
          </div>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-noir-text/90">
            {da.whatInvestorsMayBeMissing.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-noir-muted">
          Risk Breakdown — 7 Categories
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {RISK_ROWS.map(([key, label]) => (
            <div key={key} className="rounded-lg bg-noir-track/60 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-noir-muted">{label}</div>
              <p className="mt-1 text-sm leading-relaxed text-noir-text/90">{da[key] as string}</p>
            </div>
          ))}
        </div>
      </div>

      <blockquote className="border-l-2 border-noir-accent py-1 pl-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-noir-accent">
          What Would Make This Thesis Wrong
        </div>
        <p className="mt-1 text-sm italic leading-relaxed text-noir-text">
          &ldquo;{da.whatWouldMakeTheThesisWrong}&rdquo;
        </p>
      </blockquote>
    </section>
  );
}
