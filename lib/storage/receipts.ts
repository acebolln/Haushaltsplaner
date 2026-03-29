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
 * Strip imageUrl from receipt before LocalStorage persistence.
 * Images are stored separately in IndexedDB (see lib/storage/imageStore.ts)
 * to avoid hitting the ~5 MB LocalStorage quota with large Base64 PDFs.
 */
function stripImageForStorage(receipt: Receipt): Receipt {
  const { imageUrl, ...rest } = receipt
  return {
    ...rest,
    // Preserve the flag so we know an image exists in IndexedDB
    hasLocalImage: rest.hasLocalImage || !!imageUrl,
  }
}

/**
 * Saves a single receipt to localStorage (without image data)
 */
export function saveReceipt(receipt: Receipt): void {
  try {
    const receipts = loadReceipts()
    const storageReceipt = stripImageForStorage(receipt)
    const existingIndex = receipts.findIndex((r) => r.id === receipt.id)

    if (existingIndex >= 0) {
      receipts[existingIndex] = storageReceipt
    } else {
      receipts.push(storageReceipt)
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
 * Deletes a receipt by ID (from LocalStorage + IndexedDB image)
 */
export function deleteReceipt(id: string): void {
  try {
    const receipts = loadReceipts()
    const filtered = receipts.filter((r) => r.id !== id)
    saveReceipts(filtered)

    // Also remove image from IndexedDB (async, best-effort)
    import('@/lib/storage/imageStore')
      .then(({ deleteImage }) => deleteImage(id))
      .catch(() => { /* IndexedDB cleanup is best-effort */ })
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
