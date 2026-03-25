// Chat Message State Management Hook

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ChatMessage, ChatMessageContent } from '@/types/chat'

const MAX_STORED_MESSAGES = 20
const STORAGE_KEY = 'receipt-chat-messages'

/**
 * Custom hook for managing chat messages
 * Features:
 * - Add user/assistant/system messages
 * - Typing indicator state
 * - LocalStorage persistence (last 20 messages)
 * - Auto-scroll to bottom
 */
export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[]
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDates)
      }
    } catch (error) {
      console.error('Failed to load chat messages from storage:', error)
    }
  }, [])

  // Save messages to LocalStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // Keep only last MAX_STORED_MESSAGES
        const toStore = messages.slice(-MAX_STORED_MESSAGES)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
      } catch (error) {
        console.error('Failed to save chat messages to storage:', error)
      }
    }
  }, [messages])

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Add a new message
  const addMessage = useCallback(
    (
      role: ChatMessage['role'],
      content: ChatMessageContent[],
      status: ChatMessage['status'] = 'sent'
    ) => {
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: new Date(),
        status,
      }

      setMessages((prev) => [...prev, newMessage])
      return newMessage.id
    },
    []
  )

  // Add user text message
  const addUserMessage = useCallback(
    (text: string) => {
      return addMessage('user', [{ type: 'text', text }])
    },
    [addMessage]
  )

  // Add assistant text message
  const addAssistantMessage = useCallback(
    (text: string) => {
      return addMessage('assistant', [{ type: 'text', text }])
    },
    [addMessage]
  )

  // Add system message
  const addSystemMessage = useCallback(
    (text: string) => {
      return addMessage('system', [{ type: 'text', text }])
    },
    [addMessage]
  )

  // Update message status (for optimistic updates)
  const updateMessageStatus = useCallback(
    (messageId: string, status: ChatMessage['status']) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
      )
    },
    []
  )

  // Update message content (for edits)
  const updateMessageContent = useCallback(
    (messageId: string, content: ChatMessageContent[]) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg))
      )
    },
    []
  )

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Show typing indicator
  const startTyping = useCallback(() => {
    setIsTyping(true)
  }, [])

  // Hide typing indicator
  const stopTyping = useCallback(() => {
    setIsTyping(false)
  }, [])

  return {
    messages,
    isTyping,
    messagesEndRef,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    updateMessageStatus,
    updateMessageContent,
    clearMessages,
    startTyping,
    stopTyping,
    scrollToBottom,
  }
}
