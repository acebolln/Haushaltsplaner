// Chat Input Component - Bottom Bar with File Upload

'use client'

import { useState, useRef, KeyboardEvent, ChangeEvent, DragEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Paperclip, Send, X, FileText, Camera } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onFileUpload: (file: File) => void
  disabled?: boolean
  placeholder?: string
}

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * ChatInput - Fixed bottom input bar
 * Features:
 * - Auto-growing textarea (max 3 lines)
 * - File upload button (paperclip)
 * - Drag & drop support
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 */
export function ChatInput({
  onSendMessage,
  onFileUpload,
  disabled = false,
  placeholder = 'Nachricht eingeben...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle text input change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    // Auto-grow textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  // Handle Enter key (send) vs Shift+Enter (new line)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Send message or file
  const handleSend = () => {
    if (disabled) return

    // If file is selected, upload it
    if (selectedFile) {
      onFileUpload(selectedFile)
      clearFile()
      return
    }

    // Send text message
    const trimmed = message.trim()
    if (trimmed) {
      onSendMessage(trimmed)
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  // Handle file selection from input
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  // Validate file and create preview
  const validateAndSetFile = (file: File) => {
    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      alert('Nur JPG, PNG, HEIC und PDF Dateien erlaubt')
      return
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert('Datei zu groß. Maximale Größe: 10MB')
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFilePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle camera capture on mobile
  const handleCameraCapture = () => {
    if (disabled) return

    // Check if camera is available (basic check)
    if (!navigator.mediaDevices && !('capture' in document.createElement('input'))) {
      alert('Kamera nicht verfügbar auf diesem Gerät')
      return
    }

    // Create dynamic input element for camera capture
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment' // Rear camera for receipts

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        validateAndSetFile(file) // Reuse existing validation
      }
    }

    // Error handling for camera access denial
    input.onerror = () => {
      alert('Kamerazugriff verweigert. Bitte erlauben Sie den Zugriff in den Browser-Einstellungen.')
    }

    input.click()
  }

  // Handle drag events
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Handle file drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  return (
    <div className="relative">
      {/* Drag & Drop Overlay */}
      {dragActive && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-500/10 border-2 border-dashed border-indigo-500 rounded-lg"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Paperclip className="w-12 h-12 mx-auto text-indigo-600 mb-2" />
            <p className="text-sm font-medium text-indigo-900">Beleg hier ablegen</p>
          </div>
        </div>
      )}

      {/* File Preview (if file selected) */}
      {selectedFile && filePreview && (
        <div className="mb-2 p-2 sm:p-3 bg-slate-100 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            {selectedFile.type === 'application/pdf' ? (
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded flex items-center justify-center">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
            ) : (
              <img
                src={filePreview}
                alt="Preview"
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={clearFile}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Datei entfernen"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div
        className="flex items-end gap-2 p-2 sm:p-4"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* File Upload Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
          disabled={disabled}
          className="shrink-0 text-slate-600 hover:text-indigo-600"
          aria-label="Datei anhängen"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Camera Capture Button (Mobile Only) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleCameraCapture()
          }}
          disabled={disabled}
          className="shrink-0 text-slate-600 hover:text-indigo-600 sm:hidden"
          aria-label="Foto aufnehmen"
        >
          <Camera className="w-5 h-5" />
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Datei auswählen"
        />

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E6035F] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ maxHeight: '120px' }}
          aria-label="Nachricht eingeben"
        />

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && !selectedFile)}
          size="icon"
          className="shrink-0"
          aria-label="Senden"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
