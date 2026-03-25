import { Category } from '@/types/receipt'

/**
 * Default receipt categories for German tax compliance
 * Based on typical tax-deductible expense categories
 */
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'hausrenovierung',
    name: 'Hausrenovierung',
    taxDeductible: true,
  },
  {
    id: 'variable-kosten-vermietung',
    name: 'Variable Kosten Vermietung und Verpachtung',
    taxDeductible: true,
  },
  {
    id: 'berufsbezogene-ausgaben',
    name: 'Berufsbezogene Ausgaben',
    taxDeductible: true,
  },
  {
    id: 'selbststaendige-taetigkeit',
    name: 'Ausgaben aus selbstständiger Tätigkeit',
    taxDeductible: true,
  },
  {
    id: 'haushaltsfuehrung',
    name: 'Haushaltsführung',
    taxDeductible: false,
  },
  {
    id: 'sonstige',
    name: 'Sonstige',
    taxDeductible: false,
  },
]

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return DEFAULT_CATEGORIES.find((cat) => cat.id === id)
}

/**
 * Get all tax-deductible categories
 */
export function getTaxDeductibleCategories(): Category[] {
  return DEFAULT_CATEGORIES.filter((cat) => cat.taxDeductible)
}
