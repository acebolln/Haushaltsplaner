/**
 * Tests for SyncStatusBadge
 * Bug #2: Badge shows "Nur lokal" for receipts that ARE synced (have sheetRowNumber)
 * but don't have driveFileId (metadata-only sync).
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SyncStatusBadge } from '../SyncStatusBadge'
import type { Receipt } from '@/types/receipt'

function makeReceipt(overrides: Partial<Receipt> = {}): Receipt {
  return {
    id: 'test-id',
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

describe('SyncStatusBadge', () => {
  it('shows "Synchronisiert" when receipt has driveFileId and syncedAt', () => {
    const receipt = makeReceipt({
      driveFileId: 'drive-file-123',
      syncedAt: '2026-01-15T12:00:00Z',
    })
    render(<SyncStatusBadge receipt={receipt} />)
    expect(screen.getByText(/Synchronisiert/)).toBeDefined()
  })

  it('shows "Nur lokal" when receipt has no sync metadata', () => {
    const receipt = makeReceipt()
    render(<SyncStatusBadge receipt={receipt} />)
    expect(screen.getByText(/Nur lokal/)).toBeDefined()
  })

  it('shows "Synchronisiert" when receipt has sheetRowNumber but NO driveFileId (metadata-only sync)', () => {
    // This is Bug #2: metadata-only synced receipts have sheetRowNumber + syncedAt
    // but no driveFileId (no image was uploaded to Drive)
    const receipt = makeReceipt({
      sheetRowNumber: 5,
      sheetId: 'spreadsheet-123',
      syncedAt: '2026-01-15T12:00:00Z',
      // driveFileId is undefined — no image uploaded
    })
    render(<SyncStatusBadge receipt={receipt} />)
    // Should show synced, not "Nur lokal"
    expect(screen.getByText(/Synchronisiert/)).toBeDefined()
  })

  it('shows "Wird synchronisiert..." when isSyncing is true', () => {
    const receipt = makeReceipt()
    render(<SyncStatusBadge receipt={receipt} isSyncing={true} />)
    expect(screen.getByText(/Wird synchronisiert/)).toBeDefined()
  })
})
