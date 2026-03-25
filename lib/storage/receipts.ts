import { Receipt } from '@/types/receipt'

const STORAGE_KEYS = {
  RECEIPTS: 'haushaltsplaner_receipts',
} as const

/**
 * Saves all receipts to localStorage
 */
export function saveReceipts(receipts: Receipt[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts))
  } catch (error) {
    console.error('Failed to save receipts:', error)
    throw new Error('LocalStorage voll oder nicht verfügbar')
  }
}

/**
 * Loads all receipts from localStorage
 */
export function loadReceipts(): Receipt[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECEIPTS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load receipts:', error)
    return []
  }
}

/**
 * Alias for loadReceipts() - loads all receipts from localStorage
 */
export function loadAllReceipts(): Receipt[] {
  return loadReceipts()
}

/**
 * Saves a single receipt to localStorage
 */
export function saveReceipt(receipt: Receipt): void {
  try {
    const receipts = loadReceipts()
    const existingIndex = receipts.findIndex((r) => r.id === receipt.id)

    if (existingIndex >= 0) {
      receipts[existingIndex] = receipt
    } else {
      receipts.push(receipt)
    }

    saveReceipts(receipts)
  } catch (error) {
    console.error('Failed to save receipt:', error)
    throw new Error('Beleg konnte nicht gespeichert werden')
  }
}

/**
 * Loads a specific receipt by ID
 */
export function loadReceipt(id: string): Receipt | null {
  const receipts = loadReceipts()
  return receipts.find((r) => r.id === id) || null
}

/**
 * Updates an existing receipt
 */
export function updateReceipt(receipt: Receipt): void {
  try {
    const receipts = loadReceipts()
    const existingIndex = receipts.findIndex((r) => r.id === receipt.id)

    if (existingIndex < 0) {
      throw new Error('Beleg nicht gefunden')
    }

    receipts[existingIndex] = {
      ...receipt,
      updatedAt: new Date().toISOString(),
    }

    saveReceipts(receipts)
  } catch (error) {
    console.error('Failed to update receipt:', error)
    throw error instanceof Error ? error : new Error('Beleg konnte nicht aktualisiert werden')
  }
}

/**
 * Deletes a receipt by ID
 */
export function deleteReceipt(id: string): void {
  try {
    const receipts = loadReceipts()
    const filtered = receipts.filter((r) => r.id !== id)
    saveReceipts(filtered)
  } catch (error) {
    console.error('Failed to delete receipt:', error)
    throw new Error('Beleg konnte nicht gelöscht werden')
  }
}

/**
 * Clears all receipts from localStorage
 */
export function clearAllReceipts(): void {
  localStorage.removeItem(STORAGE_KEYS.RECEIPTS)
}
