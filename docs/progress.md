# Haushaltsplaner — Project Progress

## Starting Point — 2026-03-15

**Project Goal**: Build a household budget planner with AI-powered receipt management.

**Modules**:
1. Budget Planner — 5 categories, scenario management, calculations, donut chart
2. Receipt Manager — Drag & drop upload, Claude Vision API extraction, storage

**Tech Stack**:
- Next.js 15 (App Router), TypeScript, React 19
- Tailwind CSS, shadcn/ui, Recharts
- Vercel Postgres + Blob (receipts)
- @anthropic-ai/sdk (receipt extraction)
- LocalStorage (budget scenarios)

**Phase 1 Goal**: MVP with Budget Planner module functional.

**Key Decisions from Architecture Review**:
- Budget scenarios in LocalStorage (fast, offline)
- Receipts in Vercel Postgres + Blob (persistent, images too large for LocalStorage)
- Claude API via server-side API routes (security)
- React Context for budget state, SWR for receipt server state
- Recharts for donut chart
- Vitest for business logic tests

**Current State**:
- ✅ Project structure created
- ✅ CLAUDE.md written
- ✅ 3 project agents defined (budget-calculator, receipt-processor, ui-builder)
- ✅ 3 skills defined (/deploy, /seed-data, /test-api)
- ⏳ Next.js project initialization pending
- ⏳ Dependencies installation pending
- ⏳ Database setup pending
- ⏳ API key configuration pending

**Next Steps**:
1. Initialize Next.js project with TypeScript + Tailwind
2. Install dependencies (shadcn/ui, Recharts, SWR, @anthropic-ai/sdk, Vercel packages)
3. Set up Anthropic API key
4. Create base folder structure
5. Implement Budget Planner module (calculation logic → UI components → state management)

---
<!-- New progress entries go here, above this line -->
