// Receipt Chat Interaction Hook

'use client'

import { useState, useCallback } from 'react'
import { Receipt } from '@/types/receipt'
import { ChatResponse } from '@/types/chat'

/**
 * Custom hook for receipt chat interactions
 * Handles:
 * - Receipt upload and analysis
 * - Field corrections
 * - Confirmation/rejection
 * - API communication
 */
export function useReceiptChat() {
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload and analyze receipt image
  const uploadReceipt = useCallback(async (file: File): Promise<Receipt | null> => {
    setLoading(true)
    setError(null)

    try {
      // Convert image to base64
      const base64DataUri = await fileToBase64(file)

      // Extract MIME type and base64 data from data URI
      const mimeTypeMatch = base64DataUri.match(/^data:([^;]+);base64,/)
      if (!mimeTypeMatch) {
        throw new Error('Invalid image format')
      }

      const mimeType = mimeTypeMatch[1]
      const base64 = base64DataUri.split(',')[1] // Remove data URI prefix

      // Send to analysis API
      const response = await fetch('/api/receipts/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `API error: ${response.status}`
        console.error('Receipt analysis failed:', errorData)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Create receipt object
      const receipt: Receipt = {
        id: crypto.randomUUID(),
        merchantName: data.merchantName,
        date: data.date,
        totalAmount: data.totalAmount,
        paymentMethod: 'other', // Default — user can set actual method
        category: data.suggestedCategory,
        lineItems: data.lineItems,
        imageUrl: base64DataUri, // Store complete data URI for display
        confidence: data.confidence,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setCurrentReceipt(receipt)
      return receipt
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Update receipt field
  const updateReceiptField = useCallback(
    (field: keyof Receipt, value: any) => {
      if (!currentReceipt) return

      const updated: Receipt = {
        ...currentReceipt,
        [field]: value,
        updatedAt: new Date().toISOString(),
      }

      setCurrentReceipt(updated)
      return updated
    },
    [currentReceipt]
  )

  // Update multiple fields at once
  const updateReceiptFields = useCallback(
    (updates: Partial<Receipt>) => {
      if (!currentReceipt) return

      const updated: Receipt = {
        ...currentReceipt,
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      setCurrentReceipt(updated)
      return updated
    },
    [currentReceipt]
  )

  // Send chat message with context
  const sendChatMessage = useCallback(
    async (message: string, action?: 'confirm' | 'update' | 'reject'): Promise<ChatResponse> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/receipts/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            receiptId: currentReceipt?.id,
            action,
            updates: action === 'update' ? currentReceipt : undefined,
          }),
        })

        if (!response.ok) {
          throw new Error('Chat request failed')
        }

        const data: ChatResponse = await response.json()
        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Request failed'
        setError(errorMessage)
        return {
          success: false,
          message: 'Ein Fehler ist aufgetreten.',
          error: errorMessage,
        }
      } finally {
        setLoading(false)
      }
    },
    [currentReceipt]
  )

  // Confirm and save receipt
  const confirmReceipt = useCallback(async (onSyncComplete?: (receipt: Receipt) => void): Promise<boolean> => {
    if (!currentReceipt) return false

    setLoading(true)
    setError(null)

    try {
      // Step 1: Save image to IndexedDB (handles large PDFs that exceed LocalStorage limits)
      if (currentReceipt.imageUrl) {
        const { saveImage } = await import('@/lib/storage/imageStore')
        await saveImage(currentReceipt.id, currentReceipt.imageUrl)
      }

      // Step 2: Save metadata to LocalStorage (imageUrl is auto-stripped by saveReceipt)
      const { saveReceipt } = await import('@/lib/storage/receipts')
      saveReceipt({ ...currentReceipt, hasLocalImage: !!currentReceipt.imageUrl })

      // Step 3: Try to sync to Google Drive/Sheets (if authenticated)
      // This is optional and non-blocking — failures don't prevent saving
      try {
        const checkAuthResponse = await fetch('/api/google/session')
        const authData = await checkAuthResponse.json()

        if (authData.authenticated && currentReceipt.imageUrl) {
          const syncResponse = await fetch('/api/receipts/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              receipt: currentReceipt,
              imageBase64: currentReceipt.imageUrl,
            }),
          })

          if (syncResponse.ok) {
            const syncResult = await syncResponse.json()

            // Update receipt with sync metadata
            const syncedReceipt: Receipt = {
              ...currentReceipt,
              driveFileId: syncResult.driveFileId,
              driveFileUrl: syncResult.driveFileUrl,
              sheetRowNumber: syncResult.sheetRowNumber,
              sheetId: syncResult.sheetId,
              syncedAt: syncResult.syncedAt,
              hasLocalImage: true,
            }

            // Update LocalStorage with sync metadata (image still stripped)
            saveReceipt(syncedReceipt)

            if (onSyncComplete) {
              onSyncComplete(syncedReceipt)
            }

            console.log('Receipt synced to Google Drive/Sheets:', syncResult)
          }
        }
      } catch (syncError) {
        // Sync failed but that's OK — receipt is saved locally (metadata + image)
        console.warn('Google Drive sync failed (receipt saved locally):', syncError)
      }

      // Clear current receipt after successful save
      setCurrentReceipt(null)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Save failed'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [currentReceipt])

  // Reject and discard receipt
  const rejectReceipt = useCallback(() => {
    setCurrentReceipt(null)
    setError(null)
  }, [])

  // Reset state
  const reset = useCallback(() => {
    setCurrentReceipt(null)
    setLoading(false)
    setError(null)
  }, [])

  return {
    currentReceipt,
    loading,
    error,
    uploadReceipt,
    updateReceiptField,
    updateReceiptFields,
    sendChatMessage,
    confirmReceipt,
    rejectReceipt,
    reset,
  }
}

// Helper: Convert File to Base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
