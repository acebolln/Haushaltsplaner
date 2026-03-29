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
    if (!confirm('Alle lokalen Belege und Chat-Nachrichten löschen?')) return
    localStorage.removeItem('haushaltsplaner_receipts')
    localStorage.removeItem('receipt-chat-messages')
    // Also clear receipt images from IndexedDB
    try {
      const { clearAllImages } = await import('@/lib/storage/imageStore')
      await clearAllImages()
    } catch {
      // IndexedDB cleanup is best-effort
    }
    setChatKey((k) => k + 1)
    setCleanupResult('LocalStorage und Bilder geleert')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setView('chat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'chat'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  Neuer Beleg
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                  Übersicht
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {view === 'chat' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="text-slate-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Chat leeren
                </Button>
              )}
              {view === 'list' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearLocalStorage}
                    className="text-slate-500 hover:text-orange-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Lokal leeren
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleInitDrive}
                    disabled={cleaning}
                    className="text-slate-500 hover:text-emerald-600"
                  >
                    <FolderPlus className="h-4 w-4 mr-1.5" />
                    {cleaning ? 'Erstelle...' : 'Drive-Struktur'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCleanupDrive}
                    disabled={cleaning}
                    className="text-slate-500 hover:text-red-600"
                  >
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    {cleaning ? 'Räume auf...' : 'Drive leeren'}
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
        <ChatInterface key={chatKey} embedded />
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
