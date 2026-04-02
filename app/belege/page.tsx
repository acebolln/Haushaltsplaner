'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatInterface } from '@/components/receipts/ChatInterface'
import { ReceiptManager } from '@/components/receipts/ReceiptManager'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { Button } from '@/components/ui/button'
import {
  MessageSquarePlus,
  List,
  Settings,
  Trash2,
  FolderPlus,
  AlertTriangle,
  LogOut,
  Loader2,
  ImagePlus,
} from 'lucide-react'

type View = 'chat' | 'list'

export default function BelegePage() {
  const { isAuthenticated, userEmail, signIn, signOut, loading: authLoading } = useGoogleAuth()
  const [view, setView] = useState<View>('chat')
  const [chatKey, setChatKey] = useState(0)
  const [cleaning, setCleaning] = useState(false)
  const [cleanupResult, setCleanupResult] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  // Close settings menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    if (settingsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [settingsOpen])

  // --- Settings actions ---

  const handleCleanupDrive = async () => {
    if (!confirm('Alle Belege im Google Drive löschen? (Belege-Ordner wird geleert)')) return
    setCleaning(true)
    setCleanupResult(null)
    setSettingsOpen(false)
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
    setSettingsOpen(false)
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
    if (!confirm('Alle lokalen Belege und Daten löschen?')) return
    localStorage.removeItem('haushaltsplaner_receipts')
    localStorage.removeItem('haushaltsplaner_deleted_receipts')
    localStorage.removeItem('receipt-chat-messages')
    try {
      const { clearAllImages } = await import('@/lib/storage/imageStore')
      await clearAllImages()
    } catch {
      // best-effort
    }
    setChatKey((k) => k + 1)
    setCleanupResult('Lokale Daten geleert')
    setSettingsOpen(false)
  }

  const handleSignOut = async () => {
    setSettingsOpen(false)
    await signOut()
  }

  // --- Loading state ---
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-65px)] bg-slate-50">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  // --- Login Gate ---
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-65px)] bg-slate-50 px-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E6035F] to-[#FF4D8D] flex items-center justify-center mb-6 shadow-lg shadow-pink-200">
          <ImagePlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Haushaltsplaner</h1>
        <p className="text-base text-slate-500 text-center max-w-sm mb-8">
          Belege erfassen, kategorisieren und sicher in Google Drive speichern.
        </p>
        <button
          onClick={signIn}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-sm font-medium text-slate-700">Mit Google anmelden</span>
        </button>
      </div>
    )
  }

  // --- Authenticated App ---
  return (
    <div className="flex flex-col h-[calc(100dvh-65px)] bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-2">
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

            {/* Settings Menu */}
            <div className="relative" ref={settingsRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="text-slate-500 hover:text-slate-700"
                aria-label="Einstellungen"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {settingsOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl border border-slate-200 shadow-lg z-50 py-1 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Angemeldet als</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{userEmail}</p>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      onClick={handleClearLocalStorage}
                      disabled={cleaning}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 text-slate-400" />
                      Lokale Daten leeren
                    </button>
                    <button
                      onClick={handleInitDrive}
                      disabled={cleaning}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                      <FolderPlus className="h-4 w-4 text-slate-400" />
                      Drive-Struktur erstellen
                    </button>
                    <button
                      onClick={handleCleanupDrive}
                      disabled={cleaning}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Drive leeren
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <LogOut className="h-4 w-4 text-slate-400" />
                      Abmelden
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cleanup Result Banner */}
      {cleanupResult && (
        <div className="shrink-0 mx-4 sm:mx-auto sm:max-w-7xl mt-2">
          <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700">
            {cleanupResult}
          </div>
        </div>
      )}

      {/* Content */}
      {view === 'chat' ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <ChatInterface key={chatKey} embedded />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ReceiptManager />
          </div>
        </div>
      )}
    </div>
  )
}
