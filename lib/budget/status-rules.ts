import { Status } from '@/types/budget'

/**
 * Determines budget status based on reserve amount
 * Thresholds: >500€ = very-good, >300€ = sufficient, >0€ = tight, ≤0€ = critical
 * @param reserveCents - Reserve amount in cents
 * @returns Status level
 */
export function determineStatus(reserveCents: number): Status {
  const reserveEuros = reserveCents / 100

  if (reserveEuros > 500) return 'very-good'
  if (reserveEuros > 300) return 'sufficient'
  if (reserveEuros > 0) return 'tight'
  return 'critical'
}

/**
 * Gets Tailwind color class for status - BOLD version
 */
export function getStatusColor(status: Status): string {
  switch (status) {
    case 'very-good':
      return 'border-2 border-[oklch(0.60_0.20_155)] bg-[oklch(0.92_0.10_155)] text-[oklch(0.35_0.20_155)] font-bold'
    case 'sufficient':
      return 'border-2 border-[oklch(0.70_0.18_85)] bg-[oklch(0.92_0.10_85)] text-[oklch(0.40_0.18_85)] font-bold'
    case 'tight':
      return 'border-2 border-[oklch(0.65_0.20_50)] bg-[oklch(0.92_0.10_50)] text-[oklch(0.40_0.20_50)] font-bold'
    case 'critical':
      return 'border-2 border-[oklch(0.58_0.24_25)] bg-[oklch(0.92_0.12_25)] text-[oklch(0.40_0.24_25)] font-bold'
  }
}

/**
 * Gets German label for status
 */
export function getStatusLabel(status: Status): string {
  switch (status) {
    case 'very-good':
      return 'Sehr gut'
    case 'sufficient':
      return 'Ausreichend'
    case 'tight':
      return 'Knapp'
    case 'critical':
      return 'Kritisch'
  }
}
