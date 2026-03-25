import { Status } from '@/types/budget'
import { getStatusColor, getStatusLabel } from '@/lib/budget/status-rules'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react'

interface StatusIndicatorProps {
  status: Status
  className?: string
  showIcon?: boolean
}

const STATUS_ICONS = {
  'very-good': CheckCircle,
  'sufficient': AlertCircle,
  'tight': AlertTriangle,
  'critical': XCircle,
} as const

export function StatusIndicator({ status, className, showIcon = true }: StatusIndicatorProps) {
  const colorClass = getStatusColor(status)
  const label = getStatusLabel(status)
  const Icon = STATUS_ICONS[status]

  return (
    <Badge className={`${colorClass} ${className || ''} gap-1`} variant="outline">
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  )
}
