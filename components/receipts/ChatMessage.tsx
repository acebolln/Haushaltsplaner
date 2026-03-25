// Chat Message Component - Individual Message Bubble

'use client'

import { ChatMessage as ChatMessageType } from '@/types/chat'
import { Receipt } from '@/types/receipt'
import { User, Bot, Check, AlertCircle, FileText, Paperclip } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface ChatMessageProps {
  message: ChatMessageType
  onReceiptEdit?: (receipt: Receipt) => void
  onReceiptConfirm?: (receipt: Receipt) => void
  onReceiptReject?: (receipt: Receipt) => void
}

/**
 * ChatMessage - Individual message bubble
 * Supports three message types:
 * - User messages (right-aligned, indigo)
 * - Assistant messages (left-aligned, slate)
 * - System messages (centered, colored badge)
 */
export function ChatMessage({
  message,
  onReceiptEdit,
  onReceiptConfirm,
  onReceiptReject,
}: ChatMessageProps) {
  const { role, content, timestamp, status } = message

  // Format timestamp
  const timeStr = format(timestamp, 'HH:mm', { locale: de })

  // System messages (centered, no avatar)
  if (role === 'system') {
    return (
      <div className="flex justify-center px-4 py-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <Check className="w-4 h-4" />
          {content.map((item, idx) =>
            item.type === 'text' ? (
              <span key={idx}>{item.text}</span>
            ) : null
          )}
        </div>
      </div>
    )
  }

  // User messages (right-aligned)
  if (role === 'user') {
    return (
      <div className="flex justify-end px-4 py-2 animate-slide-in-right">
        <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]">
          {/* Message Content */}
          <div className="flex-1">
            {content.map((item, idx) => {
              if (item.type === 'text') {
                return (
                  <div
                    key={idx}
                    className="bg-indigo-100 text-slate-900 rounded-2xl rounded-tr-sm px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm"
                  >
                    <p className="text-base whitespace-pre-wrap">{item.text}</p>
                  </div>
                )
              }

              if (item.type === 'image') {
                const isPdf = item.fileName?.toLowerCase().endsWith('.pdf')
                return (
                  <div
                    key={idx}
                    className="bg-indigo-100 rounded-2xl rounded-tr-sm p-2 shadow-sm max-w-full overflow-hidden"
                  >
                    {isPdf ? (
                      <div className="flex items-center gap-3 px-3 py-4 bg-white/60 rounded-lg">
                        <div className="shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate min-w-0">
                          {item.fileName}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.fileName || 'Uploaded image'}
                        className="max-w-full h-auto max-h-64 rounded-lg"
                      />
                    )}
                    {item.fileName && !isPdf && (
                      <div className="flex items-center gap-1.5 mt-2 px-2 max-w-full overflow-hidden">
                        <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
                        <p className="text-xs text-slate-600 truncate min-w-0">
                          {item.fileName}
                        </p>
                      </div>
                    )}
                  </div>
                )
              }

              return null
            })}

            {/* Timestamp */}
            <div className="flex items-center justify-end gap-1 mt-1 px-2">
              <span className="text-xs text-slate-400">{timeStr}</span>
              {status === 'sending' && (
                <span className="text-xs text-slate-400">●</span>
              )}
              {status === 'sent' && (
                <Check className="w-3 h-3 text-slate-400" />
              )}
              {status === 'error' && (
                <AlertCircle className="w-3 h-3 text-red-400" />
              )}
            </div>
          </div>

          {/* User Avatar */}
          <div className="shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    )
  }

  // Assistant messages (left-aligned)
  if (role === 'assistant') {
    return (
      <div className="flex justify-start px-4 py-2 animate-slide-in-left">
        <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]">
          {/* AI Avatar */}
          <div className="shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>

          {/* Message Content */}
          <div className="flex-1">
            {content.map((item, idx) => {
              if (item.type === 'text') {
                return (
                  <div
                    key={idx}
                    className="bg-slate-100 text-slate-900 rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm"
                  >
                    <p className="text-base whitespace-pre-wrap">{item.text}</p>
                  </div>
                )
              }

              // Receipt card is rendered by parent (ChatInterface)
              // This component just handles text/image content
              if (item.type === 'receipt') {
                return (
                  <div
                    key={idx}
                    className="mt-2"
                  >
                    {/* Receipt card will be inserted here by parent */}
                  </div>
                )
              }

              return null
            })}

            {/* Timestamp */}
            <div className="flex items-center gap-1 mt-1 px-2">
              <span className="text-xs text-slate-400">{timeStr}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

/**
 * TypingIndicator - Animated dots while assistant is "thinking"
 */
export function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 py-2 animate-fade-in">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* AI Avatar */}
        <div className="shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>

        {/* Typing Animation */}
        <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
