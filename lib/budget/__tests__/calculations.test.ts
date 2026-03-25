import { describe, it, expect } from 'vitest'
import { calculateCategoryTotal, calculateReserve, calculateBudget } from '../calculations'
import { determineStatus } from '../status-rules'
import { convertToMonthly } from '../frequency-converter'
import { BudgetData, BudgetItem } from '@/types/budget'

describe('Frequency Conversion', () => {
  it('converts monthly amounts correctly', () => {
    expect(convertToMonthly(10000, 'monthly')).toBe(10000)
  })

  it('converts quarterly amounts to monthly', () => {
    expect(convertToMonthly(12000, 'quarterly')).toBe(3000)
  })

  it('converts yearly amounts to monthly', () => {
    expect(convertToMonthly(12000, 'yearly')).toBe(1000)
  })

  it('rounds fractional cents correctly', () => {
    expect(convertToMonthly(100, 'yearly')).toBe(8) // 100/12 = 8.33... → 8
  })
})

describe('Category Total Calculation', () => {
  it('calculates total for empty category', () => {
    expect(calculateCategoryTotal([])).toBe(0)
  })

  it('calculates total for monthly items', () => {
    const items: BudgetItem[] = [
      { id: '1', name: 'Item 1', amount: 10000, frequency: 'monthly' },
      { id: '2', name: 'Item 2', amount: 5000, frequency: 'monthly' },
    ]
    expect(calculateCategoryTotal(items)).toBe(15000)
  })

  it('calculates total for mixed frequencies', () => {
    const items: BudgetItem[] = [
      { id: '1', name: 'Monthly', amount: 10000, frequency: 'monthly' },
      { id: '2', name: 'Yearly', amount: 12000, frequency: 'yearly' }, // 1000/month
      { id: '3', name: 'Quarterly', amount: 4000, frequency: 'quarterly' }, // 1000/month
    ]
    expect(calculateCategoryTotal(items)).toBe(12000) // 10000 + 1000 + 1000
  })
})

describe('Reserve Calculation', () => {
  it('calculates positive reserve', () => {
    expect(calculateReserve(100000, 60000, 30000)).toBe(10000) // 1000 - 600 - 300 = 100 euros
  })

  it('calculates zero reserve', () => {
    expect(calculateReserve(100000, 60000, 40000)).toBe(0)
  })

  it('calculates negative reserve', () => {
    expect(calculateReserve(100000, 70000, 40000)).toBe(-10000)
  })
})

describe('Status Determination', () => {
  it('determines very-good status for >500€', () => {
    expect(determineStatus(50100)).toBe('very-good') // 501€
  })

  it('determines sufficient status for 300-500€', () => {
    expect(determineStatus(40000)).toBe('sufficient') // 400€
    expect(determineStatus(30100)).toBe('sufficient') // 301€
  })

  it('determines tight status for 0-300€', () => {
    expect(determineStatus(20000)).toBe('tight') // 200€
    expect(determineStatus(100)).toBe('tight') // 1€
  })

  it('determines critical status for ≤0€', () => {
    expect(determineStatus(0)).toBe('critical')
    expect(determineStatus(-10000)).toBe('critical') // -100€
  })

  it('handles boundary values correctly', () => {
    expect(determineStatus(50001)).toBe('very-good') // 500.01€ (just above threshold)
    expect(determineStatus(50000)).toBe('sufficient') // exactly 500€
    expect(determineStatus(30001)).toBe('sufficient') // 300.01€ (just above threshold)
    expect(determineStatus(30000)).toBe('tight') // exactly 300€
    expect(determineStatus(1)).toBe('tight') // 0.01€ (just above 0)
    expect(determineStatus(0)).toBe('critical') // exactly 0€
  })
})

describe('Complete Budget Calculation', () => {
  it('calculates complete budget correctly', () => {
    const mockData: BudgetData = {
      categories: {
        income: {
          id: 'income',
          name: 'Einnahmen',
          items: [
            { id: '1', name: 'Gehalt', amount: 500000, frequency: 'monthly' }, // 5000€
          ],
        },
        fixed: {
          id: 'fixed',
          name: 'Fixkosten',
          items: [
            { id: '2', name: 'Versicherung', amount: 10000, frequency: 'monthly' }, // 100€
          ],
        },
        variable: {
          id: 'variable',
          name: 'Variable Kosten',
          items: [
            { id: '3', name: 'Lebensmittel', amount: 50000, frequency: 'monthly' }, // 500€
          ],
        },
        savings: {
          id: 'savings',
          name: 'Sparquote',
          items: [
            { id: '4', name: 'Sparplan', amount: 20000, frequency: 'monthly' }, // 200€
          ],
        },
        housing: {
          id: 'housing',
          name: 'Hauskosten',
          items: [
            { id: '5', name: 'Darlehensrate', amount: 150000, frequency: 'monthly' }, // 1500€
            { id: '6', name: 'Energie', amount: 50000, frequency: 'monthly' }, // 500€
          ],
        },
      },
    }

    const result = calculateBudget(mockData)

    expect(result.totalIncome).toBe(500000) // 5000€
    expect(result.totalFixed).toBe(10000) // 100€
    expect(result.totalVariable).toBe(50000) // 500€
    expect(result.totalSavings).toBe(20000) // 200€
    expect(result.totalExpenses).toBe(80000) // 800€ (100+500+200)
    expect(result.totalHousing).toBe(200000) // 2000€ (1500+500)
    expect(result.housingSubtotals.mortgage).toBe(150000) // 1500€
    expect(result.housingSubtotals.utilities).toBe(50000) // 500€
    expect(result.reserve).toBe(220000) // 2200€ (5000-800-2000)
    expect(result.status).toBe('very-good')
  })

  it('handles critical status scenario', () => {
    const mockData: BudgetData = {
      categories: {
        income: {
          id: 'income',
          name: 'Einnahmen',
          items: [
            { id: '1', name: 'Gehalt', amount: 300000, frequency: 'monthly' },
          ],
        },
        fixed: {
          id: 'fixed',
          name: 'Fixkosten',
          items: [
            { id: '2', name: 'Versicherung', amount: 100000, frequency: 'monthly' },
          ],
        },
        variable: {
          id: 'variable',
          name: 'Variable Kosten',
          items: [
            { id: '3', name: 'Lebensmittel', amount: 100000, frequency: 'monthly' },
          ],
        },
        savings: {
          id: 'savings',
          name: 'Sparquote',
          items: [],
        },
        housing: {
          id: 'housing',
          name: 'Hauskosten',
          items: [
            { id: '4', name: 'Darlehensrate', amount: 150000, frequency: 'monthly' },
          ],
        },
      },
    }

    const result = calculateBudget(mockData)

    expect(result.reserve).toBe(-50000) // -500€
    expect(result.status).toBe('critical')
  })
})
