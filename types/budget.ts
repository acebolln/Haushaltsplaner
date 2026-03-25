// Budget Types

export type Frequency = 'monthly' | 'quarterly' | 'yearly'

export type Status = 'very-good' | 'sufficient' | 'tight' | 'critical'

export interface BudgetItem {
  id: string
  name: string
  amount: number // in cents
  frequency: Frequency
}

export interface Category {
  id: string
  name: string
  items: BudgetItem[]
  color?: string
}

export interface BudgetData {
  categories: {
    income: Category
    fixed: Category
    variable: Category
    savings: Category
    housing: Category
  }
}

export interface BudgetCalculations {
  // Category totals (monthly, in cents)
  totalIncome: number
  totalFixed: number
  totalVariable: number
  totalSavings: number
  totalHousing: number
  housingSubtotals: {
    mortgage: number
    utilities: number // without mortgage
    total: number
  }

  // Overall calculations
  totalExpenses: number // fixed + variable + savings
  reserve: number // income - expenses - housing
  status: Status
}

export interface Scenario {
  id: string
  name: string
  data: BudgetData
  createdAt: string
}

export interface ChartData {
  name: string
  value: number
  color: string
  percentage: number
}
