# Haushaltsplaner — Project Progress

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
