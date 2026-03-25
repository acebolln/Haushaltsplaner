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
    pullFromSheet,
    pushUpdate,
    pulling,
    lastPullTimestamp,
    isAuthenticated,
  } = useReceiptSync()

  // Pull from Sheet on mount (if authenticated)
  useEffect(() => {
    if (isAuthenticated && receipts.length >= 0 && !loading) {
      handlePull()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading])

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
        await pushUpdate(updatedReceipt)
      }
    } catch (error) {
      console.error('Failed to update receipt:', error)
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
