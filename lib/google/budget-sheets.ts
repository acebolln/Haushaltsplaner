/**
 * Google Sheets Integration for Budget Data
 *
 * Syncs budget data (current budget + scenarios) to Google Sheets.
 * Sheet location: Trautes Heim/Budget/Haushaltsplan
 *
 * Tabs:
 * - "Aktuell": Human-readable current budget (Kategorie, Position, Betrag, Frequenz)
 * - "Szenarien": Scenario backup with JSON for lossless round-trip
 */

import { google, sheets_v4 } from "googleapis";
import type { GoogleSession } from "@/types/google";
import type { BudgetData, Scenario, Frequency } from "@/types/budget";

const SHEET_NAME = "Haushaltsplan";
const TAB_AKTUELL = "Aktuell";
const TAB_SZENARIEN = "Szenarien";

const FREQUENCY_LABELS: Record<Frequency, string> = {
  monthly: "Monatlich",
  quarterly: "Vierteljährlich",
  yearly: "Jährlich",
};

const FREQUENCY_REVERSE: Record<string, Frequency> = Object.fromEntries(
  Object.entries(FREQUENCY_LABELS).map(([key, value]) => [value, key as Frequency])
) as Record<string, Frequency>;

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  income: "Einnahmen",
  fixed: "Fixkosten",
  variable: "Variable Kosten",
  savings: "Sparen",
  housing: "Hauskosten",
};

function getSheetsClient(session: GoogleSession): sheets_v4.Sheets {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  return google.sheets({ version: "v4", auth: oauth2Client });
}

/**
 * Find or create the Budget folder under Trautes Heim
 */
async function getBudgetFolderId(session: GoogleSession): Promise<string> {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
  if (!parentFolderId) {
    throw new Error("GOOGLE_DRIVE_PARENT_FOLDER_ID must be set");
  }

  // Find or create Budget folder
  const query = `name='Budget' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const response = await drive.files.list({
    q: query,
    fields: "files(id)",
    spaces: "drive",
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!;
  }

  const createResponse = await drive.files.create({
    requestBody: {
      name: "Budget",
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    fields: "id",
  });

  return createResponse.data.id!;
}

/**
 * Find existing Haushaltsplan sheet in Budget folder
 */
async function findBudgetSheet(
  session: GoogleSession,
  budgetFolderId: string
): Promise<string | null> {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const query = `name='${SHEET_NAME}' and '${budgetFolderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;
  const response = await drive.files.list({
    q: query,
    fields: "files(id)",
    spaces: "drive",
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!;
  }

  return null;
}

/**
 * Create the Haushaltsplan spreadsheet with two tabs
 */
async function createBudgetSheet(
  session: GoogleSession,
  budgetFolderId: string
): Promise<string> {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const sheets = getSheetsClient(session);
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // Create spreadsheet with two tabs
  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: SHEET_NAME },
      sheets: [
        { properties: { title: TAB_AKTUELL, sheetId: 0 } },
        { properties: { title: TAB_SZENARIEN, sheetId: 1 } },
      ],
    },
  });

  const spreadsheetId = createResponse.data.spreadsheetId!;

  // Move to Budget folder
  await drive.files.update({
    fileId: spreadsheetId,
    addParents: budgetFolderId,
    fields: "id, parents",
  });

  // Add headers to Aktuell tab
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${TAB_AKTUELL}!A1:D1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [["Kategorie", "Position", "Betrag (€)", "Frequenz"]],
    },
  });

  // Add headers to Szenarien tab
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${TAB_SZENARIEN}!A1:C1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [["Szenario-Name", "Erstellt", "JSON-Daten"]],
    },
  });

  // Format both header rows (bold, frozen, grey background)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [0, 1].flatMap((sheetId) => [
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
              },
            },
            fields: "userEnteredFormat(textFormat,backgroundColor)",
          },
        },
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              gridProperties: { frozenRowCount: 1 },
            },
            fields: "gridProperties.frozenRowCount",
          },
        },
      ]),
    },
  });

  return spreadsheetId;
}

/**
 * Get or create the Haushaltsplan spreadsheet
 */
export async function getOrCreateBudgetSheet(
  session: GoogleSession
): Promise<string> {
  const budgetFolderId = await getBudgetFolderId(session);
  const existingId = await findBudgetSheet(session, budgetFolderId);
  if (existingId) return existingId;
  return createBudgetSheet(session, budgetFolderId);
}

/**
 * Push current budget to "Aktuell" tab
 * Clears all data rows and rewrites from BudgetData
 */
export async function pushCurrentBudget(
  session: GoogleSession,
  budgetData: BudgetData
): Promise<void> {
  const sheets = getSheetsClient(session);
  const spreadsheetId = await getOrCreateBudgetSheet(session);

  // Build rows: one per BudgetItem, grouped by category
  const rows: string[][] = [];
  const categoryOrder: (keyof BudgetData["categories"])[] = [
    "income",
    "fixed",
    "variable",
    "savings",
    "housing",
  ];

  for (const catKey of categoryOrder) {
    const category = budgetData.categories[catKey];
    const displayName = CATEGORY_DISPLAY_NAMES[catKey] || category.name;

    for (const item of category.items) {
      const amount = (item.amount / 100).toFixed(2).replace(".", ",");
      const frequency = FREQUENCY_LABELS[item.frequency] || item.frequency;
      rows.push([displayName, item.name, amount, frequency]);
    }
  }

  // Clear existing data (keep header)
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${TAB_AKTUELL}!A2:D`,
  });

  // Write new data
  if (rows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${TAB_AKTUELL}!A2:D${rows.length + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: rows },
    });
  }
}

/**
 * Pull current budget from "Aktuell" tab
 * Parses rows back into BudgetData structure
 */
export async function pullCurrentBudget(
  session: GoogleSession
): Promise<BudgetData | null> {
  const sheets = getSheetsClient(session);
  const budgetFolderId = await getBudgetFolderId(session);
  const spreadsheetId = await findBudgetSheet(session, budgetFolderId);

  if (!spreadsheetId) return null;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${TAB_AKTUELL}!A:D`,
  });

  const allRows = response.data.values;
  if (!allRows || allRows.length <= 1) return null;

  // Reverse mapping: display name -> category key
  const categoryReverse: Record<string, keyof BudgetData["categories"]> = {};
  for (const [key, label] of Object.entries(CATEGORY_DISPLAY_NAMES)) {
    categoryReverse[label] = key as keyof BudgetData["categories"];
  }

  // Build BudgetData from rows
  const categories: BudgetData["categories"] = {
    income: { id: "income", name: "Einnahmen", items: [] },
    fixed: { id: "fixed", name: "Fixkosten", items: [] },
    variable: { id: "variable", name: "Variable Kosten", items: [] },
    savings: { id: "savings", name: "Sparen / Rücklagen", items: [] },
    housing: { id: "housing", name: "Hauskosten", items: [] },
  };

  for (let i = 1; i < allRows.length; i++) {
    const cells = allRows[i];
    if (!cells || cells.length < 3) continue;

    const categoryLabel = (cells[0] as string) || "";
    const itemName = (cells[1] as string) || "";
    const amountStr = (cells[2] as string) || "0";
    const frequencyLabel = (cells[3] as string) || "Monatlich";

    const catKey = categoryReverse[categoryLabel];
    if (!catKey) continue;

    const amount = Math.round(
      parseFloat(amountStr.replace(",", ".")) * 100
    );
    const frequency = FREQUENCY_REVERSE[frequencyLabel] || "monthly";

    categories[catKey].items.push({
      id: crypto.randomUUID(),
      name: itemName,
      amount,
      frequency,
    });
  }

  return { categories };
}

/**
 * Push all scenarios to "Szenarien" tab
 */
export async function pushScenarios(
  session: GoogleSession,
  scenarios: Scenario[]
): Promise<void> {
  const sheets = getSheetsClient(session);
  const spreadsheetId = await getOrCreateBudgetSheet(session);

  // Clear existing data (keep header)
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${TAB_SZENARIEN}!A2:C`,
  });

  if (scenarios.length === 0) return;

  const rows = scenarios.map((s) => [
    s.name,
    s.createdAt,
    JSON.stringify({ id: s.id, data: s.data }),
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${TAB_SZENARIEN}!A2:C${rows.length + 1}`,
    valueInputOption: "RAW",
    requestBody: { values: rows },
  });
}

/**
 * Pull all scenarios from "Szenarien" tab
 */
export async function pullScenarios(
  session: GoogleSession
): Promise<Scenario[]> {
  const sheets = getSheetsClient(session);
  const budgetFolderId = await getBudgetFolderId(session);
  const spreadsheetId = await findBudgetSheet(session, budgetFolderId);

  if (!spreadsheetId) return [];

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${TAB_SZENARIEN}!A:C`,
  });

  const allRows = response.data.values;
  if (!allRows || allRows.length <= 1) return [];

  const scenarios: Scenario[] = [];

  for (let i = 1; i < allRows.length; i++) {
    const cells = allRows[i];
    if (!cells || cells.length < 3) continue;

    const name = (cells[0] as string) || "";
    const createdAt = (cells[1] as string) || new Date().toISOString();
    const jsonStr = (cells[2] as string) || "";

    try {
      const parsed = JSON.parse(jsonStr);
      scenarios.push({
        id: parsed.id || crypto.randomUUID(),
        name,
        data: parsed.data,
        createdAt,
      });
    } catch {
      console.error(`Failed to parse scenario JSON at row ${i + 1}`);
    }
  }

  return scenarios;
}
