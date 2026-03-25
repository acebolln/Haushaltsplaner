# Haushaltsplaner — Project Progress

## 2026-03-24 — Bidirectional Sync, PDF Support, UX Overhaul

### Completed Tasks
- **Bidirectional Google Sync**: App→Sheet push (auto after confirm) + Sheet→App pull (on Übersicht open)
- **Drive Folder Restructure**: Flattened from `Belege/YYYY/Monat/` to `Belege/YYYY/Done/` + `Check/`
- **Yearly Sheets**: One `YYYY-Belege` sheet per year instead of per month
- **PDF Support**: Full PDF upload support (text-embedded + scanned). Claude document type for PDFs.
- **Robust JSON Parsing**: Brace-counting parser for Claude responses (handles malformed JSON)
- **Zod Validation Fix**: Allow negative amounts for Gutschriften/Abschläge
- **Chat UX**: Default to Chat view, removed double headers, empty state with icon
- **Button Lock**: Speichern/Verwerfen disabled after first click with loading spinner
- **Receipt Card Close**: Card becomes non-editable after confirm/reject
- **Message Deduplication**: Consolidated sync messages (1 status instead of 4)
- **Payment Method Default**: Changed from 'card' to 'other' (Claude can't detect payment method)
- **PDF Preview**: FileText icon in chat bubbles for PDF files, truncated filenames
- **Chat Clear Fix**: Correct localStorage key (`receipt-chat-messages`)
- **Drive Cleanup Script**: `/api/google/cleanup` one-time endpoint
- **Drive Init Script**: `/api/google/init` creates folder structure + formatted Sheet
- **LocalStorage Clear Buttons**: "Lokal leeren" + "Drive leeren" in Übersicht

### Changed Files
| File | Change |
|------|--------|
| `types/receipt.ts` | Added `sheetId`, `lastModifiedLocally`, `ReceiptSheetRow` type |
| `lib/google/drive.ts` | Flat folders: `Belege/YYYY/Done/` + `Check/`. Removed month folders, Archiv |
| `lib/google/sheets.ts` | Yearly sheets, `readAllReceipts()`, `updateReceiptRow()`, reverse-mapping |
| `lib/google/sync.ts` | **NEW** — `mergeReceipts()` with last-write-wins conflict resolution |
| `lib/receipts/extraction.ts` | Stricter prompt: no code fences, short descriptions, raw JSON |
| `lib/receipts/validation.ts` | Allow negative quantity/price/amount (Gutschriften) |
| `lib/utils/image.ts` | Added `application/pdf` to valid types |
| `app/api/receipts/sync/route.ts` | GET (pull) + PATCH (update row) endpoints, updated POST |
| `app/api/receipts/analyze/route.ts` | PDF document type, robust JSON parser, better error messages |
| `app/api/google/cleanup/route.ts` | **NEW** — One-time Drive cleanup |
| `app/api/google/init/route.ts` | **NEW** — Create folder structure + formatted Sheet |
| `app/belege/page.tsx` | Chat as default, cleanup/init buttons, correct localStorage keys |
| `hooks/useReceiptSync.ts` | `pullFromSheet()`, `pushUpdate()`, pulling state |
| `hooks/useReceiptChat.ts` | Payment method default → 'other' |
| `components/receipts/ChatInterface.tsx` | Auto-sync, card close on confirm, embedded mode |
| `components/receipts/ChatInput.tsx` | PDF accepted, PDF preview icon, file type message |
| `components/receipts/ChatUpload.tsx` | PDF accepted |
| `components/receipts/ChatMessage.tsx` | PDF card display, Paperclip icon, truncated names |
| `components/receipts/ReceiptChatCard.tsx` | Button lock with spinner after first click |
| `components/receipts/ReceiptManager.tsx` | Removed upload section, pull-on-open, sync status bar |
| `CLAUDE.md` | Updated to Phase 3, full architecture docs |

### Technical Decisions
- **Bidirectional sync via polling** (pull on open) rather than webhooks — simpler, no server needed
- **Last-write-wins** for conflicts — `lastModifiedLocally` vs `syncedAt` timestamp comparison
- **Claude document type** for PDFs — native support, no PDF library needed
- **Brace-counting JSON parser** — regex-based repair was too fragile for long receipts
- **Negative amounts allowed** in Zod — real invoices have Gutschriften and Abschläge
- **Flat folder structure** (`YYYY/Done/`) — user preference over monthly folders

### Current State
- TypeScript: ✅ Clean (0 errors)
- Build: ✅ Compiles
- Budget Planner: ✅ Fully functional
- Receipt Chat: ✅ PDF + image upload, Claude extraction, auto-sync
- Google Sync: ✅ Push (auto), Pull (on open), Update (on edit)
- E2E tested: ✅ PDF upload → extraction → save → Drive sync → Sheet append

### Next Steps
- Deploy to Vercel (configure env vars)
- Test with various receipt types (supermarket, restaurant, online orders)
- Clean up one-time API routes (`/api/google/cleanup`, `/api/google/init`) before production
- Consider: receipt search improvements, batch upload

---

## 2026-03-22 — Receipt Duplicate Saves Fix & UX Improvements ✅

### Summary
Fixed critical duplicate save bugs, implemented monthly folder structure (later replaced by yearly), added save confirmation UX, cloud sync status badges, and various critical bug fixes.
