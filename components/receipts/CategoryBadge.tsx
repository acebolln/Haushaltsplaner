'use client'

import { ReceiptCategory } from '@/types/receipt'
import { Badge } from '@/components/ui/badge'

interface CategoryBadgeProps {
  category: ReceiptCategory
  taxDeductible?: boolean
}

// Category labels in German
const CATEGORY_LABELS: Record<ReceiptCategory, string> = {
  hausrenovierung: 'Hausrenovierung',
  'variable-kosten-vermietung': 'Variable Kosten Vermietung',
  'berufsbezogene-ausgaben': 'Berufsbezogene Ausgaben',
  'selbststaendige-taetigkeit': 'Selbstständige Tätigkeit',
  haushaltsfuehrung: 'Haushaltsführung',
  sonstige: 'Sonstige',
}

export function CategoryBadge({ category, taxDeductible = false }: CategoryBadgeProps) {
  return (
    <Badge
      variant={taxDeductible ? 'default' : 'secondary'}
      className={
        taxDeductible
          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
          : 'bg-slate-100 text-slate-700 border-slate-200'
      }
    >
      {CATEGORY_LABELS[category]}
    </Badge>
  )
}
