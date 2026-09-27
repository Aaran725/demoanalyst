import { cn } from "@/lib/utils";

/** Consistent heading treatment for each analysis section. */
export function SectionShell({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-5", className)}>
      {title && (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold tracking-tight text-ink-950">{title}</h2>
          {description && <p className="text-sm text-ink-400">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-500">{children}</h3>;
}

export function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-ink-400">None identified.</p>;
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
