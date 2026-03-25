'use client'

import { useState } from 'react'
import { Category, BudgetItem as BudgetItemType } from '@/types/budget'
import { BudgetItem } from './BudgetItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { formatEuro } from '@/lib/budget/frequency-converter'
import { Plus, X, TrendingUp, ShieldCheck, ShoppingCart, PiggyBank, Home } from 'lucide-react'

// Category Icon Mapping
const CATEGORY_ICONS = {
  income: TrendingUp,
  fixed: ShieldCheck,
  variable: ShoppingCart,
  savings: PiggyBank,
  housing: Home,
} as const

// Category Icon Colors - Modern semantic colors
const CATEGORY_COLORS = {
  income: 'text-emerald-600',
  fixed: 'text-slate-600',
  variable: 'text-blue-600',
  savings: 'text-orange-600',
  housing: 'text-indigo-600',
} as const

// Category Border Colors - 3px left accent
const CATEGORY_BORDERS = {
  income: 'border-l-[3px] border-l-emerald-500',
  fixed: 'border-l-[3px] border-l-slate-500',
  variable: 'border-l-[3px] border-l-blue-500',
  savings: 'border-l-[3px] border-l-orange-500',
  housing: 'border-l-[3px] border-l-indigo-500',
} as const

interface CategorySectionProps {
  category: Category
  total: number
  showSubtotals?: {
    mortgage: number
    utilities: number
  }
  onAddItem?: (categoryId: string, item: Omit<BudgetItemType, 'id'>) => void
  onEditItem?: (categoryId: string, itemId: string, updates: Partial<BudgetItemType>) => void
  onDeleteItem?: (categoryId: string, itemId: string) => void
}

export function CategorySection({
  category,
  total,
  showSubtotals,
  onAddItem,
  onEditItem,
  onDeleteItem
}: CategorySectionProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = (item: Omit<BudgetItemType, 'id'>) => {
    if (onAddItem) {
      onAddItem(category.id, item)
      setIsAdding(false)
    }
  }

  const handleEdit = (itemId: string, updates: Partial<BudgetItemType>) => {
    if (onEditItem) {
      onEditItem(category.id, itemId, updates)
    }
  }

  const handleDelete = (itemId: string) => {
    if (onDeleteItem) {
      onDeleteItem(category.id, itemId)
    }
  }

  const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] || TrendingUp
  const iconColor = CATEGORY_COLORS[category.id as keyof typeof CATEGORY_COLORS] || 'text-slate-700'
  const borderColor = CATEGORY_BORDERS[category.id as keyof typeof CATEGORY_BORDERS] || ''

  return (
    <Card className={`${borderColor} bg-white shadow-sm hover:shadow-md transition-all duration-200`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <span className="font-semibold text-slate-900">{category.name}</span>
          </div>
          <span className={`text-lg font-semibold ${iconColor} tabular-nums`}>{formatEuro(total)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-0.5">
          {category.items.map((item) => (
            <BudgetItem
              key={item.id}
              item={item}
              onEdit={onEditItem ? handleEdit : undefined}
              onDelete={onDeleteItem ? handleDelete : undefined}
            />
          ))}

          {category.items.length === 0 && !isAdding && (
            <div className="text-sm text-muted-foreground text-center py-4">
              Keine Posten vorhanden
            </div>
          )}

          {/* Add new item */}
          {isAdding && (
            <NewItemForm
              onSave={handleAdd}
              onCancel={() => setIsAdding(false)}
            />
          )}

          {/* Add button */}
          {onAddItem && !isAdding && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Posten hinzufügen
            </Button>
          )}

          {/* Housing subtotals */}
          {showSubtotals && (
            <>
              <Separator className="my-3" />
              <div className="flex justify-between items-center py-1 px-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Nebenkosten Gesamt
                </span>
                <span className="text-sm font-semibold">
                  {formatEuro(showSubtotals.utilities)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 px-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Hauskosten Gesamt
                </span>
                <span className="text-sm font-semibold">
                  {formatEuro(total)}
                </span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// New Item Form Component
function NewItemForm({
  onSave,
  onCancel
}: {
  onSave: (item: Omit<BudgetItemType, 'id'>) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')

  const handleSave = () => {
    const amountInCents = Math.round(parseFloat(amount) * 100)
    if (name.trim() && !isNaN(amountInCents)) {
      onSave({
        name: name.trim(),
        amount: amountInCents,
        frequency,
      })
    }
  }

  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-muted/50 rounded-md">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8 text-sm flex-1 bg-background border rounded px-2"
        placeholder="Name"
        autoFocus
      />
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-8 text-sm w-24 bg-background border rounded px-2"
        placeholder="Betrag"
      />
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as typeof frequency)}
        className="h-8 text-sm w-28 bg-background border rounded px-2"
      >
        <option value="monthly">Monatlich</option>
        <option value="quarterly">Quartalsweise</option>
        <option value="yearly">Jährlich</option>
      </select>
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
        <Plus className="h-4 w-4 text-[oklch(0.60_0.20_155)]" />
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onCancel}>
        <X className="h-4 w-4 text-[oklch(0.58_0.24_25)]" />
      </Button>
    </div>
  )
}
