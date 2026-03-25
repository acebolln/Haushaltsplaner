import { BudgetData, BudgetCalculations, BudgetItem, Category } from '@/types/budget'
import { convertToMonthly } from './frequency-converter'
import { determineStatus } from './status-rules'

/**
 * Calculates the monthly total for a category
 * @param items - Budget items in the category
 * @returns Total monthly amount in cents
 */
export function calculateCategoryTotal(items: BudgetItem[]): number {
  return items.reduce((sum, item) => {
    const monthlyAmount = convertToMonthly(item.amount, item.frequency)
    return sum + monthlyAmount
  }, 0)
}

/**
 * Calculates the reserve amount
 * Formula: income - (fixed + variable + savings) - housing
 * @param income - Total monthly income in cents
 * @param expenses - Total monthly expenses (fixed + variable + savings) in cents
 * @param housing - Total monthly housing costs in cents
 * @returns Reserve in cents
 */
export function calculateReserve(
  income: number,
  expenses: number,
  housing: number
): number {
  return income - expenses - housing
}

/**
 * Calculates housing subtotals (mortgage vs utilities)
 * @param housingCategory - Housing category with items
 * @returns Object with mortgage, utilities, and total
 */
function calculateHousingSubtotals(housingCategory: Category) {
  const mortgageItem = housingCategory.items.find((item) =>
    item.name.toLowerCase().includes('darlehen')
  )

  const mortgage = mortgageItem
    ? convertToMonthly(mortgageItem.amount, mortgageItem.frequency)
    : 0

  const utilitiesItems = housingCategory.items.filter(
    (item) => !item.name.toLowerCase().includes('darlehen')
  )

  const utilities = calculateCategoryTotal(utilitiesItems)
  const total = mortgage + utilities

  return { mortgage, utilities, total }
}

/**
 * Main calculation function - computes all budget metrics
 * @param data - Budget data with all categories
 * @returns Complete budget calculations
 */
export function calculateBudget(data: BudgetData): BudgetCalculations {
  const totalIncome = calculateCategoryTotal(data.categories.income.items)
  const totalFixed = calculateCategoryTotal(data.categories.fixed.items)
  const totalVariable = calculateCategoryTotal(data.categories.variable.items)
  const totalSavings = calculateCategoryTotal(data.categories.savings.items)

  const housingSubtotals = calculateHousingSubtotals(data.categories.housing)
  const totalHousing = housingSubtotals.total

  const totalExpenses = totalFixed + totalVariable + totalSavings

  const reserve = calculateReserve(totalIncome, totalExpenses, totalHousing)
  const status = determineStatus(reserve)

  return {
    totalIncome,
    totalFixed,
    totalVariable,
    totalSavings,
    totalHousing,
    housingSubtotals,
    totalExpenses,
    reserve,
    status,
  }
}
