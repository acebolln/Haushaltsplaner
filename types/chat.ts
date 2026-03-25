// Chat Interface Types for Receipt Management

import { Receipt } from './receipt'

export type ChatMessageRole = 'user' | 'assistant' | 'system'

export type ChatMessageContentType = 'text' | 'image' | 'receipt'

// Content types for different message payloads
export interface TextContent {
  type: 'text'
  text: string
}

export interface ImageContent {
  type: 'image'
  url: string // Base64 data URL or blob URL
  fileName?: string
  fileSize?: number
}

export interface ReceiptContent {
  type: 'receipt'
  receipt: Receipt
  editable: boolean
  status?: 'pending' | 'confirmed' | 'rejected'
}

export type ChatMessageContent = TextContent | ImageContent | ReceiptContent

// Main chat message structure
export interface ChatMessage {
  id: string
  role: ChatMessageRole
  content: ChatMessageContent[]
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
}

// Chat context for persistence
export interface ChatContext {
  conversationId: string
  messages: ChatMessage[]
  currentReceipt: Receipt | null
  awaitingConfirmation: boolean
}

// API Request/Response Types
export interface ChatRequest {
  message: string
  receiptId?: string
  action?: 'confirm' | 'update' | 'reject'
  updates?: Partial<Receipt>
  imageData?: string // Base64 image for new upload
}

export interface ChatResponse {
  success: boolean
  message: string
  receipt?: Receipt
  suggestedActions?: string[]
  error?: string
}
