'use client'

import { useState, useEffect } from 'react'
import { Receipt } from '@/types/receipt'
import { useReceiptManager } from '@/hooks/useReceiptManager'
import { useReceiptFilters } from '@/hooks/useReceiptFilters'
import { useReceiptSync } from '@/hooks/useReceiptSync'
import { ReceiptList } from './ReceiptList'
import { ReceiptDetail } from './ReceiptDetail'
import { RefreshCw, Cloud, CloudOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Receipt Manager - Übersicht view
 * Shows all receipts with filters, detail dialog, and sync status.
 * Pulls from Google Sheet on mount (if authenticated).
 */
export function ReceiptManager() {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Hooks
  const { receipts, loading, addReceipt, updateReceipt, removeReceipt } = useReceiptManager()
  const {
    filteredReceipts,
    filters,
    setCategory,
    setSearchText,
  } = useReceiptFilters(receipts)
  const {
    syncReceipt,
    pullFromSheet,
    pushUpdate,
    pulling,
    lastPullTimestamp,
    isAuthenticated,
  } = useReceiptSync()

  // Pull from Sheet on mount + auto-sync unsynced receipts (if authenticated)
  useEffect(() => {
    if (isAuthenticated && !loading) {
      handlePull().then(() => syncUnsyncedReceipts())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading])

  // Periodic pull every 5 minutes
  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => {
      handlePull()
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // Pull from Google Sheet
  const handlePull = async () => {
    const result = await pullFromSheet(receipts)

    if (result.success && result.changeCount > 0) {
      // Apply updates
      for (const updated of result.updated) {
        updateReceipt(updated.id, updated)
      }
      // Add new receipts from Sheet
      for (const added of result.added) {
        addReceipt(added)
      }
    }
  }

  // Auto-sync local-only receipts to Google Drive/Sheets
  const syncUnsyncedReceipts = async () => {
    // Read fresh from LocalStorage to avoid stale closure
    const { loadReceipts } = await import('@/lib/storage/receipts')
    const freshReceipts = loadReceipts()
    const unsynced = freshReceipts.filter((r) => !r.driveFileId && !r.syncedAt)
    if (unsynced.length === 0) return

    for (const receipt of unsynced) {
      // Load image from IndexedDB
      let imageData = receipt.imageUrl
      if (!imageData) {
        try {
          const { loadImage } = await import('@/lib/storage/imageStore')
          imageData = await loadImage(receipt.id) ?? undefined
        } catch {
          // IndexedDB read failed
        }
      }

      let result
      if (imageData) {
        // Full sync with image
        result = await syncReceipt(receipt, imageData)
      } else {
        // Metadata-only sync (image lost)
        try {
          const response = await fetch('/api/receipts/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receipt, metadataOnly: true }),
          })
          result = await response.json()
        } catch {
          continue
        }
      }
      if (result.success) {
        const synced = {
          ...receipt,
          driveFileId: result.driveFileId,
          driveFileUrl: result.driveFileUrl,
          sheetRowNumber: result.sheetRowNumber,
          sheetId: result.sheetId,
          syncedAt: result.syncedAt,
        }
        // Update both LocalStorage and React state
        const { updateReceipt: updateStoredReceipt } = await import('@/lib/storage/receipts')
        updateStoredReceipt(synced)
        updateReceipt(receipt.id, synced)
      }
    }
  }

  // Handle receipt click
  const handleReceiptClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
    setDetailOpen(true)
  }

  const handleDetailClose = () => {
    setDetailOpen(false)
    setTimeout(() => setSelectedReceipt(null), 200)
  }

  // Handle receipt save (+ push update to Sheet)
  const [syncError, setSyncError] = useState<string | null>(null)

  const handleReceiptSave = async (id: string, updates: Partial<Receipt>) => {
    try {
      const updatedReceipt = {
        ...receipts.find((r) => r.id === id)!,
        ...updates,
        lastModifiedLocally: new Date().toISOString(),
      }
      updateReceipt(id, updatedReceipt)

      if (selectedReceipt?.id === id) {
        setSelectedReceipt(updatedReceipt)
      }

      // Push to Sheet if synced
      if (updatedReceipt.sheetId && updatedReceipt.sheetRowNumber) {
        const result = await pushUpdate(updatedReceipt)
        if (!result.success) {
          setSyncError(`Sync-Fehler: ${result.error || 'Unbekannt'}. Änderung nur lokal gespeichert.`)
          setTimeout(() => setSyncError(null), 8000)
        } else {
          setSyncError(null)
        }
      }
    } catch (error) {
      console.error('Failed to update receipt:', error)
      setSyncError('Fehler beim Speichern. Bitte erneut versuchen.')
      setTimeout(() => setSyncError(null), 8000)
    }
  }

  const handleReceiptDelete = (id: string) => {
    try {
      removeReceipt(id)
    } catch (error) {
      console.error('Failed to delete receipt:', error)
    }
  }

  // Format last sync time
  const formatSyncTime = () => {
    if (!lastPullTimestamp) return null
    const diff = Date.now() - new Date(lastPullTimestamp).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'gerade eben'
    if (mins === 1) return 'vor 1 Min.'
    return `vor ${mins} Min.`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-light text-slate-500">Lade Belege...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sync Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {isAuthenticated ? (
            <>
              <Cloud className="w-4 h-4 text-emerald-500" />
              <span>
                {pulling
                  ? 'Synchronisiere...'
                  : formatSyncTime()
                    ? `Letzte Synchronisation: ${formatSyncTime()}`
                    : 'Mit Google verbunden'}
              </span>
            </>
          ) : (
            <>
              <CloudOff className="w-4 h-4 text-slate-400" />
              <span>Nur lokal — Google nicht verbunden</span>
            </>
          )}
        </div>

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePull}
            disabled={pulling}
            className="text-slate-500 hover:text-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${pulling ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        )}
      </div>

      {/* Sync Error Banner */}
      {syncError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
          <CloudOff className="w-4 h-4 flex-shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      {/* Receipt List */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Belege ({filteredReceipts.length})
        </h2>
        <ReceiptList
          receipts={filteredReceipts}
          onReceiptClick={handleReceiptClick}
          onReceiptDelete={handleReceiptDelete}
          searchText={filters.searchText || ''}
          onSearchChange={setSearchText}
          selectedCategory={filters.category}
          onCategoryChange={setCategory}
        />
      </div>

      {/* Detail Dialog */}
      <ReceiptDetail
        receipt={selectedReceipt}
        open={detailOpen}
        onClose={handleDetailClose}
        onSave={handleReceiptSave}
      />
    </div>
  )
}
