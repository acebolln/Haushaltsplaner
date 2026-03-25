// Chat API Route - Conversational Receipt Processing
// This is a placeholder route for chat interactions
// In production, this would integrate with Claude API for intelligent responses

import { NextRequest, NextResponse } from 'next/server'
import { ChatRequest, ChatResponse } from '@/types/chat'
import type { Receipt } from '@/types/receipt'

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, action, updates } = body

    // Simple rule-based responses (placeholder)
    // In production, integrate with Claude API for context-aware responses

    const response: ChatResponse = {
      success: true,
      message: '',
    }

    // Handle different actions
    if (action === 'confirm') {
      response.message = 'Beleg wurde erfolgreich gespeichert!'
    } else if (action === 'reject') {
      response.message = 'Beleg wurde verworfen.'
    } else if (action === 'update') {
      response.message = 'Änderungen wurden übernommen.'
      response.receipt = updates as Receipt // In production, validate and process updates
    } else {
      // General chat message - simple keyword matching
      const lowerMessage = message.toLowerCase()

      if (lowerMessage.includes('hilfe') || lowerMessage.includes('help')) {
        response.message =
          'Ich helfe dir gerne! Lade einfach einen Beleg hoch (per Drag & Drop oder über die Datei-Schaltfläche), und ich extrahiere automatisch die wichtigsten Daten für dich.'
        response.suggestedActions = [
          'Beleg hochladen',
          'Kategorien anzeigen',
          'Letzte Belege',
        ]
      } else if (lowerMessage.includes('kategorie')) {
        response.message =
          'Du kannst die Kategorie direkt in der Beleg-Karte ändern. Klicke einfach auf das Bearbeiten-Symbol neben der Kategorie.'
      } else if (lowerMessage.includes('datum')) {
        response.message =
          'Das Datum kannst du ebenfalls in der Beleg-Karte ändern. Klicke auf das Bearbeiten-Symbol neben dem Datum.'
      } else {
        response.message =
          'Verstanden. Lade gerne einen Beleg hoch oder stelle mir eine Frage, wenn du Hilfe brauchst!'
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Ein Fehler ist aufgetreten.',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ChatResponse,
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'receipts/chat',
    version: '1.0.0',
  })
}
