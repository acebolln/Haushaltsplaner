// Receipt Management Types

export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'other'

export type ReceiptCategory =
  | 'hausrenovierung'
  | 'variable-kosten-vermietung'
  | 'berufsbezogene-ausgaben'
  | 'selbststaendige-taetigkeit'
  | 'haushaltsfuehrung'
  | 'sonstige'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface ReceiptLineItem {
  description: string
  quantity: number
  unitPrice: number // in cents
  totalPrice: number // in cents
}

export interface Category {
  id: string
  name: string
  taxDeductible: boolean
}

export interface Receipt {
  id: string
  merchantName: string
  date: string // ISO 8601 format (YYYY-MM-DD)
  totalAmount: number // in cents
  paymentMethod: PaymentMethod
  category: ReceiptCategory
  lineItems: ReceiptLineItem[]
  imageUrl?: string // Base64 data URL (in-memory only, NOT persisted to LocalStorage)
  hasLocalImage?: boolean // true if image is stored in IndexedDB
  notes?: string
  confidence: ConfidenceLevel
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
  // Google Drive sync metadata
  driveFileId?: string // Google Drive file ID
  driveFileUrl?: string // Google Drive web view link
  sheetId?: string // Google Sheets spreadsheet ID
  sheetRowNumber?: number // Row number in yearly Google Sheet
  syncedAt?: string // ISO 8601 timestamp of last sync
  lastModifiedLocally?: string // ISO 8601 timestamp of last local edit
}

// Claude API extraction result
export interface ReceiptExtractionResult {
  merchantName: string
  date: string // ISO 8601 format
  totalAmount: number // in cents
  lineItems: ReceiptLineItem[]
  suggestedCategory: ReceiptCategory
  confidence: ConfidenceLevel
}

// Parsed row from Google Sheets (used for pull-sync)
export interface ReceiptSheetRow {
  rowNumber: number
  date: string // ISO 8601 (YYYY-MM-DD)
  merchantName: string
  totalAmount: number // in cents
  category: ReceiptCategory
  paymentMethod: PaymentMethod
  lineItemsRaw: string // raw "Positionen" string from sheet
  confidence: ConfidenceLevel
  driveLink: string // "Beleg-Link" column
  notes: string
}

// Receipt filter options
export interface ReceiptFilters {
  category?: ReceiptCategory
  searchText?: string
  dateFrom?: string
  dateTo?: string
}
