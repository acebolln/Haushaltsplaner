# Haushaltsplaner

## Project
Budget planning app with AI-powered receipt management for family household.
Two modules: Budget Planner (5 categories, scenario management) + Receipt Manager (Claude API extraction, PDF support, bidirectional Google Sync).

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript (strict mode)
- React 19
- Tailwind CSS 4
- shadcn/ui
- LocalStorage (budgets + receipts, fast layer) + Google Drive/Sheets (receipts + budgets — bidirectional sync)
- @anthropic-ai/sdk (receipt extraction — images + PDFs)
- googleapis (OAuth 2.0, Drive, Sheets API)
- iron-session (encrypted session cookies)
- Recharts (donut chart)

## Commands
- `npm run dev` — Dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run type-check` — TypeScript check
- `npm test` — Run Vitest tests

## Architecture
- `app/` — Next.js App Router (pages, layouts, API routes)
- `app/api/receipts/analyze` — Claude Vision/Document API for receipt extraction
- `app/api/receipts/sync` — Bidirectional receipt sync: POST (push), GET (pull), PATCH (update)
- `app/api/budget/sync` — Budget sync: POST (push budget+scenarios), GET (pull)
- `app/api/google/` — OAuth signin, auth callback, session, cleanup, init
- `components/budget/` — Budget Planner UI (BudgetPlanner, CategorySection, DonutChart, ScenarioManager, StickyBottomBar)
- `components/receipts/` — Receipt Manager UI (ChatInterface, ChatInput, ChatMessage, ReceiptChatCard, ReceiptList, ReceiptManager)
- `components/google/` — GoogleAuthButton
- `components/ui/` — shadcn/ui base components
- `lib/budget/` — Budget calculation logic (pure functions)
- `lib/storage/` — LocalStorage (budgets + receipt metadata) + IndexedDB (receipt images via imageStore.ts)
- `lib/google/` — Google OAuth, Drive, Sheets, Sync integration (receipts + budgets)
- `lib/receipts/` — Extraction prompt, Zod validation
- `lib/security/` — Rate limiter
- `types/` — TypeScript type definitions (budget, receipt, chat, google)
- `hooks/` — Custom React hooks (useBudgetCalculator, useBudgetSync, useReceiptChat, useReceiptSync, useReceiptImage, useGoogleAuth, etc.)

## Google Drive Structure
```
Trautes Heim/ (env: GOOGLE_DRIVE_PARENT_FOLDER_ID)
├── Belege/
│   └── 2026/
│       ├── Check/       ← For manually uploaded files
│       ├── Done/        ← Confirmed receipts (images + PDFs)
│       └── 2026-Belege  ← Google Sheet (yearly, 9 columns)
└── Budget/
    └── Haushaltsplan    ← Google Sheet (Tab "Aktuell" + Tab "Szenarien")
```

## Receipt Categories (Tax-relevant)
1. Hausrenovierung — Hardware, building materials
2. Variable Kosten (Vermietung) — Rental property expenses
3. Berufsbezogene Ausgaben — Work-related (Anlage N)
4. Selbstständige Tätigkeit — Self-employed (Anlage S)
5. Haushaltsführung — Groceries, household
6. Sonstige — Everything else

## Rules
- Budgets in LocalStorage, receipts synced bidirectionally with Google Drive/Sheets
- Claude API calls MUST go through server-side API routes
- Never expose ANTHROPIC_API_KEY or GOOGLE_CLIENT_SECRET in client-side code
- Google OAuth tokens stored in encrypted HttpOnly cookies (iron-session)
- All monetary calculations in cents (number), display in euros with Intl.NumberFormat('de-DE')
- Frequency conversion: yearly÷12, quarterly÷4 for monthly values
- Status colors: >500€=green, >300€=yellow, >0€=orange, ≤0€=red
- German UI labels, English code comments
- TypeScript strict mode, no 'any' types
- PDF + image uploads supported (JPG, PNG, HEIC, PDF — max 10MB)
- Zod validation allows negative amounts (Gutschriften, Abschläge)

## Current Phase
Phase 3: Deployed to Vercel (`haushaltsplaner-beta.vercel.app`). IndexedDB image storage. Budget sync to Google Sheets (debounced push, pull on empty LocalStorage). Default landing page changed to /belege, budget moved to /budget. Dead dependencies removed (MongoDB, @vercel/postgres, @vercel/blob). Receipt sync bug open: receipts 2+ don't sync to Google Drive despite UI success message.
