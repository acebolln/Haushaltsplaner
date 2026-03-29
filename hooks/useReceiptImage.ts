/**
 * Hook to load a receipt image from IndexedDB.
 *
 * Since images are no longer stored in LocalStorage (to avoid quota limits),
 * components that need to display receipt images use this hook to
 * asynchronously load them from IndexedDB.
 *
 * Falls back to receipt.imageUrl if present (in-memory, not yet persisted)
 * or receipt.driveFileUrl for synced receipts.
 */

'use client'

import { useState, useEffect } from 'react'

export function useReceiptImage(
  receiptId: string | undefined,
  /** In-memory imageUrl (before persistence) */
  inMemoryUrl?: string,
  /** Google Drive URL (after sync) */
  driveUrl?: string
): { imageUrl: string | null; loading: boolean } {
  const [imageUrl, setImageUrl] = useState<string | null>(inMemoryUrl ?? null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If we already have an in-memory URL (current session, not yet saved), use it
    if (inMemoryUrl) {
      setImageUrl(inMemoryUrl)
      return
    }

    // If no receipt ID, nothing to load
    if (!receiptId) {
      setImageUrl(null)
      return
    }

    let cancelled = false

    async function loadFromIndexedDB() {
      setLoading(true)
      try {
        const { loadImage } = await import('@/lib/storage/imageStore')
        const dataUri = await loadImage(receiptId!)
        if (!cancelled) {
          // Use IndexedDB image, or fall back to Drive URL
          setImageUrl(dataUri ?? driveUrl ?? null)
        }
      } catch {
        if (!cancelled) {
          // Fall back to Drive URL on IndexedDB error
          setImageUrl(driveUrl ?? null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadFromIndexedDB()
    return () => { cancelled = true }
  }, [receiptId, inMemoryUrl, driveUrl])

  return { imageUrl, loading }
}
