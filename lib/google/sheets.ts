/**
 * Google Sheets Integration
 *
 * Handles receipt data in Google Sheets:
 * - Create yearly sheets with structured data
 * - Append receipt rows
 * - Read all receipts from a yearly sheet
 * - Update individual receipt rows
 * - Sheets stored in year folder with receipts
 *
 * Sheet Structure:
 * - Yearly sheets: "2026-Belege" (one per year in Belege/2026/)
 * - Columns: Datum, Händler, Betrag, Kategorie, Zahlungsart, Positionen, Konfidenz, Beleg-Link, Notizen
 */

import { google, sheets_v4 } from "googleapis";
import type { GoogleSession } from "@/types/google";
import type {
  Receipt,
  ReceiptSheetRow,
  ReceiptCategory,
  PaymentMethod,
  ConfidenceLevel,
} from "@/types/receipt";

// Category labels in German
const CATEGORY_LABELS: Record<string, string> = {
  "hausrenovierung": "Hausrenovierung",
  "variable-kosten-vermietung": "Variable Kosten (Vermietung)",
  "berufsbezogene-ausgaben": "Berufsbezogene Ausgaben",
  "selbststaendige-taetigkeit": "Selbstständige Tätigkeit",
  "haushaltsfuehrung": "Haushaltsführung",
  "sonstige": "Sonstige",
};

// Payment method labels in German
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  "cash": "Bar",
  "card": "EC-Karte",
  "bank-transfer": "Überweisung",
  "other": "Sonstiges",
};

// Confidence labels in German
const CONFIDENCE_LABELS: Record<string, string> = {
  "high": "Hoch",
  "medium": "Mittel",
  "low": "Niedrig",
};

/** Reverse mapping: German category label -> ReceiptCategory enum value */
const CATEGORY_REVERSE: Record<string, ReceiptCategory> = Object.fromEntries(
  Object.entries(CATEGORY_LABELS).map(([key, value]) => [value, key as ReceiptCategory])
) as Record<string, ReceiptCategory>;

/** Reverse mapping: German payment method label -> PaymentMethod enum value */
const PAYMENT_METHOD_REVERSE: Record<string, PaymentMethod> = Object.fromEntries(
  Object.entries(PAYMENT_METHOD_LABELS).map(([key, value]) => [value, key as PaymentMethod])
) as Record<string, PaymentMethod>;

/** Reverse mapping: German confidence label -> ConfidenceLevel enum value */
const CONFIDENCE_REVERSE: Record<string, ConfidenceLevel> = Object.fromEntries(
  Object.entries(CONFIDENCE_LABELS).map(([key, value]) => [value, key as ConfidenceLevel])
) as Record<string, ConfidenceLevel>;

/**
 * Create Sheets API client with user session
 */
function getSheetsClient(session: GoogleSession): sheets_v4.Sheets {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  return google.sheets({ version: "v4", auth: oauth2Client });
}

/**
 * Find existing sheet by name in a folder
 *
 * @param session - User's Google session
 * @param sheetName - Name of the sheet to find
 * @param folderId - Parent folder ID to search in
 * @returns Spreadsheet ID or null if not found
 */
async function findSheet(
  session: GoogleSession,
  sheetName: string,
  folderId: string
): Promise<string | null> {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const query = `name='${sheetName}' and '${folderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;

  const response = await drive.files.list({
    q: query,
    fields: "files(id, name)",
    spaces: "drive",
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!;
  }

  return null;
}

/**
 * Create new yearly sheet with headers
 *
 * @param session - User's Google session
 * @param sheetName - Name of the sheet (e.g., "2026-Belege")
 * @param yearFolderId - Year folder ID
 * @returns Spreadsheet ID
 */
async function createYearlySheet(
  session: GoogleSession,
  sheetName: string,
  yearFolderId: string
): Promise<string> {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  const sheets = getSheetsClient(session);
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // Create spreadsheet
  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: sheetName,
      },
      sheets: [
        {
          properties: {
            title: "Belege",
          },
        },
      ],
    },
  });

  const spreadsheetId = createResponse.data.spreadsheetId!;
  // Get the actual sheetId from the create response (not always 0)
  const actualSheetId =
    createResponse.data.sheets?.[0]?.properties?.sheetId ?? 0;

  // Move to year folder
  await drive.files.update({
    fileId: spreadsheetId,
    addParents: yearFolderId,
    fields: "id, parents",
  });

  // Add headers
  const headers = [
    "Datum",
    "Händler",
    "Betrag (€)",
    "Kategorie",
    "Zahlungsart",
    "Positionen",
    "Konfidenz",
    "Beleg-Link",
    "Notizen",
    "Hochgeladen",
    "Letzte Änderung",
    "Änderungshistorie",
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Belege!A1:L1",
    valueInputOption: "RAW",
    requestBody: {
      values: [headers],
    },
  });

  // Format header row (bold, frozen)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: actualSheetId,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                textFormat: {
                  bold: true,
                },
                backgroundColor: {
                  red: 0.9,
                  green: 0.9,
                  blue: 0.9,
                },
              },
            },
            fields: "userEnteredFormat(textFormat,backgroundColor)",
          },
        },
        {
          updateSheetProperties: {
            properties: {
              sheetId: actualSheetId,
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            fields: "gridProperties.frozenRowCount",
          },
        },
      ],
    },
  });

  return spreadsheetId;
}

/**
 * Get or create yearly sheet for receipts
 *
 * Uses yearly naming convention: "YYYY-Belege" (e.g., "2026-Belege").
 *
 * @param session - User's Google session
 * @param date - Receipt date (ISO format YYYY-MM-DD)
 * @param yearFolderId - Year folder ID (e.g., Belege/2026/)
 * @returns Spreadsheet ID
 */
async function getYearlySheet(
  session: GoogleSession,
  date: string,
  yearFolderId: string
): Promise<string> {
  const [year] = date.split("-");
  const sheetName = `${year}-Belege`;

  // Try to find existing sheet
  const existingId = await findSheet(session, sheetName, yearFolderId);
  if (existingId) {
    return existingId;
  }

  // Create new sheet
  return createYearlySheet(session, sheetName, yearFolderId);
}

/**
 * Format cents as German euro string with thousands separator
 * e.g., 1800050 → "18.000,50"
 */
function formatEuroCents(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Format line items as string
 *
 * @param receipt - Receipt data
 * @returns Formatted string (e.g., "Milch (1,29€), Brot (2,49€)")
 */
function formatLineItems(receipt: Receipt): string {
  if (!receipt.lineItems || receipt.lineItems.length === 0) {
    return "-";
  }

  return receipt.lineItems
    .map((item) => {
      const price = formatEuroCents(item.totalPrice);
      return `${item.description} (${price}€)`;
    })
    .join(", ");
}

/**
 * Format a row of receipt data for writing to Google Sheets
 *
 * @param receipt - Receipt data
 * @param driveLink - Link to receipt image in Drive
 * @returns Array of cell values matching the sheet columns
 */
function formatReceiptRow(receipt: Receipt, driveLink: string): string[] {
  const amount = formatEuroCents(receipt.totalAmount);
  const category = CATEGORY_LABELS[receipt.category] || receipt.category;
  const paymentMethod = PAYMENT_METHOD_LABELS[receipt.paymentMethod] || receipt.paymentMethod;
  const lineItems = formatLineItems(receipt);
  const confidence = CONFIDENCE_LABELS[receipt.confidence] || receipt.confidence;
  const now = new Date().toISOString().split("T")[0];

  return [
    receipt.date,
    receipt.merchantName,
    amount,
    category,
    paymentMethod,
    lineItems,
    confidence,
    driveLink,
    receipt.notes || "",
    receipt.uploadedAt || now,
    now,
    "",
  ];
}

/**
 * Parse a German-formatted amount string back to cents
 *
 * @param amountStr - Amount string in German format (e.g., "45,67")
 * @returns Amount in cents (e.g., 4567)
 */
function parseGermanAmount(amountStr: string): number {
  // Remove currency symbols, whitespace, and thousands separators (dots)
  // German format: 18.000,50 → 18000.50
  const cleaned = amountStr.replace(/[€\s]/g, "").trim();
  // Remove dots (thousands separators), then replace comma (decimal) with dot
  const normalized = cleaned.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(normalized);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

/**
 * Append receipt data to yearly sheet
 *
 * @param session - User's Google session
 * @param receipt - Receipt data
 * @param driveLink - Link to receipt image in Drive
 * @param yearFolderId - Year folder ID
 * @returns Object with rowNumber and spreadsheetId
 */
export async function appendReceiptToSheet(
  session: GoogleSession,
  receipt: Receipt,
  driveLink: string,
  yearFolderId: string
): Promise<{ rowNumber: number; spreadsheetId: string }> {
  const sheets = getSheetsClient(session);

  // Get or create yearly sheet
  const spreadsheetId = await getYearlySheet(session, receipt.date, yearFolderId);

  const row = formatReceiptRow(receipt, driveLink);

  // Append row
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Belege!A:L",
    valueInputOption: "RAW",
    requestBody: {
      values: [row],
    },
  });

  // Extract row number from response
  const updatedRange = response.data.updates?.updatedRange || "";
  const match = updatedRange.match(/!A(\d+):L\d+/);
  const rowNumber = match ? parseInt(match[1]) : 0;

  return { rowNumber, spreadsheetId };
}

/**
 * Find the yearly sheet in a year folder (public wrapper around findSheet)
 *
 * @param session - User's Google session
 * @param yearFolderId - Year folder ID (e.g., Belege/2026/)
 * @param year - Year string (e.g., "2026")
 * @returns Spreadsheet ID or null if not found
 */
export async function findYearlySheet(
  session: GoogleSession,
  yearFolderId: string,
  year: string
): Promise<string | null> {
  const sheetName = `${year}-Belege`;
  return findSheet(session, sheetName, yearFolderId);
}

/**
 * Read all receipt rows from a yearly sheet
 *
 * Finds the yearly sheet ("YYYY-Belege") in the year folder, reads all data
 * rows (skipping the header), and parses each row back into a ReceiptSheetRow.
 *
 * @param session - User's Google session
 * @param yearFolderId - Year folder ID (e.g., Belege/2026/)
 * @param year - Year string (e.g., "2026")
 * @returns Object with parsed rows and spreadsheetId, or null if sheet doesn't exist
 */
export async function readAllReceipts(
  session: GoogleSession,
  yearFolderId: string,
  year: string
): Promise<{ rows: ReceiptSheetRow[]; spreadsheetId: string } | null> {
  const spreadsheetId = await findYearlySheet(session, yearFolderId, year);
  if (!spreadsheetId) {
    return null;
  }

  const sheets = getSheetsClient(session);

  // Read all data (including header to determine range)
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Belege!A:L",
  });

  const allRows = response.data.values;
  if (!allRows || allRows.length <= 1) {
    // No data rows (only header or empty)
    return { rows: [], spreadsheetId };
  }

  // Skip header row (index 0), parse data rows
  const rows: ReceiptSheetRow[] = [];

  for (let i = 1; i < allRows.length; i++) {
    const cells = allRows[i];
    if (!cells || cells.length === 0) {
      continue;
    }

    const date = (cells[0] as string) || "";
    const merchantName = (cells[1] as string) || "";
    const amountStr = (cells[2] as string) || "0";
    const categoryLabel = (cells[3] as string) || "";
    const paymentMethodLabel = (cells[4] as string) || "";
    const lineItemsRaw = (cells[5] as string) || "-";
    const confidenceLabel = (cells[6] as string) || "";
    const driveLink = (cells[7] as string) || "";
    const notes = (cells[8] as string) || "";
    const uploadedAt = (cells[9] as string) || "";
    const lastModified = (cells[10] as string) || "";
    const changeHistory = (cells[11] as string) || "";

    const totalAmount = parseGermanAmount(amountStr);
    const category = CATEGORY_REVERSE[categoryLabel] || "sonstige";
    const paymentMethod = PAYMENT_METHOD_REVERSE[paymentMethodLabel] || "other";
    const confidence = CONFIDENCE_REVERSE[confidenceLabel] || "medium";

    rows.push({
      rowNumber: i + 1, // 1-indexed, +1 for header
      date,
      merchantName,
      totalAmount,
      category,
      paymentMethod,
      lineItemsRaw,
      confidence,
      driveLink,
      notes,
      uploadedAt,
      lastModified,
      changeHistory,
    });
  }

  return { rows, spreadsheetId };
}

/**
 * Update a specific receipt row in the sheet
 *
 * Overwrites all columns for the given row using the same formatting
 * as appendReceiptToSheet (German labels, formatted amounts).
 *
 * @param session - User's Google session
 * @param spreadsheetId - Google Sheets spreadsheet ID
 * @param rowNumber - 1-indexed row number to update
 * @param receipt - Receipt data to write
 * @param driveLink - Link to receipt image in Drive
 */
export async function updateReceiptRow(
  session: GoogleSession,
  spreadsheetId: string,
  rowNumber: number,
  receipt: Receipt,
  driveLink: string
): Promise<void> {
  const sheets = getSheetsClient(session);

  // Read existing row to get uploadedAt and build change history
  const existingResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `Belege!A${rowNumber}:L${rowNumber}`,
  });

  const existingCells = existingResponse.data.values?.[0] || [];
  const originalUploadedAt = (existingCells[9] as string) || "";
  const existingHistory = (existingCells[11] as string) || "";

  // Detect what changed
  const changes: string[] = [];
  const oldMerchant = (existingCells[1] as string) || "";
  const oldAmount = (existingCells[2] as string) || "";
  const oldCategory = (existingCells[3] as string) || "";
  const oldPayment = (existingCells[4] as string) || "";
  const oldNotes = (existingCells[8] as string) || "";

  const newAmount = formatEuroCents(receipt.totalAmount);
  const newCategory = CATEGORY_LABELS[receipt.category] || receipt.category;
  const newPayment = PAYMENT_METHOD_LABELS[receipt.paymentMethod] || receipt.paymentMethod;

  if (oldMerchant !== receipt.merchantName) changes.push(`Händler: ${oldMerchant} → ${receipt.merchantName}`);
  if (oldAmount !== newAmount) changes.push(`Betrag: ${oldAmount} → ${newAmount}`);
  if (oldCategory !== newCategory) changes.push(`Kategorie: ${oldCategory} → ${newCategory}`);
  if (oldPayment !== newPayment) changes.push(`Zahlung: ${oldPayment} → ${newPayment}`);
  if (oldNotes !== (receipt.notes || "")) changes.push("Notizen geändert");

  const now = new Date().toISOString().split("T")[0];
  const changeEntry = changes.length > 0
    ? `${now}: ${changes.join(", ")}`
    : "";

  const updatedHistory = changeEntry
    ? (existingHistory ? `${changeEntry} | ${existingHistory}` : changeEntry)
    : existingHistory;

  const row = formatReceiptRow(receipt, driveLink);
  // Override columns J-L with tracked values
  row[9] = originalUploadedAt || now;
  row[10] = now;
  row[11] = updatedHistory;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Belege!A${rowNumber}:L${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [row],
    },
  });
}

/**
 * Delete a receipt row from the sheet
 *
 * Clears the row content (doesn't remove the row to preserve row numbers).
 * Alternatively deletes the row if it's the last data row.
 *
 * @param session - User's Google session
 * @param spreadsheetId - Google Sheets spreadsheet ID
 * @param rowNumber - 1-indexed row number to delete
 */
export async function deleteReceiptRow(
  session: GoogleSession,
  spreadsheetId: string,
  rowNumber: number
): Promise<void> {
  const sheets = getSheetsClient(session);

  // Get the sheet ID for the "Belege" tab
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties",
  });

  const belegeSheet = spreadsheet.data.sheets?.find(
    (s) => s.properties?.title === "Belege"
  );
  const sheetId = belegeSheet?.properties?.sheetId ?? 0;

  // Delete the entire row (shifts remaining rows up)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1, // 0-indexed
              endIndex: rowNumber, // exclusive
            },
          },
        },
      ],
    },
  });
}

/**
 * Get year folder ID from receipt date
 * Used for placing sheets in the same folder as receipts
 *
 * @param session - User's Google session
 * @param date - Receipt date (ISO format YYYY-MM-DD)
 * @returns Year folder ID
 */
export async function getYearFolderIdFromDate(session: GoogleSession, date: string): Promise<string> {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const [year] = date.split("-");
  const folderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
  if (!folderId) {
    throw new Error(
      "GOOGLE_DRIVE_PARENT_FOLDER_ID must be set in environment variables"
    );
  }

  // Find Belege folder
  const belegeQuery = `name='Belege' and '${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const belegeResponse = await drive.files.list({
    q: belegeQuery,
    fields: "files(id)",
    spaces: "drive",
  });

  if (!belegeResponse.data.files || belegeResponse.data.files.length === 0) {
    throw new Error("Belege folder not found");
  }

  const belegeId = belegeResponse.data.files[0].id!;

  // Find year folder
  const yearQuery = `name='${year}' and '${belegeId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const yearResponse = await drive.files.list({
    q: yearQuery,
    fields: "files(id)",
    spaces: "drive",
  });

  if (!yearResponse.data.files || yearResponse.data.files.length === 0) {
    // Create year folder if not exists
    const createResponse = await drive.files.create({
      requestBody: {
        name: year,
        mimeType: "application/vnd.google-apps.folder",
        parents: [belegeId],
      },
      fields: "id",
    });
    return createResponse.data.id!;
  }

  return yearResponse.data.files[0].id!;
}
