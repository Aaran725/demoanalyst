import { EvidenceTag } from "./EvidenceTag";
import type { Claim } from "@/lib/ai/schemas";
import { cn } from "@/lib/utils";

/**
 * Renders one Claim: its text, its evidence badge, and (if present) the
 * sources behind it. This is the single most-reused component in the app —
 * almost every field in an analysis is a Claim.
 */
export function ClaimBlock({
  label,
  claim,
  className,
}: {
  label?: string;
  claim: Claim;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-start justify-between gap-2">
        {label && <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</span>}
        <EvidenceTag status={claim.status} />
      </div>
      <p className="text-sm leading-relaxed text-ink-800">
        {claim.text}
        {claim.conflicting && (
          <span className="ml-2 text-xs font-medium text-evidence-assumption">
            (CONFLICTING INFORMATION)
          </span>
        )}
      </p>
      {claim.sources && claim.sources.length > 0 && (
        <ul className="space-y-1 border-l-2 border-ink-100 pl-3">
          {claim.sources.map((s, i) => (
            <li key={i} className="text-xs text-ink-400">
              <span className="font-medium text-ink-500">{s.label}</span>
              {s.date && <span> · {s.date}</span>}
              {s.url && (
                <>
                  {" · "}
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-signal-600 hover:underline">
                    source
                  </a>
                </>
              )}
              <div className="text-ink-400">{s.claimSupported}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Renders a list of Claims stacked vertically, e.g. market drivers. */
export function ClaimList({ claims }: { claims: Claim[] }) {
  return (
    <div className="space-y-3">
      {claims.map((c, i) => (
        <ClaimBlock key={i} claim={c} />
      ))}
    </div>
  );
}
