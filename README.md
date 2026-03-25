# Haushaltsplaner

Budget planning and AI-powered receipt management for household finances.

## Features

### Budget Planner
- 5 categories: Einnahmen, Fixkosten, Variable Kosten, Sparquote, Hauskosten
- Inline editing with frequency conversion (monthly/quarterly/yearly)
- Scenario management (save, load, compare)
- Donut chart expense breakdown
- Sticky status bar with reserve indicator

### Receipt Manager
- Chat-based upload (JPG, PNG, HEIC, PDF)
- AI extraction via Claude API (merchant, date, amount, items, category)
- 6 tax-relevant categories (Hausrenovierung, Berufsbezogene Ausgaben, etc.)
- Bidirectional Google Drive/Sheets sync
- Structured yearly Google Sheet with formatted headers

## Tech Stack
Next.js 16 · TypeScript · React 19 · Tailwind CSS 4 · shadcn/ui · Recharts · Claude API · Google APIs · iron-session

## Setup

```bash
npm install
cp .env.example .env.local  # Configure environment variables
npm run dev                  # http://localhost:3000
```

### Environment Variables
```
ANTHROPIC_API_KEY=              # Claude API key
GOOGLE_CLIENT_ID=               # Google OAuth client ID
GOOGLE_CLIENT_SECRET=           # Google OAuth client secret
GOOGLE_DRIVE_PARENT_FOLDER_ID=  # "Trautes Heim" folder ID in Drive
SESSION_SECRET=                 # Random 32+ char string for iron-session
```

## Deployment
```bash
npm run build           # Production build
vercel                  # Deploy to Vercel (preview)
vercel --prod           # Deploy to production
```
