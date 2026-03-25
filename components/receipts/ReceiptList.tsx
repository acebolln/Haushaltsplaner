'use client'

import { Receipt, ReceiptCategory } from '@/types/receipt'
import { ReceiptCard } from './ReceiptCard'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, FileText } from 'lucide-react'

interface ReceiptListProps {
  receipts: Receipt[]
  onReceiptClick: (receipt: Receipt) => void
  onReceiptDelete: (id: string) => void
  searchText: string
  onSearchChange: (text: string) => void
  selectedCategory?: ReceiptCategory
  onCategoryChange: (category: ReceiptCategory | undefined) => void
}

const CATEGORY_OPTIONS: { value: ReceiptCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle Kategorien' },
  { value: 'hausrenovierung', label: 'Hausrenovierung' },
  { value: 'variable-kosten-vermietung', label: 'Variable Kosten Vermietung' },
  { value: 'berufsbezogene-ausgaben', label: 'Berufsbezogene Ausgaben' },
  { value: 'selbststaendige-taetigkeit', label: 'Selbstständige Tätigkeit' },
  { value: 'haushaltsfuehrung', label: 'Haushaltsführung' },
  { value: 'sonstige', label: 'Sonstige' },
]

export function ReceiptList({
  receipts,
  onReceiptClick,
  onReceiptDelete,
  searchText,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ReceiptListProps) {
  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Nach Händler suchen..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) => onCategoryChange(value === 'all' ? undefined : (value as ReceiptCategory))}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Kategorie wählen" />
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

      {/* Receipt Grid */}
      {receipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="p-4 rounded-full bg-slate-100 mb-4">
            <FileText className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Keine Belege gefunden</h3>
          <p className="text-sm text-slate-500 max-w-md">
            {searchText || selectedCategory
              ? 'Keine Belege entsprechen den aktuellen Filterkriterien.'
              : 'Laden Sie Ihren ersten Beleg hoch, um zu beginnen.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receipts.map((receipt) => (
            <ReceiptCard
              key={receipt.id}
              receipt={receipt}
              onClick={() => onReceiptClick(receipt)}
              onDelete={onReceiptDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
