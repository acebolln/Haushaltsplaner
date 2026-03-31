'use client'

import { BudgetCalculations } from '@/types/budget'
import { formatEuro } from '@/lib/budget/frequency-converter'
import { StatusIndicator } from './StatusIndicator'
import { TrendingUp, TrendingDown, Home, Wallet, Cloud, CloudOff, Loader2, Check } from 'lucide-react'

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

interface StickyBottomBarProps {
  calculations: BudgetCalculations | null
  syncStatus?: SyncStatus
  isGoogleAuth?: boolean
}

export function StickyBottomBar({ calculations, syncStatus, isGoogleAuth }: StickyBottomBarProps) {
  if (!calculations) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Einnahmen */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
            <div className="p-2 rounded-full bg-emerald-100">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                Einnahmen
              </div>
              <div className="text-lg font-semibold text-emerald-600 tabular-nums truncate">
                {formatEuro(calculations.totalIncome)}
              </div>
            </div>
          </div>

          {/* Ausgaben */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
            <div className="p-2 rounded-full bg-slate-200">
              <TrendingDown className="h-5 w-5 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                Ausgaben
              </div>
              <div className="text-lg font-semibold text-slate-700 tabular-nums truncate">
                {formatEuro(calculations.totalExpenses)}
              </div>
            </div>
          </div>

          {/* Hauskosten */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
            <div className="p-2 rounded-full bg-indigo-100">
              <Home className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                Hauskosten
              </div>
              <div className="text-lg font-semibold text-indigo-600 tabular-nums truncate">
                {formatEuro(calculations.totalHousing)}
              </div>
            </div>
          </div>

          {/* Reserve */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
            <div className="p-2 rounded-full bg-orange-100">
              <Wallet className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                Reserve
              </div>
              <div className="flex items-center gap-2">
                <div className={`text-lg font-semibold tabular-nums truncate ${calculations.reserve > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatEuro(calculations.reserve)}
                </div>
                <StatusIndicator status={calculations.status} />
              </div>
            </div>
          </div>

          {/* Sync Status Indicator */}
          {isGoogleAuth && syncStatus && (
            <div className="flex items-center justify-end mt-2 md:mt-0 md:absolute md:right-6 md:top-2">
              {syncStatus === 'syncing' && (
                <div className="flex items-center gap-1 text-xs text-blue-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Synchronisiere...</span>
                </div>
              )}
              {syncStatus === 'success' && (
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <Check className="h-3 w-3" />
                  <span>Gespeichert</span>
                </div>
              )}
              {syncStatus === 'error' && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <CloudOff className="h-3 w-3" />
                  <span>Sync-Fehler</span>
                </div>
              )}
              {syncStatus === 'idle' && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Cloud className="h-3 w-3" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
