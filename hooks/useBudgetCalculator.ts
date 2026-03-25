import { useMemo } from 'react'
import { BudgetData, BudgetCalculations } from '@/types/budget'
import { calculateBudget } from '@/lib/budget/calculations'

/**
 * Hook that calculates all budget metrics from budget data
 */
export function useBudgetCalculator(data: BudgetData | null): BudgetCalculations | null {
  return useMemo(() => {
    if (!data) return null
    return calculateBudget(data)
  }, [data])
}
