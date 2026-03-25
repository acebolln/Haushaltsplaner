'use client'

import { useState } from 'react'
import { BudgetItem as BudgetItemType, Frequency } from '@/types/budget'
import { formatWithOriginal } from '@/lib/budget/frequency-converter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pencil, Trash2, Check, X } from 'lucide-react'

interface BudgetItemProps {
  item: BudgetItemType
  onEdit?: (id: string, updates: Partial<BudgetItemType>) => void
  onDelete?: (id: string) => void
}

export function BudgetItem({ item, onEdit, onDelete }: BudgetItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editAmount, setEditAmount] = useState((item.amount / 100).toString())
  const [editFrequency, setEditFrequency] = useState<Frequency>(item.frequency)

  const handleSave = () => {
    const amountInCents = Math.round(parseFloat(editAmount) * 100)
    if (onEdit && editName.trim() && !isNaN(amountInCents)) {
      onEdit(item.id, {
        name: editName.trim(),
        amount: amountInCents,
        frequency: editFrequency,
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditName(item.name)
    setEditAmount((item.amount / 100).toString())
    setEditFrequency(item.frequency)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onDelete && confirm(`"${item.name}" wirklich löschen?`)) {
      onDelete(item.id)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 bg-muted/50 rounded-md">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="h-8 text-sm flex-1"
          placeholder="Name"
        />
        <Input
          type="number"
          step="0.01"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          className="h-8 text-sm w-20 sm:w-24"
          placeholder="Betrag"
        />
        <Select value={editFrequency} onValueChange={(v) => setEditFrequency(v as Frequency)}>
          <SelectTrigger className="h-8 text-sm w-24 sm:w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monatlich</SelectItem>
            <SelectItem value="quarterly">Quartalsweise</SelectItem>
            <SelectItem value="yearly">Jährlich</SelectItem>
          </SelectContent>
        </Select>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
          <Check className="h-4 w-4 text-[oklch(0.60_0.20_155)]" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
          <X className="h-4 w-4 text-[oklch(0.58_0.24_25)]" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-50 rounded-md transition-all duration-150 group">
      <span className="text-sm font-medium text-slate-700">{item.name}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 tabular-nums">
          {formatWithOriginal(item.amount, item.frequency)}
        </span>
        {(onEdit || onDelete) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 hover:bg-slate-100"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5 text-slate-600" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
