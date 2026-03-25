// Receipt Chat Card - Inline Receipt Display & Edit

'use client'

import { useState } from 'react'
import { Receipt, PaymentMethod, ReceiptCategory } from '@/types/receipt'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CategoryBadge } from './CategoryBadge'
import { PaymentMethodBadge } from './PaymentMethodBadge'
import { Check, X, Edit2, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface ReceiptChatCardProps {
  receipt: Receipt
  editable?: boolean
  onUpdate?: (updates: Partial<Receipt>) => void
  onConfirm?: () => void
  onReject?: () => void
}

/**
 * ReceiptChatCard - Structured receipt display in chat
 * Features:
 * - Inline field editing (click to edit)
 * - Confidence indicator
 * - Confirm/Reject actions
 * - Responsive layout
 */
export function ReceiptChatCard({
  receipt,
  editable = true,
  onUpdate,
  onConfirm,
  onReject,
}: ReceiptChatCardProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [saving, setSaving] = useState(false)

  // Start editing a field
  const startEdit = (field: keyof Receipt, currentValue: any) => {
    setEditingField(field)

    // Format value for editing
    if (field === 'date') {
      setEditValue(currentValue)
    } else if (field === 'totalAmount') {
      setEditValue((currentValue / 100).toFixed(2))
    } else {
      setEditValue(String(currentValue))
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingField(null)
    setEditValue('')
  }

  // Save edited value
  const saveEdit = (field: keyof Receipt) => {
    if (!onUpdate) return

    let value: any = editValue

    // Parse value based on field type
    if (field === 'totalAmount') {
      value = Math.round(parseFloat(editValue) * 100)
    }

    onUpdate({ [field]: value })
    cancelEdit()
  }

  // Format currency
  const formatEuro = (cents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)
  }

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy', { locale: de })
    } catch {
      return dateStr
    }
  }

  // Confidence indicator
  const ConfidenceIndicator = () => {
    const { confidence } = receipt
    const config = {
      high: {
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        label: 'Hoch',
        dots: 3,
      },
      medium: {
        icon: AlertCircle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        label: 'Mittel',
        dots: 2,
      },
      low: {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        label: 'Niedrig',
        dots: 1,
      },
    }

    const { icon: Icon, color, bg, label, dots } = config[confidence]

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${bg}`}>
        <Icon className={`w-4 h-4 ${color}`} />
        <span className={`text-sm font-medium ${color}`}>
          Konfidenz: {label}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i < dots ? color.replace('text-', 'bg-') : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Editable field component
  const EditableField = ({
    label,
    field,
    value,
    icon,
  }: {
    label: string
    field: keyof Receipt
    value: string
    icon?: string
  }) => {
    const isEditing = editingField === field

    if (isEditing) {
      return (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            {icon} {label}
          </label>
          <div className="flex gap-2">
            <input
              type={field === 'totalAmount' ? 'number' : field === 'date' ? 'date' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit(field)
                if (e.key === 'Escape') cancelEdit()
              }}
              className="flex-1 px-3 py-2 border border-[#E6035F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6035F] text-base"
              autoFocus
            />
            <Button
              size="sm"
              onClick={() => saveEdit(field)}
              className="shrink-0"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelEdit}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="group flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            {icon} {label}
          </div>
          <div className="text-lg font-medium text-slate-900">{value}</div>
        </div>
        {editable && (
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => startEdit(field, receipt[field])}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`${label} bearbeiten`}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 space-y-4 max-w-2xl">
      {/* Confidence Indicator */}
      <div className="flex justify-end">
        <ConfidenceIndicator />
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Merchant */}
        <EditableField
          label="Händler"
          field="merchantName"
          value={receipt.merchantName}
          icon="🏪"
        />

        {/* Date */}
        <EditableField
          label="Datum"
          field="date"
          value={formatDate(receipt.date)}
          icon="📅"
        />

        {/* Amount */}
        <EditableField
          label="Betrag"
          field="totalAmount"
          value={formatEuro(receipt.totalAmount)}
          icon="💶"
        />

        {/* Category */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            🏷️ Kategorie
          </div>
          {editingField === 'category' ? (
            <div className="flex gap-2">
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#E6035F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6035F] text-base"
                autoFocus
              >
                <option value="hausrenovierung">Hausrenovierung</option>
                <option value="variable-kosten-vermietung">Variable Kosten Vermietung</option>
                <option value="berufsbezogene-ausgaben">Berufsbezogene Ausgaben</option>
                <option value="selbststaendige-taetigkeit">Selbstständige Tätigkeit</option>
                <option value="haushaltsfuehrung">Haushaltsführung</option>
                <option value="sonstige">Sonstige</option>
              </select>
              <Button size="sm" onClick={() => saveEdit('category')}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between group">
              <CategoryBadge category={receipt.category} />
              {editable && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => startEdit('category', receipt.category)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            💳 Zahlung
          </div>
          {editingField === 'paymentMethod' ? (
            <div className="flex gap-2">
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#E6035F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6035F] text-base"
                autoFocus
              >
                <option value="cash">Bargeld</option>
                <option value="card">Karte</option>
                <option value="bank-transfer">Überweisung</option>
                <option value="other">Sonstige</option>
              </select>
              <Button size="sm" onClick={() => saveEdit('paymentMethod')}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between group">
              <PaymentMethodBadge paymentMethod={receipt.paymentMethod} />
              {editable && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => startEdit('paymentMethod', receipt.paymentMethod)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {editable && (onConfirm || onReject) && (
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          {onConfirm && (
            <Button
              onClick={() => { setSaving(true); onConfirm() }}
              disabled={saving}
              className="flex-1"
              size="lg"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Wird gespeichert...
                </span>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Speichern
                </>
              )}
            </Button>
          )}
          {onReject && (
            <Button
              onClick={() => { setSaving(true); onReject() }}
              disabled={saving}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <X className="w-5 h-5 mr-2" />
              Verwerfen
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
