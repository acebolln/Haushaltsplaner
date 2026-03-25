/**
 * Bidirectional Sync Logic
 *
 * Handles merging receipts between local storage and Google Sheets:
 * - Pull: Read from Sheet, merge into local receipts
 * - Conflict resolution: last-write-wins based on timestamps
 * - Matching: by sheetRowNumber (primary) or date+merchant+amount (fallback)
 */

import type {
  Receipt,
  ReceiptSheetRow,
} from "@/types/receipt"

export interface MergeResult {
  /** Receipts to update in local storage (changed remotely) */
  updated: Receipt[]
  /** New receipts found in Sheet that don't exist locally */
  added: Receipt[]
  /** Total number of changes applied */
  changeCount: number
}

/**
 * Merge remote sheet rows with local receipts
 *
 * Strategy:
 * 1. Match local receipts to sheet rows by sheetRowNumber
 * 2. Fallback match by date + merchant + amount
 * 3. For matched pairs: last-write-wins (syncedAt vs now)
 * 4. Unmatched sheet rows → new local receipts
 *
 * @param localReceipts - Receipts from localStorage
 * @param remoteRows - Rows read from Google Sheet
 * @param spreadsheetId - The Sheet's spreadsheet ID
 * @returns Merge result with updates and additions
 */
export function mergeReceipts(
  localReceipts: Receipt[],
  remoteRows: ReceiptSheetRow[],
  spreadsheetId: string
): MergeResult {
  const updated: Receipt[] = []
  const added: Receipt[] = []
  const matchedRowNumbers = new Set<number>()

  // Build local index by sheetRowNumber for fast lookup
  const localByRow = new Map<number, Receipt>()
  for (const r of localReceipts) {
    if (r.sheetRowNumber) {
      localByRow.set(r.sheetRowNumber, r)
    }
  }

  for (const row of remoteRows) {
    // Try match by row number first
    let localMatch = localByRow.get(row.rowNumber)

    // Fallback: match by date + merchant + amount
    if (!localMatch) {
      localMatch = localReceipts.find(
        (r) =>
          r.date === row.date &&
          r.merchantName === row.merchantName &&
          r.totalAmount === row.totalAmount &&
          !matchedRowNumbers.has(row.rowNumber)
      )
    }

    if (localMatch) {
      matchedRowNumbers.add(row.rowNumber)

      // Check if remote data differs from local
      const hasChanges =
        localMatch.merchantName !== row.merchantName ||
        localMatch.date !== row.date ||
        localMatch.totalAmount !== row.totalAmount ||
        localMatch.category !== row.category ||
        localMatch.paymentMethod !== row.paymentMethod ||
        (localMatch.notes || "") !== row.notes

      if (hasChanges) {
        // Last-write-wins: if local was modified after last sync, keep local
        const localModified = localMatch.lastModifiedLocally
        const lastSync = localMatch.syncedAt

        if (localModified && lastSync && localModified > lastSync) {
          // Local is newer — don't overwrite (will be pushed on next sync)
          continue
        }

        // Remote is newer — update local receipt
        updated.push({
          ...localMatch,
          merchantName: row.merchantName,
          date: row.date,
          totalAmount: row.totalAmount,
          category: row.category,
          paymentMethod: row.paymentMethod,
          notes: row.notes || localMatch.notes,
          sheetRowNumber: row.rowNumber,
          sheetId: spreadsheetId,
          syncedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    } else {
      // No local match — new receipt from Sheet
      const newReceipt: Receipt = {
        id: generateId(),
        merchantName: row.merchantName,
        date: row.date,
        totalAmount: row.totalAmount,
        category: row.category,
        paymentMethod: row.paymentMethod,
        lineItems: [],
        confidence: row.confidence,
        notes: row.notes,
        driveFileUrl: row.driveLink || undefined,
        sheetId: spreadsheetId,
        sheetRowNumber: row.rowNumber,
        syncedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      added.push(newReceipt)
    }
  }

  return {
    updated,
    added,
    changeCount: updated.length + added.length,
  }
}

/**
 * Generate a unique ID for new receipts
 */
function generateId(): string {
  return `receipt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
