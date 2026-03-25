'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Upload, Camera, Loader2 } from 'lucide-react'

interface ChatUploadProps {
  onUpload: (file: File) => void
  uploading?: boolean
  progress?: number
  error?: string | null
}

const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/heic': ['.heic'],
  'application/pdf': ['.pdf'],
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function ChatUpload({ onUpload, uploading = false, progress = 0, error }: ChatUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        if (file.size > MAX_FILE_SIZE) {
          alert('Datei ist zu groß. Maximale Größe: 10 MB')
          return
        }
        onUpload(file)
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: false,
    disabled: uploading,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <div className="w-full">
      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200
          ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-300 bg-white hover:border-slate-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />

        <div className="p-8 text-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Beleg wird analysiert...</p>
                {progress > 0 && (
                  <div className="w-48 mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-slate-100">
                <Upload className="h-8 w-8 text-slate-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  {isDragActive ? 'Beleg hier ablegen...' : 'Beleg hochladen'}
                </p>
                <p className="text-xs text-slate-500">
                  Ziehen Sie einen Beleg hierher oder klicken Sie auf eine Schaltfläche unten
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!uploading && (
          <div className="flex flex-col sm:flex-row gap-2 px-8 pb-6 justify-center">
            <Button onClick={open} variant="default" className="gap-2">
              <Upload className="h-4 w-4" />
              Datei auswählen
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.capture = 'environment' // Use rear camera on mobile
                input.onchange = (event) => {
                  const file = (event.target as HTMLInputElement).files?.[0]
                  if (file) onUpload(file)
                }
                input.click()
              }}
              variant="outline"
              className="gap-2 sm:hidden" // Only show on mobile
            >
              <Camera className="h-4 w-4" />
              Foto aufnehmen
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">Fehler: {error}</p>
        </div>
      )}

      {/* Supported Formats */}
      {!uploading && !error && (
        <p className="mt-3 text-xs text-slate-500 text-center">
          Unterstützte Formate: JPG, PNG, HEIC, PDF (max. 10 MB)
        </p>
      )}
    </div>
  )
}
