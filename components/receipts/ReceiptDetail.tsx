'use client'

import { useState } from 'react'
import { Receipt, ReceiptCategory, PaymentMethod } from '@/types/receipt'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryBadge } from './CategoryBadge'
import { PaymentMethodBadge } from './PaymentMethodBadge'
import { SyncStatusBadge } from './SyncStatusBadge'
import { RetrySyncButton } from './RetrySyncButton'
import { formatEuro } from '@/lib/budget/frequency-converter'
import { useReceiptImage } from '@/hooks/useReceiptImage'
import { format } from 'date-fns'
import { Loader2, CheckCircle } from 'lucide-react'

interface ReceiptDetailProps {
  receipt: Receipt | null
  open: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<Receipt>) => void
  onSyncComplete?: (receipt: Receipt) => void
}

// Category labels
const CATEGORY_OPTIONS: { value: ReceiptCategory; label: string }[] = [
  { value: 'hausrenovierung', label: 'Hausrenovierung' },
  { value: 'variable-kosten-vermietung', label: 'Variable Kosten Vermietung' },
  { value: 'berufsbezogene-ausgaben', label: 'Berufsbezogene Ausgaben' },
  { value: 'selbststaendige-taetigkeit', label: 'Selbstständige Tätigkeit' },
  { value: 'haushaltsfuehrung', label: 'Haushaltsführung' },
  { value: 'sonstige', label: 'Sonstige' },
]

// Payment method labels
const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Bar' },
  { value: 'card', label: 'Karte' },
  { value: 'bank-transfer', label: 'Überweisung' },
  { value: 'other', label: 'Sonstige' },
]

export function ReceiptDetail({ receipt, open, onClose, onSave, onSyncComplete }: ReceiptDetailProps) {
  const { imageUrl: resolvedImageUrl } = useReceiptImage(
    receipt?.id,
    receipt?.imageUrl,
    receipt?.driveFileUrl
  )
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [editMerchant, setEditMerchant] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState<ReceiptCategory>('sonstige')
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod>('card')
  const [editNotes, setEditNotes] = useState('')

  // Initialize edit state when receipt changes
  const handleEdit = () => {
    if (!receipt) return
    setEditMerchant(receipt.merchantName)
    setEditDate(receipt.date)
    setEditAmount((receipt.totalAmount / 100).toFixed(2))
    setEditCategory(receipt.category)
    setEditPaymentMethod(receipt.paymentMethod)
    setEditNotes(receipt.notes || '')
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!receipt) return

    const amountInCents = Math.round(parseFloat(editAmount) * 100)
    if (!editMerchant.trim() || isNaN(amountInCents)) {
      alert('Bitte füllen Sie alle Pflichtfelder aus')
      return
    }

    // Set saving state
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Small delay to show loading state (UX feedback)
      await new Promise(resolve => setTimeout(resolve, 400))

      onSave(receipt.id, {
        merchantName: editMerchant.trim(),
        date: editDate,
        totalAmount: amountInCents,
        category: editCategory,
        paymentMethod: editPaymentMethod,
        notes: editNotes.trim() || undefined,
      })

      // Show success state
      setIsSaving(false)
      setSaveSuccess(true)

      // Wait a bit to show success, then exit edit mode
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)

      // Auto-close after showing success
      setTimeout(() => {
        onClose()
      }, 1200)

    } catch (error) {
      console.error('Save failed:', error)
      alert('Fehler beim Speichern')
      setIsSaving(false)
      setSaveSuccess(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (!receipt) return null

  const isTaxDeductible = ['hausrenovierung', 'variable-kosten-vermietung', 'berufsbezogene-ausgaben', 'selbststaendige-taetigkeit'].includes(receipt.category)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Beleg-Details</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Bearbeiten Sie die Beleg-Daten' : 'Vollständige Informationen zum Beleg'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Accessibility: Announce save status */}
          <div className="sr-only" role="status" aria-live="polite">
            {isSaving && 'Wird gespeichert'}
            {saveSuccess && 'Beleg erfolgreich gespeichert'}
          </div>

          {/* Image Preview */}
          {resolvedImageUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <img
                src={resolvedImageUrl}
                alt={`Beleg von ${receipt.merchantName}`}
                className="w-full h-auto max-h-96 object-contain bg-slate-50"
              />
            </div>
          )}

          {/* Edit Mode */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Händler</label>
                <Input
                  value={editMerchant}
                  onChange={(e) => setEditMerchant(e.target.value)}
                  placeholder="Händlername"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Datum</label>
                  <Input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Betrag (€)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Kategorie</label>
                  <Select value={editCategory} onValueChange={(v) => setEditCategory(v as ReceiptCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Zahlungsart</label>
                  <Select value={editPaymentMethod} onValueChange={(v) => setEditPaymentMethod(v as PaymentMethod)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Notizen</label>
                <Input
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Optionale Notizen"
                />
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                    Händler
                  </label>
                  <p className="text-sm font-medium text-slate-900">{receipt.merchantName}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                    Datum
                  </label>
                  <p className="text-sm font-medium text-slate-900">
                    {format(new Date(receipt.date), 'dd.MM.yyyy')}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                  Betrag
                </label>
                <p className="text-2xl font-semibold text-slate-900 tabular-nums">
                  {formatEuro(receipt.totalAmount)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 block">
                    Kategorie
                  </label>
                  <CategoryBadge category={receipt.category} taxDeductible={isTaxDeductible} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 block">
                    Zahlungsart
                  </label>
                  <PaymentMethodBadge paymentMethod={receipt.paymentMethod} />
                </div>
              </div>

              {receipt.notes && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                    Notizen
                  </label>
                  <p className="text-sm text-slate-700">{receipt.notes}</p>
                </div>
              )}

              {/* Line Items (Read-only in MVP) */}
              {receipt.lineItems && receipt.lineItems.length > 0 && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 block">
                    Positionen
                  </label>
                  <div className="space-y-2">
                    {receipt.lineItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-baseline text-sm">
                        <span className="text-slate-700">
                          {item.quantity}x {item.description}
                        </span>
                        <span className="font-medium text-slate-900 tabular-nums">
                          {formatEuro(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Drive Sync Status */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Cloud-Synchronisierung
                  </label>
                  <SyncStatusBadge receipt={receipt} />
                </div>

                {/* Retry Sync Button (shows only if not synced and authenticated) */}
                <RetrySyncButton
                  receipt={receipt}
                  onSyncComplete={(updatedReceipt) => {
                    onSave(updatedReceipt.id, updatedReceipt)
                    if (onSyncComplete) {
                      onSyncComplete(updatedReceipt)
                    }
                  }}
                />

                {/* Drive Link (if synced) */}
                {receipt.driveFileUrl && (
                  <a
                    href={receipt.driveFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    In Google Drive öffnen →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving || saveSuccess}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                className={saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saveSuccess && <CheckCircle className="mr-2 h-4 w-4" />}
                {isSaving ? 'Wird gespeichert...' : saveSuccess ? 'Gespeichert ✓' : 'Speichern'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Schließen
              </Button>
              <Button onClick={handleEdit}>Bearbeiten</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
