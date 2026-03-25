'use client'

import { useState, useEffect } from 'react'
import { Scenario, BudgetData } from '@/types/budget'
import { loadScenarios, saveScenario, deleteScenario, renameScenario, duplicateScenario } from '@/lib/storage/budgets'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Save, Trash2, FolderOpen, Edit2, Copy, Check, X } from 'lucide-react'
import { formatEuro } from '@/lib/budget/frequency-converter'
import { calculateBudget } from '@/lib/budget/calculations'
import { getStatusColor, getStatusLabel } from '@/lib/budget/status-rules'

interface ScenarioManagerProps {
  currentBudget: BudgetData | null
  onLoadScenario: (data: BudgetData) => void
  onScenarioUpdate?: () => void
}

export function ScenarioManager({ currentBudget, onLoadScenario, onScenarioUpdate }: ScenarioManagerProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [scenarioName, setScenarioName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load scenarios on mount and when dialog opens
  useEffect(() => {
    if (isOpen) {
      setScenarios(loadScenarios())
    }
  }, [isOpen])

  const refreshScenarios = () => {
    setScenarios(loadScenarios())
    onScenarioUpdate?.()
  }

  const handleSave = () => {
    if (currentBudget && scenarioName.trim()) {
      try {
        saveScenario(scenarioName.trim(), currentBudget)
        setScenarioName('')
        setIsSaveDialogOpen(false)
        setError(null)
        refreshScenarios()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
      }
    }
  }

  const handleStartEdit = (scenario: Scenario) => {
    setEditingId(scenario.id)
    setEditingName(scenario.name)
    setError(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
    setError(null)
  }

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      try {
        renameScenario(id, editingName.trim())
        setEditingId(null)
        setEditingName('')
        setError(null)
        refreshScenarios()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Umbenennen')
      }
    }
  }

  const handleDuplicate = (id: string) => {
    try {
      duplicateScenario(id)
      refreshScenarios()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Duplizieren')
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      try {
        deleteScenario(deleteTargetId)
        setDeleteTargetId(null)
        setIsDeleteDialogOpen(false)
        refreshScenarios()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Löschen')
      }
    }
  }

  const handleLoad = (scenario: Scenario) => {
    onLoadScenario(scenario.data)
    setIsOpen(false)
  }

  return (
    <div className="flex gap-2">
      {/* Save Current */}
      <Button variant="outline" size="sm" onClick={() => setIsSaveDialogOpen(true)} className="font-semibold">
        <Save className="h-4 w-4 mr-2" />
        Szenario speichern
      </Button>
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aktuelles Budget als Szenario speichern</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Szenario-Name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!scenarioName.trim()}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Scenario */}
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="font-semibold">
        <FolderOpen className="h-4 w-4 mr-2" />
        Szenario laden
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Gespeicherte Szenarien</DialogTitle>
            <DialogDescription>
              {scenarios.length} {scenarios.length === 1 ? 'Szenario' : 'Szenarien'} gespeichert
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            {scenarios.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-slate-200 rounded-lg">
                <FolderOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">Keine Szenarien gespeichert</p>
                <p className="text-sm mt-1">Speichere dein erstes Szenario, um es später wieder laden zu können</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                {scenarios.map((scenario) => {
                  const calc = calculateBudget(scenario.data)
                  const statusColor = getStatusColor(calc.status)
                  const statusLabel = getStatusLabel(calc.status)
                  const isEditing = editingId === scenario.id

                  return (
                    <Card key={scenario.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Name - Inline Edit */}
                            {isEditing ? (
                              <div className="flex items-center gap-2 mb-2">
                                <Input
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit(scenario.id)
                                    if (e.key === 'Escape') handleCancelEdit()
                                  }}
                                  className="h-8"
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleSaveEdit(scenario.id)}
                                >
                                  <Check className="h-4 w-4 text-emerald-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-4 w-4 text-slate-500" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg truncate">{scenario.name}</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-50 hover:opacity-100"
                                  onClick={() => handleStartEdit(scenario)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="font-medium">Einnahmen: <span className="text-emerald-600">{formatEuro(calc.totalIncome)}</span></span>
                              <span className="font-medium">Reserve: <span className={calc.reserve > 0 ? 'text-emerald-600' : 'text-red-500'}>{formatEuro(calc.reserve)}</span></span>
                              <span className={`font-semibold ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </div>

                            {/* Date */}
                            <div className="text-xs text-muted-foreground mt-1.5">
                              Erstellt: {new Date(scenario.createdAt).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleLoad(scenario)}
                              className="font-semibold"
                            >
                              Laden
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDuplicate(scenario.id)}
                              title="Duplizieren"
                            >
                              <Copy className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(scenario.id)}
                              title="Löschen"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Szenario löschen?</DialogTitle>
            <DialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Das Szenario wird permanent gelöscht.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
