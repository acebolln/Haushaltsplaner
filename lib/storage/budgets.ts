import { BudgetData, Scenario } from '@/types/budget'
import { NORMALZUSTAND, HAUSRENOVIERUNG } from './default-scenarios'

const STORAGE_KEYS = {
  CURRENT_BUDGET: 'haushaltsplaner_current_budget',
  SCENARIOS: 'haushaltsplaner_scenarios',
  INITIALIZED: 'haushaltsplaner_initialized',
} as const

/**
 * Saves the current budget data to localStorage
 */
export function saveCurrentBudget(data: BudgetData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_BUDGET, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save budget:', error)
    throw new Error('LocalStorage voll oder nicht verfügbar')
  }
}

/**
 * Loads the current budget data from localStorage
 */
export function loadCurrentBudget(): BudgetData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_BUDGET)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load budget:', error)
    return null
  }
}

/**
 * Saves a scenario to localStorage
 */
export function saveScenario(name: string, data: BudgetData): void {
  try {
    const scenarios = loadScenarios()
    const existingIndex = scenarios.findIndex((s) => s.name === name)

    const scenario: Scenario = {
      id: existingIndex >= 0 ? scenarios[existingIndex].id : crypto.randomUUID(),
      name,
      data,
      createdAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      scenarios[existingIndex] = scenario
    } else {
      scenarios.push(scenario)
    }

    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios))
  } catch (error) {
    console.error('Failed to save scenario:', error)
    throw new Error('LocalStorage voll oder nicht verfügbar')
  }
}

/**
 * Loads all scenarios from localStorage
 */
export function loadScenarios(): Scenario[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCENARIOS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load scenarios:', error)
    return []
  }
}

/**
 * Loads a specific scenario by ID
 */
export function loadScenario(id: string): Scenario | null {
  const scenarios = loadScenarios()
  return scenarios.find((s) => s.id === id) || null
}

/**
 * Renames a scenario by ID
 */
export function renameScenario(id: string, newName: string): void {
  try {
    const scenarios = loadScenarios()
    const scenario = scenarios.find((s) => s.id === id)

    if (!scenario) {
      throw new Error('Szenario nicht gefunden')
    }

    // Check if name already exists (excluding current scenario)
    const nameExists = scenarios.some((s) => s.id !== id && s.name === newName)
    if (nameExists) {
      throw new Error('Ein Szenario mit diesem Namen existiert bereits')
    }

    scenario.name = newName
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios))
  } catch (error) {
    console.error('Failed to rename scenario:', error)
    throw error
  }
}

/**
 * Duplicates a scenario by ID with new name
 */
export function duplicateScenario(id: string, newName?: string): void {
  try {
    const scenarios = loadScenarios()
    const scenario = scenarios.find((s) => s.id === id)

    if (!scenario) {
      throw new Error('Szenario nicht gefunden')
    }

    const duplicatedName = newName || `${scenario.name} (Kopie)`

    const newScenario: Scenario = {
      id: crypto.randomUUID(),
      name: duplicatedName,
      data: JSON.parse(JSON.stringify(scenario.data)), // Deep clone
      createdAt: new Date().toISOString(),
    }

    scenarios.push(newScenario)
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios))
  } catch (error) {
    console.error('Failed to duplicate scenario:', error)
    throw new Error('Szenario konnte nicht dupliziert werden')
  }
}

/**
 * Deletes a scenario by ID
 */
export function deleteScenario(id: string): void {
  try {
    const scenarios = loadScenarios()
    const filtered = scenarios.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete scenario:', error)
    throw new Error('Szenario konnte nicht gelöscht werden')
  }
}

/**
 * Initializes default scenarios on first app start
 */
export function initializeDefaultScenarios(): void {
  try {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)

    if (!initialized) {
      // Save default scenarios
      const scenarios: Scenario[] = [
        {
          id: 'normalzustand',
          name: 'Normalzustand',
          data: NORMALZUSTAND,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'hausrenovierung',
          name: 'Hausrenovierung',
          data: HAUSRENOVIERUNG,
          createdAt: new Date().toISOString(),
        },
      ]

      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios))
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
    }
  } catch (error) {
    console.error('Failed to initialize default scenarios:', error)
  }
}

/**
 * Gets the name of the currently loaded scenario (if it matches a saved one)
 */
export function getCurrentScenarioName(currentData: BudgetData): string | null {
  const scenarios = loadScenarios()

  // Find scenario that matches current data
  const matchingScenario = scenarios.find(
    (scenario) => JSON.stringify(scenario.data) === JSON.stringify(currentData)
  )

  return matchingScenario ? matchingScenario.name : null
}

/**
 * Clears all budget data from localStorage
 */
export function clearAllBudgetData(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_BUDGET)
  localStorage.removeItem(STORAGE_KEYS.SCENARIOS)
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED)
}
