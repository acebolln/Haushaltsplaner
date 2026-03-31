/**
 * Retry Sync Button Component
 *
 * Allows manual retry of Google Drive/Sheets sync for receipts
 * that failed to sync or weren't synced initially.
 *
 * Shows:
 * - "Sync to Google Drive" button if not synced and user is authenticated
 * - "Syncing..." spinner while sync in progress
 * - Hidden if already synced or user not authenticated
 */

'use client'

import { useState } from 'react'
import { Receipt } from '@/types/receipt'
import { Button } from '@/components/ui/button'
import { Cloud, Loader2, AlertCircle } from 'lucide-react'
import { useReceiptSync } from '@/hooks/useReceiptSync'

interface RetrySyncButtonProps {
  receipt: Receipt
  onSyncComplete?: (updatedReceipt: Receipt) => void
  className?: string
}

export function RetrySyncButton({ receipt, onSyncComplete, className = '' }: RetrySyncButtonProps) {
  const { syncReceipt, isSynced, isAuthenticated } = useReceiptSync()
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Don't show button if already synced or not authenticated
  if (isSynced(receipt) || !isAuthenticated) {
    return null
  }

  const handleSync = async () => {
    // Load image from IndexedDB (no longer stored in receipt.imageUrl after save)
    let imageData = receipt.imageUrl
    if (!imageData) {
      try {
        const { loadImage } = await import('@/lib/storage/imageStore')
        imageData = await loadImage(receipt.id) ?? undefined
      } catch {
        // IndexedDB read failed
      }
    }

    setSyncing(true)
    setError(null)

    try {
      let result

      if (imageData) {
        // Full sync: image + Sheet row (compress first for Vercel body limit)
        const { compressImage } = await import('@/lib/utils/compress-image')
        const compressed = await compressImage(imageData)
        result = await syncReceipt(receipt, compressed)
      } else {
        // Metadata-only sync: no image available, just append to Sheet
        const response = await fetch('/api/receipts/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receipt, metadataOnly: true }),
        })
        result = await response.json()
      }

      if (result.success) {
        // Update receipt with sync metadata
        const updatedReceipt: Receipt = {
          ...receipt,
          driveFileId: result.driveFileId || `metadata_${Date.now()}`,
          driveFileUrl: result.driveFileUrl,
          sheetRowNumber: result.sheetRowNumber,
          sheetId: result.sheetId,
          syncedAt: result.syncedAt,
        }

        // Save updated receipt to LocalStorage
        const { updateReceipt } = await import('@/lib/storage/receipts')
        updateReceipt(updatedReceipt)

        // Notify parent component
        if (onSyncComplete) {
          onSyncComplete(updatedReceipt)
        }
      } else {
        setError(result.error || 'Synchronisierung fehlgeschlagen')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        size="sm"
        variant="outline"
        onClick={handleSync}
        disabled={syncing}
        className="w-full"
      >
        {syncing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Wird synchronisiert...
          </>
        ) : (
          <>
            <Cloud className="h-4 w-4 mr-2" />
            Mit Google Drive synchronisieren
          </>
        )}
      </Button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
