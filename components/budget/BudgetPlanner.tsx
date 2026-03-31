'use client'

import { useState, useEffect } from 'react'
import { BudgetData, ChartData, BudgetItem, Scenario } from '@/types/budget'
import { useBudgetCalculator } from '@/hooks/useBudgetCalculator'
import { CategorySection } from './CategorySection'
import { DonutChart } from './DonutChart'
import { StickyBottomBar } from './StickyBottomBar'
import { ScenarioManager } from './ScenarioManager'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  loadCurrentBudget,
  saveCurrentBudget,
  loadScenarios,
  saveScenario,
  initializeDefaultScenarios,
  deleteScenario
} from '@/lib/storage/budgets'
import { NORMALZUSTAND } from '@/lib/storage/default-scenarios'
import { formatEuro } from '@/lib/budget/frequency-converter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import { useBudgetSync } from '@/hooks/useBudgetSync'

/**
 * Haushaltsplaner - Main Component
 * Redesigned with Refined Minimalism aesthetic
 * White Mode Primary | Pink Accent | Asymmetric Layout
 */
export function BudgetPlanner() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null)
  const calculations = useBudgetCalculator(budgetData)
  const { debouncedPush, pullBudget, syncStatus, isAuthenticated: isGoogleAuth } = useBudgetSync()

  // Initialize default scenarios on first load
  useEffect(() => {
    initializeDefaultScenarios()
    loadScenariosData()
  }, [])

  // Load budget on mount — try LocalStorage first, then Google Sheets
  useEffect(() => {
    const loaded = loadCurrentBudget()
    if (loaded) {
      setBudgetData(loaded)
      const scenarios = loadScenarios()
      const match = scenarios.find(
        (s) => JSON.stringify(s.data) === JSON.stringify(loaded)
      )
      if (match) setCurrentScenarioId(match.id)
    } else {
      // Try pulling from Google Sheets (recovery)
      pullBudget().then((result) => {
        if (result.success && result.budgetData) {
          setBudgetData(result.budgetData)
          saveCurrentBudget(result.budgetData)
          if (result.scenarios.length > 0) {
            for (const s of result.scenarios) {
              saveScenario(s.name, s.data)
            }
            loadScenariosData()
            setCurrentScenarioId(result.scenarios[0].id)
          }
          return
        }

        // Fallback: load from scenarios
        const allScenarios = loadScenarios()
        if (allScenarios.length > 0) {
          setBudgetData(allScenarios[0].data)
          saveCurrentBudget(allScenarios[0].data)
          setCurrentScenarioId(allScenarios[0].id)
        } else {
          setBudgetData(NORMALZUSTAND)
          saveCurrentBudget(NORMALZUSTAND)
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadScenariosData = () => {
    setScenarios(loadScenarios())
  }

  // Save budget locally and trigger debounced cloud sync
  const saveBudget = (data: BudgetData) => {
    saveCurrentBudget(data)
    debouncedPush(data, loadScenarios())
  }

  // Load scenario by ID
  const loadScenarioById = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (scenario) {
      setBudgetData(scenario.data)
      saveBudget(scenario.data)
      setCurrentScenarioId(scenarioId)
    }
  }

  // Handle scenario change from dropdown
  const handleScenarioChange = (scenarioId: string | null) => {
    if (!scenarioId) return
    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (scenario) {
      setBudgetData(scenario.data)
      saveBudget(scenario.data)
      setCurrentScenarioId(scenarioId)
    }
  }

  // Delete current scenario
  const handleDeleteCurrentScenario = () => {
    if (!currentScenarioId) return

    if (confirm('Aktuelles Szenario löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      deleteScenario(currentScenarioId)
      loadScenariosData()

      // Load first available scenario
      const remainingScenarios = loadScenarios()
      if (remainingScenarios.length > 0) {
        handleScenarioChange(remainingScenarios[0].id)
      } else {
        // No scenarios left, load default
        setBudgetData(NORMALZUSTAND)
        saveBudget(NORMALZUSTAND)
        setCurrentScenarioId(null)
      }
    }
  }

  // Refresh scenarios after save/load
  const handleScenarioUpdate = () => {
    loadScenariosData()
  }

  // Load scenario from data (used by ScenarioManager)
  const handleLoadScenario = (data: BudgetData) => {
    setBudgetData(data)
    saveBudget(data)
    // Try to find matching scenario ID
    const match = scenarios.find(
      (s) => JSON.stringify(s.data) === JSON.stringify(data)
    )
    if (match) setCurrentScenarioId(match.id)
    else setCurrentScenarioId(null)
  }

  // Add new item to category
  const handleAddItem = (categoryId: string, item: Omit<BudgetItem, 'id'>) => {
    if (!budgetData) return

    const newItem: BudgetItem = {
      ...item,
      id: crypto.randomUUID(),
    }

    const updatedData = {
      ...budgetData,
      categories: {
        ...budgetData.categories,
        [categoryId]: {
          ...budgetData.categories[categoryId as keyof typeof budgetData.categories],
          items: [
            ...budgetData.categories[categoryId as keyof typeof budgetData.categories].items,
            newItem,
          ],
        },
      },
    }

    setBudgetData(updatedData)
    saveBudget(updatedData)
  }

  // Edit existing item
  const handleEditItem = (categoryId: string, itemId: string, updates: Partial<BudgetItem>) => {
    if (!budgetData) return

    const category = budgetData.categories[categoryId as keyof typeof budgetData.categories]
    const updatedItems = category.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    )

    const updatedData = {
      ...budgetData,
      categories: {
        ...budgetData.categories,
        [categoryId]: {
          ...category,
          items: updatedItems,
        },
      },
    }

    setBudgetData(updatedData)
    saveBudget(updatedData)
  }

  // Delete item
  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (!budgetData) return

    const category = budgetData.categories[categoryId as keyof typeof budgetData.categories]
    const updatedItems = category.items.filter((item) => item.id !== itemId)

    const updatedData = {
      ...budgetData,
      categories: {
        ...budgetData.categories,
        [categoryId]: {
          ...category,
          items: updatedItems,
        },
      },
    }

    setBudgetData(updatedData)
    saveBudget(updatedData)
  }

  // Prepare chart data - Modern semantic colors
  const chartData: ChartData[] | null = calculations
    ? [
        {
          name: 'Fixkosten',
          value: calculations.totalFixed,
          color: '#64748b', // Slate-500
          percentage: (calculations.totalFixed / (calculations.totalExpenses + calculations.totalHousing)) * 100,
        },
        {
          name: 'Variable',
          value: calculations.totalVariable,
          color: '#3b82f6', // Blue-500
          percentage: (calculations.totalVariable / (calculations.totalExpenses + calculations.totalHousing)) * 100,
        },
        {
          name: 'Sparen',
          value: calculations.totalSavings,
          color: '#f97316', // Orange-500
          percentage: (calculations.totalSavings / (calculations.totalExpenses + calculations.totalHousing)) * 100,
        },
        {
          name: 'Hauskosten',
          value: calculations.totalHousing,
          color: '#6366f1', // Indigo-500
          percentage: (calculations.totalHousing / (calculations.totalExpenses + calculations.totalHousing)) * 100,
        },
      ]
    : null

  if (!budgetData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-light">Lade Budget...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Scenario Controls Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-end gap-2">
            {/* Dropdown Scenario Selector */}
            <Select value={currentScenarioId || undefined} onValueChange={handleScenarioChange}>
              <SelectTrigger className="w-full sm:w-[240px] font-semibold">
                <SelectValue placeholder="Szenario wählen..." />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Delete Current Scenario */}
            {currentScenarioId && scenarios.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteCurrentScenario}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                title="Aktuelles Szenario löschen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            {/* Save/Load */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-300">
              <ScenarioManager
                onScenarioUpdate={handleScenarioUpdate}
                currentBudget={budgetData}
                onLoadScenario={handleLoadScenario}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Chart + Quick Stats */}
      <section className="container mx-auto px-6 py-8 lg:py-12">
        {/* Section Label */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-semibold">Übersicht</span>
          <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 mt-2">Budget-Status</h1>
        </div>

        {/* Chart */}
        {chartData && calculations && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <DonutChart data={chartData} centerValue={calculations.reserve} />
          </div>
        )}

        {/* Quick Stats - 4 Cards */}
        {calculations && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Einnahmen */}
            <div className="group relative bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Einnahmen
                </span>
                <div className="p-2 rounded-full bg-emerald-50">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <span className="text-3xl font-semibold tabular-nums text-emerald-600 block">
                {formatEuro(calculations.totalIncome)}
              </span>
            </div>

            {/* Ausgaben */}
            <div className="group relative bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Ausgaben
                </span>
                <div className="p-2 rounded-full bg-slate-50">
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <span className="text-3xl font-semibold tabular-nums text-slate-700 block">
                {formatEuro(calculations.totalExpenses)}
              </span>
            </div>

            {/* Hauskosten */}
            <div className="group relative bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Hauskosten
                </span>
                <div className="p-2 rounded-full bg-indigo-50">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <span className="text-3xl font-semibold tabular-nums text-indigo-600 block">
                {formatEuro(calculations.totalHousing)}
              </span>
            </div>

            {/* Reserve + Status */}
            <div className="group relative bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Reserve
                </span>
                <div className="p-2 rounded-full bg-orange-50">
                  <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
              </div>
              <span
                className="text-3xl font-semibold tabular-nums block mb-2"
                style={{
                  color: calculations.reserve > 0 ? '#10b981' : '#ef4444',
                }}
              >
                {formatEuro(calculations.reserve)}
              </span>
              <StatusBadge value={calculations.reserve} status={calculations.status} />
            </div>
          </div>
        )}
      </section>

      {/* Budget Categories */}
      <section className="container mx-auto px-6 py-8 pb-32">
        <div className="mb-6">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-semibold">Details</span>
          <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 mt-2">Kategorien</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategorySection
            category={budgetData.categories.income}
            total={calculations?.totalIncome || 0}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
          <CategorySection
            category={budgetData.categories.fixed}
            total={calculations?.totalFixed || 0}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
          <CategorySection
            category={budgetData.categories.variable}
            total={calculations?.totalVariable || 0}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
          <CategorySection
            category={budgetData.categories.savings}
            total={calculations?.totalSavings || 0}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
          <div className="lg:col-span-2">
            <CategorySection
              category={budgetData.categories.housing}
              total={calculations?.totalHousing || 0}
              showSubtotals={calculations?.housingSubtotals}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar calculations={calculations} syncStatus={syncStatus} isGoogleAuth={isGoogleAuth} />
    </div>
  )
}
