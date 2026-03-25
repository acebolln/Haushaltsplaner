/**
 * Convert File to Base64 string
 * @param file - The file to convert
 * @returns Promise with Base64 encoded string (without data URI prefix)
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data URI prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      } else {
        reject(new Error('Failed to read file as Base64'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Get MIME type from File
 * @param file - The file to check
 * @returns MIME type string (e.g., "image/jpeg")
 */
export function getMimeType(file: File): string {
  return file.type || 'application/octet-stream'
}

/**
 * Validate image file type
 * @param file - The file to validate
 * @returns True if valid image type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  return validTypes.includes(file.type.toLowerCase())
}

/**
 * Validate image file size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in megabytes (default: 10MB)
 * @returns True if file size is acceptable
 */
export function isValidImageSize(file: File, maxSizeMB: number = 10): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Compress image file (optional - for future enhancement)
 * Currently just validates and returns the original file
 * @param file - The file to compress
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param quality - JPEG quality 0-1 (default: 0.9)
 * @returns Promise with compressed file or original if no compression needed
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.9
): Promise<File> {
  // For MVP, return original file
  // Future enhancement: use canvas to resize and compress
  return file
}
