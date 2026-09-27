import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-ink-100 text-ink-600",
        signal: "bg-signal-50 text-signal-700",
        outline: "border border-ink-200 text-ink-600",
        low: "bg-evidence-factBg text-evidence-fact",
        medium: "bg-evidence-assumptionBg text-evidence-assumption",
        high: "bg-red-50 text-risk-high",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
