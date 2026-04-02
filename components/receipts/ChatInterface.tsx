// Chat Interface - Main Container for Conversational Receipt Management

'use client'

import { useEffect, useRef } from 'react'
import { useChatMessages } from '@/hooks/useChatMessages'
import { useReceiptChat } from '@/hooks/useReceiptChat'
import { useReceiptSync } from '@/hooks/useReceiptSync'
import { ChatMessage, TypingIndicator } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ReceiptChatCard } from './ReceiptChatCard'
import type { Receipt } from '@/types/receipt'
import { ImagePlus } from 'lucide-react'

interface ChatInterfaceProps {
  /** When true, hides the built-in header (parent provides it) */
  embedded?: boolean
}

/**
 * ChatInterface - Conversational Receipt Management
 *
 * User Flow:
 * 1. User uploads receipt image
 * 2. System analyzes and extracts data
 * 3. Assistant presents receipt card
 * 4. User can edit fields or confirm
 * 5. Receipt is saved to storage
 * 6. Ready for next receipt
 */
export function ChatInterface({ embedded = false }: ChatInterfaceProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Chat state
  const {
    messages,
    isTyping,
    messagesEndRef,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    addMessage,
    clearMessages,
    updateMessageContent,
    startTyping,
    stopTyping,
  } = useChatMessages()

  // Receipt processing
  const {
    currentReceipt,
    loading,
    error,
    uploadReceipt,
    updateReceiptFields,
    confirmReceipt,
    rejectReceipt,
    reset,
  } = useReceiptChat()

  // Google sync
  const { syncReceipt, isAuthenticated } = useReceiptSync()

  // No welcome message needed — empty state handles it visually
  // Welcome messages are only added implicitly via the empty state UI

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    // Add user message with image
    const imageUrl = URL.createObjectURL(file)
    addMessage('user', [
      {
        type: 'image',
        url: imageUrl,
        fileName: file.name,
        fileSize: file.size,
      },
      {
        type: 'text',
        text: 'Beleg analysieren',
      },
    ])

    // Show typing indicator
    startTyping()

    // Upload and analyze
    const receipt = await uploadReceipt(file)

    stopTyping()

    if (receipt) {
      // Success: Show assistant message with receipt card
      addAssistantMessage(
        'Ich habe deinen Beleg analysiert. Hier sind die extrahierten Daten:\n\nPrüfe bitte die Angaben und korrigiere sie falls nötig. Wenn alles passt, klicke auf "Speichern".'
      )

      // Add receipt card as separate message
      addMessage('assistant', [
        {
          type: 'receipt',
          receipt,
          editable: true,
          status: 'pending',
        },
      ])
    } else {
      // Error: Show error message
      addAssistantMessage(
        `Leider konnte ich den Beleg nicht analysieren. ${
          error || 'Bitte versuche es erneut oder gib die Daten manuell ein.'
        }`
      )
    }
  }

  // Handle text message send
  const handleSendMessage = async (text: string) => {
    addUserMessage(text)

    // Simple responses to common messages
    // In production, this would call the Claude API for intelligent responses
    startTyping()

    setTimeout(() => {
      stopTyping()

      const lowerText = text.toLowerCase()

      if (lowerText.includes('kategorie') || lowerText.includes('ändern')) {
        addAssistantMessage(
          'Kein Problem! Klicke einfach auf das Bearbeiten-Symbol neben der Kategorie im Beleg-Formular oben.'
        )
      } else if (lowerText.includes('ja') || lowerText.includes('speichern')) {
        if (currentReceipt) {
          handleConfirm()
        } else {
          addAssistantMessage('Es gibt aktuell keinen Beleg zum Speichern.')
        }
      } else if (lowerText.includes('nein') || lowerText.includes('löschen') || lowerText.includes('verwerfen')) {
        if (currentReceipt) {
          handleReject()
        } else {
          addAssistantMessage('Es gibt aktuell keinen Beleg zum Verwerfen.')
        }
      } else if (lowerText.includes('hilfe') || lowerText.includes('help')) {
        addAssistantMessage(
          'Ich helfe dir gerne! Du kannst:\n\n• Einen Beleg hochladen (per Drag & Drop oder Klick auf 📎)\n• Die extrahierten Daten überprüfen und korrigieren\n• Den Beleg speichern oder verwerfen\n\nWas möchtest du tun?'
        )
      } else {
        addAssistantMessage(
          'Ich verstehe. Lade gerne einen neuen Beleg hoch oder frage mich, wenn du Hilfe brauchst!'
        )
      }
    }, 800) // Simulate thinking time
  }

  // Handle receipt field update
  const handleReceiptUpdate = (updates: Partial<Receipt>) => {
    const updated = updateReceiptFields(updates)

    if (updated) {
      // Update the receipt card in the last message
      // Find the last receipt message and update it
      const lastReceiptMsgIndex = messages.findIndex((msg) =>
        msg.content.some((c) => c.type === 'receipt')
      )

      if (lastReceiptMsgIndex !== -1) {
        // In a full implementation, we'd update the message content
        // For now, just show confirmation
        const updatedField = Object.keys(updates)[0]
        addSystemMessage(`${getFieldLabel(updatedField)} aktualisiert`)
      }
    }
  }

  // Handle receipt confirmation + auto-sync to Google
  const handleConfirm = async () => {
    if (!currentReceipt) return

    // Capture receipt BEFORE confirmReceipt() clears state via setCurrentReceipt(null).
    // Without this, currentReceipt is null after await and sync silently skips.
    const receiptToSync = { ...currentReceipt }

    const success = await confirmReceipt()

    if (success) {
      // Mark receipt card as non-editable (remove Speichern/Verwerfen)
      const receiptMsgIndex = [...messages].reverse().findIndex((msg) =>
        msg.content.some((c) => c.type === 'receipt' && c.editable)
      )
      if (receiptMsgIndex !== -1) {
        const actualIndex = messages.length - 1 - receiptMsgIndex
        const msg = messages[actualIndex]
        const updatedContent = msg.content.map((c) =>
          c.type === 'receipt' ? { ...c, editable: false, status: 'confirmed' as const } : c
        )
        updateMessageContent(msg.id, updatedContent)
      }

      // Auto-sync to Google Drive/Sheets if authenticated
      if (isAuthenticated && receiptToSync.imageUrl) {
        addSystemMessage('Synchronisiere mit Google Drive...')
        const { compressImage } = await import('@/lib/utils/compress-image')
        const compressedImage = await compressImage(receiptToSync.imageUrl)
        const syncResult = await syncReceipt(receiptToSync, compressedImage)

        if (syncResult.success) {
          // Persist sync metadata back to LocalStorage
          try {
            const { loadReceipt, updateReceipt } = await import('@/lib/storage/receipts')
            const savedReceipt = loadReceipt(receiptToSync.id)
            if (savedReceipt) {
              updateReceipt({
                ...savedReceipt,
                driveFileId: syncResult.driveFileId,
                driveFileUrl: syncResult.driveFileUrl,
                sheetRowNumber: syncResult.sheetRowNumber,
                sheetId: syncResult.sheetId,
                syncedAt: syncResult.syncedAt,
              })
            }
          } catch {
            // Non-critical: metadata will be recovered on next pull
          }
          addSystemMessage('✓ Beleg gespeichert und mit Google Drive synchronisiert')
        } else {
          addSystemMessage(`✓ Beleg gespeichert — Drive-Sync fehlgeschlagen: ${syncResult.error || 'Unbekannt'}. Kann in der Übersicht nachgeholt werden.`)
        }
      } else if (!isAuthenticated) {
        addSystemMessage('✓ Beleg lokal gespeichert. Mit Google verbinden, um automatisch zu synchronisieren.')
      } else {
        addSystemMessage('✓ Beleg gespeichert')
      }

      addAssistantMessage('Du kannst jetzt den nächsten Beleg hochladen.')
    } else {
      addAssistantMessage(
        `Fehler beim Speichern: ${error || 'Unbekannter Fehler'}. Bitte versuche es erneut.`
      )
    }
  }

  // Handle receipt rejection
  const handleReject = () => {
    rejectReceipt()

    // Mark receipt card as non-editable
    const receiptMsgIndex = [...messages].reverse().findIndex((msg) =>
      msg.content.some((c) => c.type === 'receipt' && c.editable)
    )
    if (receiptMsgIndex !== -1) {
      const actualIndex = messages.length - 1 - receiptMsgIndex
      const msg = messages[actualIndex]
      const updatedContent = msg.content.map((c) =>
        c.type === 'receipt' ? { ...c, editable: false, status: 'rejected' as const } : c
      )
      updateMessageContent(msg.id, updatedContent)
    }

    addSystemMessage('Beleg verworfen')
    addAssistantMessage('Lade gerne einen neuen Beleg hoch.')
  }

  // Get friendly field label
  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      merchantName: 'Händler',
      date: 'Datum',
      totalAmount: 'Betrag',
      category: 'Kategorie',
      paymentMethod: 'Zahlungsmethode',
    }
    return labels[field] || field
  }

  // Show empty state only when no real conversation has happened
  const hasMessages = messages.some((m) => m.role === 'user' || m.role === 'assistant')

  return (
    <div className={`flex flex-col ${embedded ? 'h-full' : 'h-screen'} bg-slate-50`}>
      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {!hasMessages ? (
          /* Empty State — inviting start screen */
          <div className="flex flex-col items-center justify-center h-full px-4 py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#E6035F] to-[#FF4D8D] flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-pink-200">
              <ImagePlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Beleg hochladen</h2>
            <p className="text-sm sm:text-base text-slate-500 text-center max-w-md mb-6 sm:mb-8 px-4">
              Lade ein Foto deines Belegs hoch — die KI extrahiert automatisch Händler, Datum, Betrag und Kategorie.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-400">
              <span className="px-3 py-1.5 bg-slate-100 rounded-full">JPG, PNG, HEIC, PDF</span>
              <span className="px-3 py-1.5 bg-slate-100 rounded-full">Max. 10 MB</span>
              <span className="px-3 py-1.5 bg-slate-100 rounded-full">Drag & Drop</span>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-4 px-3 sm:px-4">
            {messages.map((message) => {
              const receiptContent = message.content.find((c) => c.type === 'receipt')

              return (
                <div key={message.id}>
                  <ChatMessage message={message} />

                  {receiptContent && receiptContent.type === 'receipt' && (
                    <div className="pl-0 sm:pl-11 py-2">
                      <ReceiptChatCard
                        receipt={receiptContent.receipt}
                        editable={receiptContent.editable}
                        onUpdate={handleReceiptUpdate}
                        onConfirm={handleConfirm}
                        onReject={handleReject}
                      />
                    </div>
                  )}
                </div>
              )
            })}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar — pinned to bottom of container, not fixed to viewport */}
      <div className="shrink-0 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            disabled={loading}
            placeholder={
              loading ? 'Analysiere...' : 'Nachricht oder Beleg...'
            }
          />
        </div>
      </div>
    </div>
  )
}
