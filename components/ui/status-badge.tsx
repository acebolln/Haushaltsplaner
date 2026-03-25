"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * StatusBadge Component
 * Displays budget status with semantic colors
 * Green >500€ | Yellow >300€ | Orange >0€ | Red ≤0€
 */

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all",
  {
    variants: {
      status: {
        "very-good": "bg-[var(--status-very-good)]/10 text-[var(--status-very-good)] border-2 border-[var(--status-very-good)]/20",
        sufficient: "bg-[var(--status-sufficient)]/10 text-[var(--status-sufficient)] border-2 border-[var(--status-sufficient)]/20",
        tight: "bg-[var(--status-tight)]/10 text-[var(--status-tight)] border-2 border-[var(--status-tight)]/20",
        critical: "bg-[var(--status-critical)]/10 text-[var(--status-critical)] border-2 border-[var(--status-critical)]/20",
      },
    },
    defaultVariants: {
      status: "sufficient",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  value: number
  showValue?: boolean
}

/**
 * Determines status based on value thresholds
 * Converts cents to euros before comparison
 */
function getStatusFromValue(value: number): "very-good" | "sufficient" | "tight" | "critical" {
  const euros = value / 100 // Convert cents to euros
  if (euros > 500) return "very-good"
  if (euros > 300) return "sufficient"
  if (euros > 0) return "tight"
  return "critical"
}

/**
 * Returns status label
 */
function getStatusLabel(status: "very-good" | "sufficient" | "tight" | "critical"): string {
  switch (status) {
    case "very-good":
      return "Sehr gut"
    case "sufficient":
      return "Ausreichend"
    case "tight":
      return "Knapp"
    case "critical":
      return "Kritisch"
  }
}

export function StatusBadge({ value, showValue = false, className, status, ...props }: StatusBadgeProps) {
  const computedStatus = status || getStatusFromValue(value)
  const label = getStatusLabel(computedStatus)

  return (
    <div className={cn(statusBadgeVariants({ status: computedStatus }), className)} {...props}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{
          backgroundColor: `var(--status-${computedStatus.replace("-", "-")})`,
        }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{
          backgroundColor: `var(--status-${computedStatus.replace("-", "-")})`,
        }} />
      </span>
      <span>{label}</span>
      {showValue && <span className="font-mono">({value.toFixed(0)}€)</span>}
    </div>
  )
}
