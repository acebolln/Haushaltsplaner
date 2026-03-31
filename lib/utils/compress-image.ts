/**
 * Client-side image compression for upload
 *
 * Compresses images to fit within Vercel's 4.5MB request body limit.
 * Target: ~1.5MB max (leaves room for receipt metadata in the request).
 * PDFs are NOT compressed (passed through as-is).
 */

const MAX_SIZE_BYTES = 1.5 * 1024 * 1024 // 1.5 MB
const MAX_DIMENSION = 2048 // max width/height in pixels

/**
 * Compress a base64 image to fit within size limits
 * Returns the original if it's a PDF or already small enough
 */
export async function compressImage(dataUri: string): Promise<string> {
  // Don't compress PDFs
  if (dataUri.startsWith('data:application/pdf')) {
    return dataUri
  }

  // Check if already small enough
  const base64Data = dataUri.split(',')[1] || ''
  const currentSize = base64Data.length * 0.75 // approximate byte size
  if (currentSize <= MAX_SIZE_BYTES) {
    return dataUri
  }

  // Compress using canvas
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      // Scale down if too large
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      // Try decreasing quality until size is acceptable
      let quality = 0.8
      let result = canvas.toDataURL('image/jpeg', quality)

      while (result.length * 0.75 > MAX_SIZE_BYTES && quality > 0.3) {
        quality -= 0.1
        result = canvas.toDataURL('image/jpeg', quality)
      }

      resolve(result)
    }
    img.onerror = () => {
      // Fallback: return original if compression fails
      resolve(dataUri)
    }
    img.src = dataUri
  })
}
