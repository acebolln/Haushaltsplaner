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
- **Mobile camera capture** (native rear camera, HTTPS required)
- AI extraction via Claude API (merchant, date, amount, items, category)
- 6 tax-relevant categories (Hausrenovierung, Berufsbezogene Ausgaben, etc.)
- Bidirectional Google Drive/Sheets sync
- Structured yearly Google Sheet with formatted headers

### Mobile Optimized
- **Fully responsive** (320px+ / iPhone SE to desktop)
- Adaptive layouts with Tailwind breakpoints (sm:, md:, lg:)
- Touch-friendly inputs and buttons
- Camera button (mobile-only, sm:hidden)

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

## Branch Strategy

| Branch | Purpose | Vercel |
|--------|---------|--------|
| `master` | Production | Auto-deploy to production |
| `develop` | Test/Staging | Auto-deploy to preview |

## Deployment to Vercel

### Initial Setup
1. **Import Repository**: Connect GitHub repo to Vercel
2. **Configure Environments**:
   - **Production** (from `master`):
     - Add all env vars from `.env.local.example`
     - `GOOGLE_DRIVE_PARENT_FOLDER_ID` = Production folder
   - **Preview** (from `develop`):
     - Same env vars
     - `GOOGLE_DRIVE_PARENT_FOLDER_ID` = Test folder (separate from prod)

### Deploy
```bash
# Push to trigger auto-deployment
git push origin develop  # → Preview deployment
git push origin master   # → Production deployment

# Or manual via Vercel CLI
npm run build
vercel                   # Preview
vercel --prod            # Production
```

### Post-Deployment
- ✅ Test camera capture on real device (HTTPS required)
- ✅ Verify Google OAuth redirect URIs in Google Cloud Console
- ✅ Test mobile responsiveness (320px, 375px, 414px viewports)
