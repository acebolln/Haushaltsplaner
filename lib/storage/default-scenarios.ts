import { BudgetData } from '@/types/budget'

// Helper to convert euros to cents
const e = (euros: number) => Math.round(euros * 100)

/**
 * Normalzustand scenario from Projektbeschreibung.txt
 * Reserve: -365€ (Critical)
 */
export const NORMALZUSTAND: BudgetData = {
  categories: {
    income: {
      id: 'income',
      name: 'Einnahmen',
      items: [
        { id: '1', name: 'Gehalt Christian', amount: e(5200), frequency: 'monthly' },
        { id: '2', name: 'Gehalt Dajana', amount: e(850), frequency: 'monthly' },
        { id: '3', name: 'Kindergeld', amount: e(255), frequency: 'monthly' },
      ],
    },
    fixed: {
      id: 'fixed',
      name: 'Fixkosten',
      items: [
        { id: '4', name: 'PKV Signal Iduna Aya/Christian', amount: e(950), frequency: 'monthly' },
        { id: '5', name: 'Berufsunfähigkeitsversicherung Christian', amount: e(85), frequency: 'monthly' },
        { id: '6', name: 'KFZ-Versicherung & Steuern', amount: e(1800), frequency: 'yearly' },
        { id: '7', name: 'Private Haftpflicht', amount: e(100), frequency: 'yearly' },
        { id: '8', name: 'Hausratversicherung', amount: e(120), frequency: 'yearly' },
        { id: '9', name: 'Rechtsschutz', amount: e(240), frequency: 'yearly' },
        { id: '10', name: 'Sprit & Wartung/Reparaturen', amount: e(350), frequency: 'monthly' },
      ],
    },
    variable: {
      id: 'variable',
      name: 'Variable Kosten',
      items: [
        { id: '11', name: 'Lebensmittel & Drogerie', amount: e(800), frequency: 'monthly' },
        { id: '12', name: 'Bekleidung', amount: e(100), frequency: 'monthly' },
        { id: '13', name: 'Geschenke & Feiern', amount: e(100), frequency: 'monthly' },
        { id: '14', name: 'Freizeit & Ausgehen', amount: e(150), frequency: 'monthly' },
        { id: '15', name: 'Urlaub/Rücklage', amount: e(0), frequency: 'monthly' },
      ],
    },
    savings: {
      id: 'savings',
      name: 'Sparquote',
      items: [
        { id: '16', name: 'Sparplan Aya Joy', amount: e(100), frequency: 'monthly' },
        { id: '17', name: 'Sparplan Dajana', amount: e(200), frequency: 'monthly' },
        { id: '18', name: 'Sparplan Christian', amount: e(200), frequency: 'monthly' },
      ],
    },
    housing: {
      id: 'housing',
      name: 'Hauskosten',
      items: [
        { id: '19', name: 'Darlehensrate', amount: e(1500), frequency: 'monthly' },
        { id: '20', name: 'Grundsteuer', amount: e(49), frequency: 'monthly' },
        { id: '21', name: 'Gebäudeversicherung', amount: e(88), frequency: 'monthly' },
        { id: '22', name: 'Müll & Abwasser', amount: e(55), frequency: 'monthly' },
        { id: '23', name: 'Energie/Strom+Heizung', amount: e(500), frequency: 'monthly' },
        { id: '24', name: 'Instandhaltungsrücklage', amount: e(500), frequency: 'monthly' },
      ],
    },
  },
}

/**
 * Phase: Hausrenovierung2 scenario from Projektbeschreibung.txt
 * Worst case during renovation phase
 * Reserve: -1.435€ (Critical)
 */
export const HAUSRENOVIERUNG: BudgetData = {
  categories: {
    income: {
      id: 'income',
      name: 'Einnahmen',
      items: [
        { id: '1', name: 'Gehalt Christian', amount: e(5600), frequency: 'monthly' },
        { id: '2', name: 'Gehalt Dajana', amount: e(0), frequency: 'monthly' },
        { id: '3', name: 'Kindergeld', amount: e(255), frequency: 'monthly' },
        { id: '4', name: 'Mieteinnahme', amount: e(480), frequency: 'monthly' },
      ],
    },
    fixed: {
      id: 'fixed',
      name: 'Fixkosten',
      items: [
        { id: '5', name: 'PKV Signal Iduna (inkl. Dajana)', amount: e(1600), frequency: 'monthly' },
        { id: '6', name: 'Berufsunfähigkeitsversicherung Christian', amount: e(85), frequency: 'monthly' },
        { id: '7', name: 'KFZ-Versicherung & Steuern', amount: e(1800), frequency: 'yearly' },
        { id: '8', name: 'Private Haftpflicht', amount: e(100), frequency: 'yearly' },
        { id: '9', name: 'Hausratversicherung', amount: e(120), frequency: 'yearly' },
        { id: '10', name: 'Rechtsschutz', amount: e(240), frequency: 'yearly' },
        { id: '11', name: 'Sprit & Wartung/Reparaturen', amount: e(350), frequency: 'monthly' },
      ],
    },
    variable: {
      id: 'variable',
      name: 'Variable Kosten',
      items: [
        { id: '12', name: 'Lebensmittel & Drogerie', amount: e(1000), frequency: 'monthly' },
        { id: '13', name: 'Bekleidung', amount: e(100), frequency: 'monthly' },
        { id: '14', name: 'Geschenke & Feiern', amount: e(100), frequency: 'monthly' },
        { id: '15', name: 'Freizeit & Ausgehen', amount: e(150), frequency: 'monthly' },
        { id: '16', name: 'Urlaub/Rücklage', amount: e(0), frequency: 'monthly' },
        { id: '17', name: 'Diverse Einkäufe Haus', amount: e(1000), frequency: 'monthly' },
      ],
    },
    savings: {
      id: 'savings',
      name: 'Sparquote',
      items: [
        { id: '18', name: 'Sparplan Aya Joy (pausiert)', amount: e(0), frequency: 'monthly' },
        { id: '19', name: 'Sparplan Dajana (pausiert)', amount: e(0), frequency: 'monthly' },
        { id: '20', name: 'Sparplan Christian (pausiert)', amount: e(0), frequency: 'monthly' },
      ],
    },
    housing: {
      id: 'housing',
      name: 'Hauskosten',
      items: [
        { id: '21', name: 'Darlehensrate', amount: e(1600), frequency: 'monthly' },
        { id: '22', name: 'Grundsteuer', amount: e(49), frequency: 'monthly' },
        { id: '23', name: 'Gebäudeversicherung', amount: e(88), frequency: 'monthly' },
        { id: '24', name: 'Müll & Abwasser', amount: e(55), frequency: 'monthly' },
        { id: '25', name: 'Energie/Strom+Heizung', amount: e(400), frequency: 'monthly' },
        { id: '26', name: 'Instandhaltungsrücklage', amount: e(250), frequency: 'monthly' },
      ],
    },
  },
}

/**
 * Empty template for creating new scenarios
 */
export const EMPTY_BUDGET: BudgetData = {
  categories: {
    income: { id: 'income', name: 'Einnahmen', items: [] },
    fixed: { id: 'fixed', name: 'Fixkosten', items: [] },
    variable: { id: 'variable', name: 'Variable Kosten', items: [] },
    savings: { id: 'savings', name: 'Sparquote', items: [] },
    housing: { id: 'housing', name: 'Hauskosten', items: [] },
  },
}
