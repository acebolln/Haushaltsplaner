/**
 * Receipt Sync Hook
 *
 * Handles bidirectional sync between app and Google Drive/Sheets:
 * - Push: Upload receipt to Drive + append to Sheet
 * - Pull: Read Sheet, merge into local storage
 * - Update: Push local edits to Sheet row
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { Receipt, ReceiptSheetRow } from '@/types/receipt'
import { useGoogleAuth } from './useGoogleAuth'
import { mergeReceipts } from '@/lib/google/sync'

interface SyncResult {
  success: boolean
  driveFileId?: string
  driveFileUrl?: string
  sheetRowNumber?: number
  sheetId?: string
  syncedAt?: string
  error?: string
}

interface PullResult {
  success: boolean
  updated: Receipt[]
  added: Receipt[]
  changeCount: number
  error?: string
}

/**
 * Custom hook for bidirectional receipt sync
 */
export function useReceiptSync() {
  const { isAuthenticated } = useGoogleAuth()
  const [syncing, setSyncing] = useState<string | null>(null)
  const [pulling, setPulling] = useState(false)
  const [lastPullTimestamp, setLastPullTimestamp] = useState<string | null>(null)
  const pullInProgress = useRef(false)

  /**
   * Push receipt to Google Drive + Sheets
   */
  const syncReceipt = useCallback(
    async (receipt: Receipt, imageBase64: string): Promise<SyncResult> => {
      if (!isAuthenticated) {
        return { success: false, error: 'Not authenticated with Google' }
      }

      if (receipt.driveFileId) {
        return {
          success: true,
          driveFileId: receipt.driveFileId,
          driveFileUrl: receipt.driveFileUrl,
          sheetRowNumber: receipt.sheetRowNumber,
          sheetId: receipt.sheetId,
          syncedAt: receipt.syncedAt,
        }
      }

      setSyncing(receipt.id)

      try {
        const response = await fetch('/api/receipts/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receipt, imageBase64 }),
        })

        // Handle non-JSON responses (e.g. Vercel 413 Payload Too Large)
        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          throw new Error(`Server-Fehler (${response.status}): Bild möglicherweise zu groß für Upload`)
        }

        const data: SyncResult = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Sync failed')
        }

        return data
      } catch (error) {
        console.error('Receipt sync error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown sync error',
        }
      } finally {
        setSyncing(null)
      }
    },
    [isAuthenticated]
  )

  /**
   * Pull receipts from Google Sheet and merge with local storage
   *
   * @param localReceipts - Current local receipts
   * @param year - Year to pull (defaults to current year)
   * @returns Merge result with updated and added receipts
   */
  const pullFromSheet = useCallback(
    async (localReceipts: Receipt[], year?: string): Promise<PullResult> => {
      if (!isAuthenticated) {
        return { success: false, updated: [], added: [], changeCount: 0, error: 'Not authenticated' }
      }

      // Prevent concurrent pulls
      if (pullInProgress.current) {
        return { success: false, updated: [], added: [], changeCount: 0, error: 'Pull already in progress' }
      }

      pullInProgress.current = true
      setPulling(true)

      try {
        const pullYear = year || String(new Date().getFullYear())
        const response = await fetch(`/api/receipts/sync?year=${pullYear}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Pull failed')
        }

        const remoteRows: ReceiptSheetRow[] = data.rows
        const spreadsheetId: string = data.spreadsheetId

        if (!remoteRows || remoteRows.length === 0) {
          setLastPullTimestamp(new Date().toISOString())
          return { success: true, updated: [], added: [], changeCount: 0 }
        }

        // Merge remote with local
        const result = mergeReceipts(localReceipts, remoteRows, spreadsheetId)

        setLastPullTimestamp(new Date().toISOString())

        return {
          success: true,
          ...result,
        }
      } catch (error) {
        console.error('Receipt pull error:', error)
        return {
          success: false,
          updated: [],
          added: [],
          changeCount: 0,
          error: error instanceof Error ? error.message : 'Unknown pull error',
        }
      } finally {
        setPulling(false)
        pullInProgress.current = false
      }
    },
    [isAuthenticated]
  )

  /**
   * Push a local edit to the Google Sheet (update existing row)
   */
  const pushUpdate = useCallback(
    async (receipt: Receipt): Promise<{ success: boolean; error?: string }> => {
      if (!isAuthenticated) {
        return { success: false, error: 'Not authenticated' }
      }

      if (!receipt.sheetId || !receipt.sheetRowNumber) {
        return { success: false, error: 'Receipt not synced yet' }
      }

      try {
        const response = await fetch('/api/receipts/sync', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receipt,
            spreadsheetId: receipt.sheetId,
            rowNumber: receipt.sheetRowNumber,
            driveLink: receipt.driveFileUrl || '',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Update failed')
        }

        return { success: true }
      } catch (error) {
        console.error('Receipt update error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
    [isAuthenticated]
  )

  const isSyncing = useCallback(
    (receiptId: string) => syncing === receiptId,
    [syncing]
  )

  const isSynced = useCallback((receipt: Receipt) => {
    return Boolean((receipt.sheetRowNumber || receipt.driveFileId) && receipt.syncedAt)
  }, [])

  const needsSync = useCallback(
    (receipt: Receipt) => {
      return isAuthenticated && !isSynced(receipt)
    },
    [isAuthenticated, isSynced]
  )

  return {
    syncReceipt,
    pullFromSheet,
    pushUpdate,
    isSyncing,
    isSynced,
    needsSync,
    isAuthenticated,
    pulling,
    lastPullTimestamp,
  }
}
