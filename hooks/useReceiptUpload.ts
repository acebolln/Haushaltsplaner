import { useState, useCallback } from 'react'
import { Receipt } from '@/types/receipt'

interface UploadResult {
  success: boolean
  receipt?: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>
  error?: string
}

/**
 * Hook for handling receipt file upload and analysis
 */
export function useReceiptUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadAndAnalyze = useCallback(async (file: File): Promise<UploadResult> => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Convert file to base64
      setProgress(25)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          resolve(result)
        }
        reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'))
        reader.readAsDataURL(file)
      })

      setProgress(50)

      // Call API to analyze receipt
      const response = await fetch('/api/receipts/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: base64 }),
      })

      setProgress(75)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Analyse fehlgeschlagen')
      }

      const data = await response.json()
      setProgress(100)

      return {
        success: true,
        receipt: {
          ...data.receipt,
          imageData: base64, // Store the image data
        },
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setUploading(false)
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000)
    }
  }, [])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    uploading,
    progress,
    error,
    uploadAndAnalyze,
    resetError,
  }
}
