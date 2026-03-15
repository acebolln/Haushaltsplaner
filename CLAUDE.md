# Haushaltsplaner

## Project
Budget planning app with AI-powered receipt management for family household.
Two modules: Budget Planner (5 categories, scenario management) + Receipt Manager (Claude API extraction).

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- React 19
- Tailwind CSS
- shadcn/ui
- Vercel Postgres (receipts metadata)
- Vercel Blob (receipt images)
- @anthropic-ai/sdk (receipt extraction)
- Recharts (donut chart)
- SWR (server state)

## Commands
- `npm run dev` — Dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run type-check` — TypeScript check
- `npm test` — Run Vitest tests

## Architecture
- `app/` — Next.js App Router (pages, layouts, API routes)
- `components/budget/` — Budget Planner UI components
- `components/receipts/` — Receipt Manager UI components
- `components/ui/` — shadcn/ui base components
- `lib/budget/` — Budget calculation logic (pure functions)
- `lib/storage/` — LocalStorage abstraction (scenarios)
- `lib/db/` — Database queries (receipts)
- `lib/api/` — External API clients (Claude)
- `types/` — TypeScript type definitions
- `hooks/` — Custom React hooks

## Rules
- Budget scenarios → LocalStorage (fast, offline-capable)
- Receipts (images + metadata) → Vercel Postgres + Blob (persistent)
- Claude API calls MUST go through server-side API routes (/api/receipts/analyze)
- Never expose ANTHROPIC_API_KEY in client-side code
- All monetary calculations in cents (number), display in euros (string)
- Frequency conversion: yearly÷12, quarterly÷4 for monthly values
- Status colors: >500€=green, >300€=yellow, >0€=orange, ≤0€=red
- German UI labels, English code comments
- TypeScript strict mode, no 'any' types
- Save progress to docs/progress.md before /clear
- Use project agents: budget-calculator, receipt-processor, ui-builder
- Use skills: /deploy, /seed-data, /test-api

## Current Phase
MVP: Setup + Budget Planner module (Receipt Manager in phase 2)
