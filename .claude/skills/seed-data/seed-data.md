# Seed Test Data

Populate app with test data for development.

## What to Seed

1. **Budget Scenarios** (LocalStorage):
   - "Normalzustand" scenario (from Projektbeschreibung.txt)
   - "Phase: Hausrenovierung2" scenario
   - Empty scenario for testing

2. **Sample Budget Items**:
   - All 5 categories with default items
   - Various frequencies (monthly, quarterly, yearly)
   - Edge cases (0 values, very large values)

3. **Sample Receipts** (if DB exists):
   - 3-5 test receipts with metadata
   - Different categories
   - Different merchants
   - Different confidence levels

## Implementation

Create or update `scripts/seed.ts`:

```typescript
// Seed budget scenarios to localStorage
const scenarios = {
  normalzustand: { /* data from spec */ },
  hausrenovierung: { /* data from spec */ },
}

// For receipts: INSERT INTO receipts table
// (only if database is set up)
```

Run with: `npx tsx scripts/seed.ts`

## Notes
- Idempotent (can run multiple times safely)
- Clear existing data first (ask user for confirmation)
- Log what was seeded
- Use exact values from Projektbeschreibung.txt
