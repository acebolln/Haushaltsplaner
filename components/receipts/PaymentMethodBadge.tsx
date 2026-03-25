'use client'

import { PaymentMethod } from '@/types/receipt'
import { Badge } from '@/components/ui/badge'
import { Banknote, CreditCard, ArrowRightLeft } from 'lucide-react'

interface PaymentMethodBadgeProps {
  paymentMethod: PaymentMethod
}

// Payment method labels in German
const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Bar',
  card: 'Karte',
  'bank-transfer': 'Überweisung',
  other: 'Sonstige',
}

// Icons for payment methods
const PAYMENT_METHOD_ICONS: Record<PaymentMethod, React.ReactNode> = {
  cash: <Banknote className="h-3 w-3" />,
  card: <CreditCard className="h-3 w-3" />,
  'bank-transfer': <ArrowRightLeft className="h-3 w-3" />,
  other: null,
}

export function PaymentMethodBadge({ paymentMethod }: PaymentMethodBadgeProps) {
  const isCash = paymentMethod === 'cash'

  return (
    <Badge
      variant={isCash ? 'destructive' : 'outline'}
      className={
        isCash
          ? 'bg-orange-100 text-orange-700 border-orange-200'
          : 'bg-slate-50 text-slate-700 border-slate-200'
      }
    >
      {PAYMENT_METHOD_ICONS[paymentMethod]}
      {PAYMENT_METHOD_LABELS[paymentMethod]}
    </Badge>
  )
}
