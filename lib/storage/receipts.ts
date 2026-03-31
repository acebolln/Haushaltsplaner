import { Receipt } from '@/types/receipt'

const STORAGE_KEYS = {
  RECEIPTS: 'haushaltsplaner_receipts',
  DELETED_RECEIPTS: 'haushaltsplaner_deleted_receipts',
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
 * Also records a tombstone so pull-sync won't re-add it.
 */
export function deleteReceipt(id: string): void {
  try {
    const receipts = loadReceipts()
    const receipt = receipts.find((r) => r.id === id)
    const filtered = receipts.filter((r) => r.id !== id)
    saveReceipts(filtered)

    // Record tombstone (by ID + Sheet row fingerprint for matching)
    if (receipt) {
      addTombstone(receipt)
    }

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
 * Tombstone tracking — prevents pull-sync from re-adding deleted receipts
 */
interface Tombstone {
  id: string
  date: string
  merchantName: string
  totalAmount: number
  sheetRowNumber?: number
  deletedAt: string
}

function addTombstone(receipt: Receipt): void {
  try {
    const tombstones = loadTombstones()
    tombstones.push({
      id: receipt.id,
      date: receipt.date,
      merchantName: receipt.merchantName,
      totalAmount: receipt.totalAmount,
      sheetRowNumber: receipt.sheetRowNumber,
      deletedAt: new Date().toISOString(),
    })
    localStorage.setItem(STORAGE_KEYS.DELETED_RECEIPTS, JSON.stringify(tombstones))
  } catch {
    // Best-effort
  }
}

export function loadTombstones(): Tombstone[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DELETED_RECEIPTS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Check if a sheet row matches a tombstone (was previously deleted)
 */
export function isTombstoned(date: string, merchantName: string, totalAmount: number): boolean {
  const tombstones = loadTombstones()
  return tombstones.some(
    (t) => t.date === date && t.merchantName === merchantName && t.totalAmount === totalAmount
  )
}

/**
 * Clears all receipts from localStorage
 */
export function clearAllReceipts(): void {
  localStorage.removeItem(STORAGE_KEYS.RECEIPTS)
}

/**
 * Clears tombstones (use when doing a full reset)
 */
export function clearTombstones(): void {
  localStorage.removeItem(STORAGE_KEYS.DELETED_RECEIPTS)
}
