# Google Drive Sync Guide

## Overview

Receipts are automatically backed up to Google Drive and tracked in Google Sheets when the user is authenticated via Google OAuth.

## Folder Structure

```
Trautes Heim/
├── Belege/                      ← Receipt images organized by date
│   ├── 2026/
│   │   ├── 03-März/
│   │   │   ├── 2026-03-16_REWE_45.67.jpg
│   │   │   └── 2026-03-16_Edeka_23.45.png
│   │   └── 04-April/
│   │       └── 2026-04-01_DM_12.99.jpg
│   └── 2027/
│       └── ...
├── Buchhaltung/                 ← Monthly Google Sheets
│   ├── 2026-03-März.xlsx       ← One sheet per month
│   ├── 2026-04-April.xlsx
│   └── ...
└── Archiv/                      ← Archived/cancelled receipts
    └── 2025/
```

## Google Sheets Structure

### Monthly Sheet (e.g., "2026-03-März.xlsx")

| Column | Description | Format | Example |
|--------|-------------|--------|---------|
| Datum | Receipt date | YYYY-MM-DD | 2026-03-16 |
| Händler | Merchant name | Text | REWE |
| Betrag (€) | Total amount | Number (comma decimal) | 45,67 |
| Kategorie | Receipt category | German label | Haushaltsführung |
| Zahlungsart | Payment method | German label | EC-Karte |
| Positionen | Line items | Comma-separated list | Milch (1,29€), Brot (2,49€) |
| Konfidenz | Extraction confidence | Hoch/Mittel/Niedrig | Hoch |
| Beleg-Link | Link to Drive image | URL | [Link to file] |
| Notizen | User notes | Text | (optional) |

### Sheet Features
- **Header row**: Bold, gray background, frozen
- **Auto-organization**: Receipts automatically sorted by month
- **Direct links**: Click "Beleg-Link" to view original image in Drive

## API Usage

### Sync Receipt to Drive/Sheets

**Endpoint:** `POST /api/receipts/sync`

**Authentication:** Requires active Google OAuth session

**Request Body:**
```json
{
  "receipt": {
    "id": "receipt-123",
    "merchantName": "REWE",
    "date": "2026-03-16",
    "totalAmount": 4567,
    "paymentMethod": "card",
    "category": "haushaltsfuehrung",
    "lineItems": [
      {
        "description": "Milch",
        "quantity": 1,
        "unitPrice": 129,
        "totalPrice": 129
      }
    ],
    "confidence": "high",
    "createdAt": "2026-03-16T10:30:00Z",
    "updatedAt": "2026-03-16T10:30:00Z"
  },
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "driveFileId": "1abc123...",
  "driveFileUrl": "https://drive.google.com/file/d/1abc123...",
  "sheetRowNumber": 5,
  "syncedAt": "2026-03-16T10:30:15Z"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

## Integration Points

### 1. After Receipt Confirmation
When user confirms a receipt in the chat interface:

```typescript
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const { isAuthenticated } = useGoogleAuth();

async function saveReceipt(receipt: Receipt, imageBase64: string) {
  // Save to localStorage first (primary storage)
  localStorage.setItem(`receipt-${receipt.id}`, JSON.stringify(receipt));

  // Sync to Google Drive/Sheets (if authenticated)
  if (isAuthenticated) {
    try {
      const response = await fetch("/api/receipts/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt, imageBase64 }),
      });

      const result = await response.json();

      if (result.success) {
        // Update receipt with Drive metadata
        receipt.driveFileId = result.driveFileId;
        receipt.driveFileUrl = result.driveFileUrl;
        receipt.sheetRowNumber = result.sheetRowNumber;
        receipt.syncedAt = result.syncedAt;

        // Update localStorage
        localStorage.setItem(`receipt-${receipt.id}`, JSON.stringify(receipt));
      }
    } catch (error) {
      console.error("Failed to sync to Google Drive:", error);
      // Continue without sync - app works offline
    }
  }
}
```

### 2. Show Sync Status in UI

```typescript
<ReceiptCard receipt={receipt}>
  {receipt.syncedAt ? (
    <Badge variant="success">
      ✓ Synced {new Date(receipt.syncedAt).toLocaleDateString()}
    </Badge>
  ) : (
    <Badge variant="warning">Local only</Badge>
  )}
</ReceiptCard>
```

## Testing

### Prerequisites
1. Start dev server: `npm run dev`
2. Sign in with Google OAuth
3. Verify authentication: Check for "Sign in with Google" → should show email

### Test Sync Flow
1. Upload a receipt image in `/belege`
2. Confirm extracted data
3. Check console for sync logs
4. Verify in Google Drive:
   - Open "Trautes Heim" folder
   - Navigate to Belege/YYYY/MM-Month/
   - Find uploaded image
5. Verify in Google Sheets:
   - Open Buchhaltung/ folder
   - Open monthly sheet (e.g., "2026-03-März")
   - Find receipt row with data

### Manual API Test

```bash
curl -X POST http://localhost:3000/api/receipts/sync \
  -H "Content-Type: application/json" \
  -b "google_session=..." \
  -d '{
    "receipt": {
      "id": "test-123",
      "merchantName": "Test Store",
      "date": "2026-03-16",
      "totalAmount": 1999,
      "paymentMethod": "cash",
      "category": "haushaltsfuehrung",
      "lineItems": [],
      "confidence": "high",
      "createdAt": "2026-03-16T10:00:00Z",
      "updatedAt": "2026-03-16T10:00:00Z"
    },
    "imageBase64": "data:image/jpeg;base64,..."
  }'
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Not authenticated" | User not signed in | Prompt user to sign in with Google |
| "Missing receipt or image data" | Invalid request body | Check receipt object and base64 string |
| "Failed to upload file to Drive" | Drive API error | Check API quotas, retry |
| "Invalid base64 image format" | Malformed base64 string | Validate base64 string has `data:image/...;base64,` prefix |

### Graceful Degradation
- App works **without** Google authentication (LocalStorage only)
- Sync failures don't block receipt saving
- User can manually retry sync later

## Next Steps

**Phase 2, Sprint 3: Retry & Status UI**
- Add "Retry Sync" button for failed syncs
- Show sync status badges on receipt cards
- Bulk sync for existing receipts

**Phase 2, Sprint 4: Annual Summary**
- Generate "Jahresübersicht-YYYY.xlsx" with monthly totals
- Category breakdowns
- Tax-deductible calculations
