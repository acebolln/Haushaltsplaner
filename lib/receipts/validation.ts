import { z } from 'zod'

/**
 * Zod schema for receipt line items
 */
const receiptLineItemSchema = z.object({
  description: z.string().min(1, 'Beschreibung erforderlich'),
  quantity: z.number(),
  unitPrice: z.number().int('Preis muss in Cents sein'),
  totalPrice: z.number().int('Preis muss in Cents sein'),
})

/**
 * Zod schema for Claude API extraction result
 */
export const receiptExtractionSchema = z.object({
  merchantName: z.string().min(1, 'Händlername erforderlich'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein'),
  totalAmount: z.number().int('Betrag muss in Cents sein'),
  lineItems: z.array(receiptLineItemSchema).default([]),
  suggestedCategory: z.enum([
    'hausrenovierung',
    'variable-kosten-vermietung',
    'berufsbezogene-ausgaben',
    'selbststaendige-taetigkeit',
    'haushaltsfuehrung',
    'sonstige',
  ]),
  confidence: z.enum(['high', 'medium', 'low']),
})

/**
 * Zod schema for complete receipt object
 */
export const receiptSchema = z.object({
  id: z.string().uuid('ID muss eine gültige UUID sein'),
  merchantName: z.string().min(1, 'Händlername erforderlich'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein'),
  totalAmount: z.number().int('Betrag muss in Cents sein').nonnegative('Betrag darf nicht negativ sein'),
  paymentMethod: z.enum(['cash', 'card', 'bank-transfer', 'other']),
  category: z.enum([
    'hausrenovierung',
    'variable-kosten-vermietung',
    'berufsbezogene-ausgaben',
    'selbststaendige-taetigkeit',
    'haushaltsfuehrung',
    'sonstige',
  ]),
  lineItems: z.array(receiptLineItemSchema).default([]),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low']),
  createdAt: z.string().datetime('CreatedAt muss ein gültiger ISO 8601 Zeitstempel sein'),
  updatedAt: z.string().datetime('UpdatedAt muss ein gültiger ISO 8601 Zeitstempel sein'),
})

/**
 * Type exports from Zod schemas
 */
export type ReceiptExtractionSchemaType = z.infer<typeof receiptExtractionSchema>
export type ReceiptSchemaType = z.infer<typeof receiptSchema>
