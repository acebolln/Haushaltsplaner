# Haushaltsplaner — Project Progress

## 2026-03-31 — Budget Sync, Receipt Sync Fixes, Duplicate Bug Discovery

### Completed Tasks
- **Budget Sync to Google Sheets**: New `Trautes Heim/Budget/Haushaltsplan` Sheet with "Aktuell" (human-readable) + "Szenarien" (JSON backup) tabs. Debounced push (5s) after every budget change, pull recovery on empty LocalStorage. Sync status indicator in StickyBottomBar.
- **Default Landing Page**: Changed from `/` (Budget) to `/belege`. Budget moved to `/budget` route.
- **OAuth Redirect Fix**: All OAuth callbacks now redirect to `/belege` instead of nonexistent `/dashboard`.
- **Budget Loading Bug Fix**: `loadScenarioById` used stale `scenarios` state on first render → infinite "Lade Budget..." screen.
- **Tab Reorder**: Belege tab now first, Budget second in navigation.
- **Dead Dependencies Removed**: `@vercel/postgres`, `@vercel/blob` from package.json; `MONGODB_URI` from .env.local (all unused).
- **Receipt Sheet Extended**: +3 columns (Hochgeladen, Letzte Änderung, Änderungshistorie) with change tracking on edits.
- **Image Compression**: Client-side compression (max 1.5MB/2048px JPEG) before sync to fit Vercel's 4.5MB body limit.
- **Receipt Delete Sync**: Deleting a receipt now also removes Sheet row + Drive file.
- **Tombstone Mechanism**: Deleted receipt fingerprints stored in LocalStorage to prevent pull-sync from re-adding them.
- **Sync Metadata Persistence**: ChatInterface now saves driveFileId/sheetRowNumber/syncedAt back to LocalStorage after successful sync.
- **Auto-Sync Unsynced Receipts**: On Google connect, all local-only receipts are automatically synced (batch, including metadata-only for lost images).
- **Periodic Pull**: Every 5 minutes when Google connected.
- **pushUpdate Error Handling**: Sync errors shown as banner in receipt overview.
- **lastModifiedLocally on Creation**: Set during confirmReceipt for conflict detection.
- **Non-JSON Response Handling**: Graceful error message when Vercel returns HTML instead of JSON.

### Changed Files
| File | Change |
|------|--------|
| `app/page.tsx` | Redirect to `/belege` instead of rendering BudgetPlanner |
| `app/budget/page.tsx` | **NEW** — Budget route |
| `app/api/budget/sync/route.ts` | **NEW** — POST (push) + GET (pull) budget sync |
| `app/api/google/auth/route.ts` | OAuth redirect `/dashboard` → `/belege` |
| `app/api/receipts/sync/route.ts` | +DELETE endpoint, +metadataOnly sync, +maxDuration 60s |
| `lib/google/budget-sheets.ts` | **NEW** — Budget Sheet CRUD (Aktuell + Szenarien tabs) |
| `lib/google/sheets.ts` | +3 columns, +deleteReceiptRow, +change tracking in updateReceiptRow |
| `lib/google/sync.ts` | +tombstone check, +needsMetadataUpdate, +driveFileId for pulled receipts |
| `lib/storage/receipts.ts` | +tombstone mechanism (addTombstone, loadTombstones, isTombstoned) |
| `lib/utils/compress-image.ts` | **NEW** — Client-side image compression |
| `hooks/useBudgetSync.ts` | **NEW** — Debounced push, pull recovery |
| `hooks/useReceiptChat.ts` | +lastModifiedLocally + uploadedAt on confirmReceipt |
| `hooks/useReceiptSync.ts` | +non-JSON response handling |
| `components/budget/BudgetPlanner.tsx` | +useBudgetSync integration, saveBudget helper |
| `components/budget/StickyBottomBar.tsx` | +sync status indicator (Cloud/Loader/Check/Error) |
| `components/layout/Navigation.tsx` | Tabs reordered + Budget href → /budget |
| `components/receipts/ChatInterface.tsx` | +sync metadata persistence, +image compression |
| `components/receipts/ReceiptManager.tsx` | +auto-sync unsynced, +periodic pull, +delete sync, +error banner |
| `components/receipts/RetrySyncButton.tsx` | +metadata-only sync, +image compression |
| `types/receipt.ts` | +uploadedAt on Receipt, +uploadedAt/lastModified/changeHistory on ReceiptSheetRow |
| `package.json` | Removed @vercel/postgres, @vercel/blob |
| `.env.local` | Removed MONGODB_URI |
| `CLAUDE.md` | Updated architecture docs |

### Technical Decisions
- **Google Sheets as database** (no MongoDB): Receipts + Budgets synced to Sheets. MongoDB was never used (leftover from AI Assessment project). Sheets is browsable, free, already integrated.
- **Budget Sheet structure**: Single "Haushaltsplan" sheet with 2 tabs instead of yearly sheets. Budget data changes rarely vs receipts.
- **Tombstones for delete tracking**: Fingerprint-based (date+merchant+amount) stored in LocalStorage. Prevents pull-sync zombie receipts.
- **Image compression before sync**: Canvas-based JPEG compression to fit Vercel's 4.5MB serverless body limit. Mobile photos (3-8MB) were too large.
- **Metadata-only sync**: Receipts with lost images can still sync extracted data to Sheet (empty Drive link).

### Current State
- TypeScript: ✅ Clean (0 errors)
- Build: ✅ Compiles (Next.js 16.1.6, all routes including /api/budget/sync, /budget)
- Vercel: ✅ Deployed at `haushaltsplaner-beta.vercel.app`
- Budget Planner: ✅ Loads, syncs to Google Sheets
- Receipt Analysis: ✅ Claude API extraction works (images + PDFs)
- Receipt Upload + Sync: ✅ Works for new receipts with image compression
- Receipt Delete Sync: ✅ Removes from Sheet + Drive
- Google Auth: ✅ Redirect to /belege works
- **Receipt Pull-Sync: 🔴 BUG — Duplicate receipts on pull + "Nur lokal" badges for synced receipts**

### Next Steps
**CRITICAL — Plan ready in `.claude/plans/bubbly-booping-shore.md`:**
1. **Fix Bug #1**: `addReceipt()` regenerates IDs for pulled receipts → add `importReceipt()` that preserves IDs
2. **Fix Bug #2**: `SyncStatusBadge` checks `driveFileId` instead of `sheetRowNumber` → fix condition
3. **Fix Bug #3**: No content-based dedup in `saveReceipt()` → add fingerprint check + `deduplicateReceipts()` cleanup
4. Files to change: `hooks/useReceiptManager.ts`, `components/receipts/ReceiptManager.tsx`, `components/receipts/SyncStatusBadge.tsx`, `hooks/useReceiptSync.ts`, `lib/storage/receipts.ts`
5. After fix: deploy + verify no more duplicates

### Open Questions
- User is cleaning up duplicate rows in Google Sheet manually (Altbestände)
- After the 3-bug fix: full E2E test needed (create, edit, delete, pull, push)

---

## 2026-03-29 — Vercel Deployment & Receipt Storage Overhaul

### Completed Tasks
- **Vercel Deployment Fixed**: Framework Preset was "Other" → changed to "Next.js" (root cause of 404)
- **Environment Variables**: Set up all env vars for Production + Pre-Production, fixed GOOGLE_CLIENT_SECRET copy-paste error (had GOOGLE_REDIRECT_URI text appended)
- **Google Cloud Console**: Verified redirect URIs for localhost + production + preview
- **Google Auth Button**: Moved from list-view-only to always visible (both Chat and Übersicht views)
- **IndexedDB Image Storage**: Moved receipt images from LocalStorage (5 MB limit) to IndexedDB (unlimited). Multi-page PDFs as Base64 were exceeding LocalStorage quota → QuotaExceededError on save.
- **Duplicate Sync Fix**: Removed sync logic from `useReceiptChat.confirmReceipt()` — sync now only happens in `ChatInterface.handleConfirm()` (single source of truth)
- **Stale State Fix**: `confirmReceipt()` sets `setCurrentReceipt(null)` after save. Subsequent sync code in `handleConfirm()` was reading null. Fixed by capturing receipt snapshot before the async call.

### Changed Files
| File | Change |
|------|--------|
| `lib/storage/imageStore.ts` | **NEW** — IndexedDB CRUD for receipt images (save/load/delete/clear/has) |
| `hooks/useReceiptImage.ts` | **NEW** — Async image loading hook with fallback chain (memory → IndexedDB → Drive URL) |
| `lib/storage/receipts.ts` | `saveReceipt()` now strips `imageUrl` before LocalStorage write, `deleteReceipt()` also cleans IndexedDB |
| `types/receipt.ts` | Added `hasLocalImage` boolean flag for IndexedDB awareness |
| `hooks/useReceiptChat.ts` | `confirmReceipt()` saves to IndexedDB+LocalStorage only, no more sync logic |
| `components/receipts/ChatInterface.tsx` | Captures `receiptToSync` snapshot before `confirmReceipt()` clears state |
| `components/receipts/ReceiptDetail.tsx` | Uses `useReceiptImage` hook for async image display |
| `components/receipts/RetrySyncButton.tsx` | Loads image from IndexedDB for retry sync (not from receipt.imageUrl) |
| `app/belege/page.tsx` | GoogleAuthButton in both views, cleanup also clears IndexedDB images |

### Technical Decisions
- **IndexedDB over LocalStorage for images**: LocalStorage has ~5 MB hard limit. A 3-page PDF as Base64 is 5-10 MB. IndexedDB supports hundreds of MB and handles binary data natively.
- **Two-tier storage**: Metadata in LocalStorage (small, synchronous, fast) + images in IndexedDB (large, async, no size limit). Clean separation of concerns.
- **Single sync point**: Google Drive sync only in `ChatInterface.handleConfirm()`, not in the hook. Prevents double-upload and keeps status messages co-located.
- **Receipt snapshot before async**: `const receiptToSync = { ...currentReceipt }` before `await confirmReceipt()` to prevent stale state after `setCurrentReceipt(null)`.

### Current State
- TypeScript: ✅ Clean (0 errors)
- Build: ✅ Compiles (Next.js 16.1.6, all 11 routes)
- Vercel: ✅ Deployed at `haushaltsplaner-beta.vercel.app`
- Budget Planner: ✅ Loads and works on production
- Receipt Analysis: ✅ Claude API extraction works (images + PDFs)
- Google Auth: ✅ Button visible, OAuth configured
- Receipt Save (local): ✅ IndexedDB + LocalStorage (large PDFs no longer crash)
- **Receipt Sync (Drive): 🔴 BUG — Receipts after first one don't sync to Drive/Sheets despite UI showing success. Root cause unclear — stale state fix deployed but not yet verified.**

### Next Steps
1. **Debug receipt sync bug**: Receipts 2+ don't sync to Google Drive/Sheets. Need to check Vercel runtime logs for the actual API error. Possible causes:
   - `receiptToSync` snapshot may not include `imageUrl` if state already cleared
   - Google OAuth token refresh issue on Vercel
   - Vercel function timeout for large payloads
   - Check if `syncReceipt()` in `useReceiptSync` receives valid data
2. **Verify GOOGLE_CLIENT_SECRET**: Was fixed but need to confirm the corrected value is deployed
3. **Add GOOGLE_REDIRECT_URI env var**: Was added to "All Environments" but verify value is correct for production
4. **Test dual-environment setup**: `master` = Production, `develop` = Preview
5. **Clean up dev-only routes** before going live (`/api/google/cleanup`, `/api/google/init`)

### Open Questions
- Is the `GOOGLE_CLIENT_SECRET` in Vercel Production now correct? (Was corrupted, user was asked to fix)
- Does the `GOOGLE_REDIRECT_URI` env var match the Google Cloud Console redirect URI exactly?
- Should receipt saving work fully offline (LocalStorage only) when Google is not connected?

---

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
