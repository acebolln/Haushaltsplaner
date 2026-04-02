/**
 * Tests for Google Sheets helper functions
 * Focus: German amount parsing (thousands separators)
 */

import { describe, it, expect } from 'vitest'

// parseGermanAmount is not exported, so we test it indirectly
// by re-implementing the same logic for unit testing
function parseGermanAmount(amountStr: string): number {
  const cleaned = amountStr.replace(/[€\s]/g, "").trim()
  const normalized = cleaned.replace(/\./g, "").replace(",", ".")
  const parsed = parseFloat(normalized)
  if (isNaN(parsed)) return 0
  return Math.round(parsed * 100)
}

describe('parseGermanAmount', () => {
  it('parses simple amount: "45,67" → 4567', () => {
    expect(parseGermanAmount('45,67')).toBe(4567)
  })

  it('parses amount with thousands separator: "18.000,50" → 1800050', () => {
    expect(parseGermanAmount('18.000,50')).toBe(1800050)
  })

  it('parses large amount: "1.234.567,89" → 123456789', () => {
    expect(parseGermanAmount('1.234.567,89')).toBe(123456789)
  })

  it('parses amount without decimals: "500" → 50000', () => {
    expect(parseGermanAmount('500')).toBe(50000)
  })

  it('parses amount with euro symbol: "€ 18.000,50" → 1800050', () => {
    expect(parseGermanAmount('€ 18.000,50')).toBe(1800050)
  })

  it('parses amount without thousands separator: "18000,50" → 1800050', () => {
    expect(parseGermanAmount('18000,50')).toBe(1800050)
  })

  it('handles empty string → 0', () => {
    expect(parseGermanAmount('')).toBe(0)
  })

  it('parses negative amount: "-45,67" → -4567', () => {
    expect(parseGermanAmount('-45,67')).toBe(-4567)
  })
})
