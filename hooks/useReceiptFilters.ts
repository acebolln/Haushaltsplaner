import { useMemo, useState } from 'react'
import { Receipt, ReceiptCategory, ReceiptFilters } from '@/types/receipt'

/**
 * Hook for filtering and searching receipts
 */
export function useReceiptFilters(receipts: Receipt[]) {
  const [filters, setFilters] = useState<ReceiptFilters>({})

  // Filter receipts based on current filters
  const filteredReceipts = useMemo(() => {
    let filtered = [...receipts]

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((r) => r.category === filters.category)
    }

    // Filter by search text (merchant name)
    if (filters.searchText && filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase().trim()
      filtered = filtered.filter((r) =>
        r.merchantName.toLowerCase().includes(searchLower)
      )
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter((r) => r.date >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      filtered = filtered.filter((r) => r.date <= filters.dateTo!)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => b.date.localeCompare(a.date))

    return filtered
  }, [receipts, filters])

  // Update filters
  const updateFilters = (newFilters: Partial<ReceiptFilters>) => {
    setFilters((prev: ReceiptFilters) => ({ ...prev, ...newFilters }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
  }

  // Set category filter
  const setCategory = (category: ReceiptCategory | undefined) => {
    updateFilters({ category })
  }

  // Set search text filter
  const setSearchText = (searchText: string) => {
    updateFilters({ searchText })
  }

  // Set date range filter
  const setDateRange = (dateFrom?: string, dateTo?: string) => {
    updateFilters({ dateFrom, dateTo })
  }

  return {
    filteredReceipts,
    filters,
    updateFilters,
    clearFilters,
    setCategory,
    setSearchText,
    setDateRange,
  }
}
