/**
 * Sync Status Badge Component
 *
 * Shows the Google Drive sync status for a receipt:
 * - ✓ Synced (green) - Successfully synced to Drive/Sheets
 * - Local only (gray) - Not synced, stored in LocalStorage only
 * - Syncing... (blue) - Currently uploading
 */

'use client'

import { Receipt } from '@/types/receipt'
import { Badge } from '@/components/ui/badge'
import { Cloud, CloudOff, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface SyncStatusBadgeProps {
  receipt: Receipt
  isSyncing?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SyncStatusBadge({ receipt, isSyncing = false, className = '', size = 'sm' }: SyncStatusBadgeProps) {
  // Size classes for icons and text
  const sizeClasses = {
    sm: { icon: 'h-3 w-3', text: 'text-xs', padding: 'px-2 py-0.5' },
    md: { icon: 'h-4 w-4', text: 'text-sm', padding: 'px-3 py-1' },
    lg: { icon: 'h-5 w-5', text: 'text-base', padding: 'px-4 py-1.5' },
  }
  const sizes = sizeClasses[size]

  // Syncing state (in progress)
  if (isSyncing) {
    return (
      <Badge
        variant="outline"
        className={`bg-blue-50 text-blue-700 border-blue-200 ${sizes.text} ${sizes.padding} ${className}`}
      >
        <Loader2 className={`${sizes.icon} mr-1 animate-spin`} />
        Wird synchronisiert...
      </Badge>
    )
  }

  // Synced state (has Drive metadata)
  if (receipt.driveFileId && receipt.syncedAt) {
    const syncDate = new Date(receipt.syncedAt)
    const formattedDate = format(syncDate, 'dd.MM.yyyy HH:mm', { locale: de })

    return (
      <Badge
        variant="outline"
        className={`bg-emerald-50 text-emerald-700 border-emerald-200 ${sizes.text} ${sizes.padding} ${className}`}
        title={`Synchronisiert am ${formattedDate}`}
      >
        <Cloud className={`${sizes.icon} mr-1`} />
        ✓ Synchronisiert
      </Badge>
    )
  }

  // Local only (not synced)
  return (
    <Badge
      variant="outline"
      className={`bg-slate-100 text-slate-600 border-slate-200 ${sizes.text} ${sizes.padding} ${className}`}
      title="Nur lokal gespeichert. Verbinden Sie sich mit Google für automatische Sicherung."
    >
      <CloudOff className={`${sizes.icon} mr-1`} />
      Nur lokal
    </Badge>
  )
}
