'use client'

import { Receipt, ConfidenceLevel } from '@/types/receipt'
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from './CategoryBadge'
import { PaymentMethodBadge } from './PaymentMethodBadge'
import { SyncStatusBadge } from './SyncStatusBadge'
import { Trash2 } from 'lucide-react'
import { formatEuro } from '@/lib/budget/frequency-converter'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface ReceiptCardProps {
  receipt: Receipt
  onClick: () => void
  onDelete: (id: string) => void
}

// Confidence badge colors
const CONFIDENCE_COLORS: Record<ConfidenceLevel, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  low: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
}

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: 'Hoch',
  medium: 'Mittel',
  low: 'Niedrig',
}

export function ReceiptCard({ receipt, onClick, onDelete }: ReceiptCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Beleg von "${receipt.merchantName}" wirklich löschen?`)) {
      onDelete(receipt.id)
    }
  }

  const confidenceStyle = CONFIDENCE_COLORS[receipt.confidence]
  const isTaxDeductible = ['hausrenovierung', 'variable-kosten-vermietung', 'berufsbezogene-ausgaben', 'selbststaendige-taetigkeit'].includes(receipt.category)

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">
          {receipt.merchantName}
        </CardTitle>
        <CardAction>
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Amount & Date */}
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold text-slate-900 tabular-nums">
            {formatEuro(receipt.totalAmount)}
          </span>
          <span className="text-sm text-slate-500">
            {format(new Date(receipt.date), 'dd.MM.yyyy', { locale: de })}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={receipt.category} taxDeductible={isTaxDeductible} />
          <PaymentMethodBadge paymentMethod={receipt.paymentMethod} />
          <Badge
            variant="outline"
            className={`${confidenceStyle.bg} ${confidenceStyle.text} ${confidenceStyle.border}`}
          >
            {CONFIDENCE_LABELS[receipt.confidence]}
          </Badge>
          <SyncStatusBadge receipt={receipt} size="md" />
        </div>
      </CardContent>
    </Card>
  )
}
