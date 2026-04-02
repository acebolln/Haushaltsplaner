/**
 * Tests for receipt storage operations
 * Focus: importReceipt preserves IDs, content dedup, tombstones
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveReceipt,
  importReceipt,
  loadReceipts,
  saveReceipts,
  clearAllReceipts,
  deduplicateReceipts,
} from '../receipts'
import type { Receipt } from '@/types/receipt'

// Mock localStorage
const store: Record<string, string> = {}
beforeEach(() => {
  Object.keys(store).forEach((key) => delete store[key])
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
  })
})

function makeReceipt(overrides: Partial<Receipt> = {}): Receipt {
  return {
    id: 'test-id-1',
    merchantName: 'REWE',
    date: '2026-01-15',
    totalAmount: 2500,
    paymentMethod: 'card',
    category: 'haushaltsfuehrung',
    lineItems: [],
    confidence: 'high',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
    ...overrides,
  }
}

describe('saveReceipt', () => {
  it('saves a new receipt to localStorage', () => {
    const receipt = makeReceipt()
    saveReceipt(receipt)
    const loaded = loadReceipts()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe('test-id-1')
  })

  it('updates existing receipt by ID', () => {
    const receipt = makeReceipt()
    saveReceipt(receipt)
    saveReceipt({ ...receipt, merchantName: 'EDEKA' })
    const loaded = loadReceipts()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].merchantName).toBe('EDEKA')
  })
})

describe('importReceipt — Bug #1', () => {
  it('preserves the original ID from a pulled receipt', () => {
    const pulledReceipt = makeReceipt({
      id: 'receipt_1711900000_abc1234',
      sheetRowNumber: 5,
      sheetId: 'spreadsheet-123',
      syncedAt: '2026-01-15T12:00:00Z',
      driveFileId: 'synced_5',
    })

    importReceipt(pulledReceipt)

    const loaded = loadReceipts()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe('receipt_1711900000_abc1234')
    expect(loaded[0].sheetRowNumber).toBe(5)
    expect(loaded[0].sheetId).toBe('spreadsheet-123')
    expect(loaded[0].syncedAt).toBe('2026-01-15T12:00:00Z')
  })

  it('does not create duplicate when importing receipt with same sheetRowNumber', () => {
    const pulled1 = makeReceipt({
      id: 'receipt_1',
      sheetRowNumber: 5,
      sheetId: 'spreadsheet-123',
      syncedAt: '2026-01-15T12:00:00Z',
    })
    importReceipt(pulled1)

    // Second import of same sheet row (e.g., second pull due to stale state)
    const pulled2 = makeReceipt({
      id: 'receipt_2',
      sheetRowNumber: 5,
      sheetId: 'spreadsheet-123',
      syncedAt: '2026-01-15T13:00:00Z',
      merchantName: 'REWE Updated',
    })
    importReceipt(pulled2)

    const loaded = loadReceipts()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].merchantName).toBe('REWE Updated')
    expect(loaded[0].sheetRowNumber).toBe(5)
  })

  it('does not create duplicate when receipt with same content fingerprint exists', () => {
    // Local receipt (created via chat, no sheetRowNumber yet)
    const localReceipt = makeReceipt({
      id: 'local-uuid-1',
      merchantName: 'REWE',
      date: '2026-01-15',
      totalAmount: 2500,
    })
    saveReceipt(localReceipt)

    // Same receipt comes back from Sheet with different ID but same content
    const pulledReceipt = makeReceipt({
      id: 'receipt_from_sheet',
      merchantName: 'REWE',
      date: '2026-01-15',
      totalAmount: 2500,
      sheetRowNumber: 3,
      sheetId: 'spreadsheet-123',
      syncedAt: '2026-01-15T12:00:00Z',
    })
    importReceipt(pulledReceipt)

    const loaded = loadReceipts()
    // Should merge, not duplicate
    expect(loaded).toHaveLength(1)
    // Should update the existing receipt with sync metadata
    expect(loaded[0].id).toBe('local-uuid-1')
    expect(loaded[0].sheetRowNumber).toBe(3)
  })
})

describe('deduplicateReceipts — Bug #3', () => {
  it('removes duplicate receipts with same content fingerprint (date+merchant+amount)', () => {
    // Simulate duplicates that got into localStorage somehow
    const receipt1 = makeReceipt({ id: 'id-1' })
    const receipt2 = makeReceipt({ id: 'id-2' }) // same date+merchant+amount
    saveReceipts([receipt1, receipt2])

    const removed = deduplicateReceipts()
    expect(removed).toBe(1)

    const loaded = loadReceipts()
    expect(loaded).toHaveLength(1)
  })

  it('keeps the receipt with sync metadata when deduplicating', () => {
    const localOnly = makeReceipt({ id: 'local-1' })
    const synced = makeReceipt({
      id: 'synced-1',
      sheetRowNumber: 5,
      syncedAt: '2026-01-15T12:00:00Z',
    })
    saveReceipts([localOnly, synced])

    deduplicateReceipts()

    const loaded = loadReceipts()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].sheetRowNumber).toBe(5)
  })

  it('does not remove receipts with different content', () => {
    const receipt1 = makeReceipt({ id: 'id-1', merchantName: 'REWE' })
    const receipt2 = makeReceipt({ id: 'id-2', merchantName: 'EDEKA' })
    saveReceipts([receipt1, receipt2])

    const removed = deduplicateReceipts()
    expect(removed).toBe(0)

    const loaded = loadReceipts()
    expect(loaded).toHaveLength(2)
  })
})
