import { useState, useEffect, useCallback } from 'react'
import { Receipt } from '@/types/receipt'
import { loadReceipts, saveReceipt, deleteReceipt, importReceipt as importReceiptStorage } from '@/lib/storage/receipts'

/**
 * Hook for managing receipts (CRUD operations)
 * Follows the pattern from useBudgetCalculator
 */
export function useReceiptManager() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  // Load receipts on mount
  useEffect(() => {
    try {
      const loaded = loadReceipts()
      setReceipts(loaded)
    } catch (error) {
      console.error('Failed to load receipts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Add new receipt
  const addReceipt = useCallback((receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newReceipt: Receipt = {
      ...receipt,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }

    try {
      saveReceipt(newReceipt)
      setReceipts((prev) => [newReceipt, ...prev]) // Add to beginning for newest-first
    } catch (error) {
      console.error('Failed to add receipt:', error)
      throw error
    }
  }, [])

  // Update existing receipt
  const updateReceipt = useCallback((id: string, updates: Partial<Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setReceipts((prev) => {
      const updated = prev.map((receipt) => {
        if (receipt.id === id) {
          return {
            ...receipt,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        }
        return receipt
      })

      // Save AFTER state update completes
      const updatedReceipt = updated.find(r => r.id === id)
      if (updatedReceipt) {
        try {
          saveReceipt(updatedReceipt)
        } catch (error) {
          console.error('Failed to update receipt:', error)
          throw error
        }
      }

      return updated
    })
  }, [])

  // Import a pulled receipt preserving its ID and sync metadata
  const importReceipt = useCallback((receipt: Receipt) => {
    try {
      importReceiptStorage(receipt)
      // Reload from storage to get the canonical state (deduped, merged)
      const fresh = loadReceipts()
      setReceipts(fresh)
    } catch (error) {
      console.error('Failed to import receipt:', error)
      throw error
    }
  }, [])

  // Remove receipt
  const removeReceipt = useCallback((id: string) => {
    try {
      deleteReceipt(id)
      setReceipts((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      console.error('Failed to remove receipt:', error)
      throw error
    }
  }, [])

  return {
    receipts,
    loading,
    addReceipt,
    importReceipt,
    updateReceipt,
    removeReceipt,
  }
}
