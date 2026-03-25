import { Frequency } from '@/types/budget'

/**
 * Converts an amount to its monthly equivalent
 * @param amount - Amount in cents
 * @param frequency - Payment frequency
 * @returns Monthly amount in cents
 */
export function convertToMonthly(amount: number, frequency: Frequency): number {
  switch (frequency) {
    case 'monthly':
      return amount
    case 'quarterly':
      return Math.round(amount / 4)
    case 'yearly':
      return Math.round(amount / 12)
  }
}

/**
 * Formats amount with frequency conversion display
 * @param amount - Amount in cents
 * @param frequency - Payment frequency
 * @returns Formatted string (e.g., "1.800 € → 150 €/M")
 */
export function formatWithOriginal(amount: number, frequency: Frequency): string {
  const euros = amount / 100
  const monthlyEuros = convertToMonthly(amount, frequency) / 100

  if (frequency === 'monthly') {
    return `${euros.toFixed(2).replace('.', ',')} €/M`
  }

  const original = euros.toFixed(2).replace('.', ',')
  const monthly = monthlyEuros.toFixed(2).replace('.', ',')

  return `${original} € → ${monthly} €/M`
}

/**
 * Formats an amount in cents to Euro display
 * @param cents - Amount in cents
 * @returns Formatted string (e.g., "1.234,56 €")
 */
export function formatEuro(cents: number): string {
  const euros = cents / 100
  return euros.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })
}
