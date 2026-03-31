/**
 * Budget Sync Hook
 *
 * Handles bidirectional sync between LocalStorage budgets and Google Sheets:
 * - Push: Debounced push after budget changes (5s delay)
 * - Pull: On app load when LocalStorage is empty and Google is authenticated
 */

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { BudgetData, Scenario } from '@/types/budget'
import { useGoogleAuth } from './useGoogleAuth'

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

interface BudgetSyncResult {
  success: boolean
  error?: string
}

interface PullResult {
  success: boolean
  budgetData: BudgetData | null
  scenarios: Scenario[]
  error?: string
}

export function useBudgetSync() {
  const { isAuthenticated } = useGoogleAuth()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pushInProgress = useRef(false)

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  /**
   * Push budget data + scenarios to Google Sheets (immediate)
   */
  const pushBudget = useCallback(
    async (budgetData: BudgetData, scenarios: Scenario[]): Promise<BudgetSyncResult> => {
      if (!isAuthenticated) {
        return { success: false, error: 'Not authenticated with Google' }
      }

      if (pushInProgress.current) {
        return { success: false, error: 'Sync already in progress' }
      }

      pushInProgress.current = true
      setSyncStatus('syncing')

      try {
        const response = await fetch('/api/budget/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ budgetData, scenarios }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Sync failed')
        }

        setSyncStatus('success')
        setLastSyncedAt(data.syncedAt)

        // Reset status after 3s
        setTimeout(() => setSyncStatus('idle'), 3000)

        return { success: true }
      } catch (error) {
        console.error('Budget sync push error:', error)
        setSyncStatus('error')
        setTimeout(() => setSyncStatus('idle'), 5000)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      } finally {
        pushInProgress.current = false
      }
    },
    [isAuthenticated]
  )

  /**
   * Debounced push — waits 5s after last call before syncing
   */
  const debouncedPush = useCallback(
    (budgetData: BudgetData, scenarios: Scenario[]) => {
      if (!isAuthenticated) return

      if (debounceTimer.current) clearTimeout(debounceTimer.current)

      debounceTimer.current = setTimeout(() => {
        pushBudget(budgetData, scenarios)
      }, 5000)
    },
    [isAuthenticated, pushBudget]
  )

  /**
   * Pull budget data + scenarios from Google Sheets
   */
  const pullBudget = useCallback(async (): Promise<PullResult> => {
    if (!isAuthenticated) {
      return { success: false, budgetData: null, scenarios: [], error: 'Not authenticated' }
    }

    setSyncStatus('syncing')

    try {
      const response = await fetch('/api/budget/sync')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Pull failed')
      }

      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 3000)

      return {
        success: true,
        budgetData: data.budgetData || null,
        scenarios: data.scenarios || [],
      }
    } catch (error) {
      console.error('Budget sync pull error:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 5000)
      return {
        success: false,
        budgetData: null,
        scenarios: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, [isAuthenticated])

  return {
    pushBudget,
    debouncedPush,
    pullBudget,
    syncStatus,
    lastSyncedAt,
    isAuthenticated,
  }
}
