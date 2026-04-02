'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/receipts/ChatInterface'
import { ReceiptManager } from '@/components/receipts/ReceiptManager'
import GoogleAuthButton from '@/components/google/GoogleAuthButton'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus, List, Trash2, AlertTriangle, FolderPlus } from 'lucide-react'

type View = 'chat' | 'list'

export default function BelegePage() {
  const [view, setView] = useState<View>('chat')
  const [chatKey, setChatKey] = useState(0)
  const [cleaning, setCleaning] = useState(false)
  const [cleanupResult, setCleanupResult] = useState<string | null>(null)

  const handleClearChat = () => {
    localStorage.removeItem('receipt-chat-messages')
    setChatKey((k) => k + 1)
  }

  const handleCleanupDrive = async () => {
    if (!confirm('Alle Testdaten im Google Drive löschen? (Belege-Ordner wird geleert)')) return
    setCleaning(true)
    setCleanupResult(null)
    try {
      const res = await fetch('/api/google/cleanup', { method: 'DELETE' })
      const data = await res.json()
      setCleanupResult(data.success ? `${data.deleted} Dateien gelöscht` : `Fehler: ${data.error}`)
    } catch {
      setCleanupResult('Fehler beim Aufräumen')
    } finally {
      setCleaning(false)
    }
  }

  const handleInitDrive = async () => {
    setCleaning(true)
    setCleanupResult(null)
    try {
      const res = await fetch('/api/google/init', { method: 'POST' })
      const data = await res.json()
      setCleanupResult(data.success ? data.message : `Fehler: ${data.error}`)
    } catch {
      setCleanupResult('Fehler beim Erstellen der Struktur')
    } finally {
      setCleaning(false)
    }
  }

  const handleClearLocalStorage = async () => {
    if (!confirm('Alle lokalen Belege, Tombstones und Chat-Nachrichten löschen?')) return
    localStorage.removeItem('haushaltsplaner_receipts')
    localStorage.removeItem('haushaltsplaner_deleted_receipts')
    localStorage.removeItem('receipt-chat-messages')
    // Also clear receipt images from IndexedDB
    try {
      const { clearAllImages } = await import('@/lib/storage/imageStore')
      await clearAllImages()
    } catch {
      // IndexedDB cleanup is best-effort
    }
    setChatKey((k) => k + 1)
    setCleanupResult('LocalStorage, Tombstones und Bilder geleert')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center shrink-0">
              {/* View Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setView('chat')}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'chat'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Neuer Beleg</span>
                  <span className="sm:hidden">Neu</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Übersicht</span>
                  <span className="sm:hidden">Liste</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
              {view === 'chat' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="text-slate-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Chat leeren</span>
                </Button>
              )}
              {view === 'list' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearLocalStorage}
                    className="text-slate-500 hover:text-orange-600"
                    title="Lokal leeren"
                  >
                    <Trash2 className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Lokal leeren</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleInitDrive}
                    disabled={cleaning}
                    className="text-slate-500 hover:text-emerald-600"
                    title="Drive-Struktur erstellen"
                  >
                    <FolderPlus className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">{cleaning ? 'Erstelle...' : 'Drive-Struktur'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCleanupDrive}
                    disabled={cleaning}
                    className="text-slate-500 hover:text-red-600"
                    title="Drive leeren"
                  >
                    <AlertTriangle className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">{cleaning ? 'Räume auf...' : 'Drive leeren'}</span>
                  </Button>
                </>
              )}
              <GoogleAuthButton />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'chat' ? (
        <div className="flex-1 min-h-0">
          <ChatInterface key={chatKey} embedded />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {cleanupResult && (
              <div className="mb-4 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700">
                {cleanupResult}
              </div>
            )}
            <ReceiptManager />
          </div>
        </div>
      )}
    </div>
  )
}
