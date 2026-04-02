/**
 * Google Drive Init API
 *
 * POST /api/google/init
 * Creates the new folder structure and a formatted yearly Sheet.
 *
 * Structure created:
 * Trautes Heim/
 * └── Belege/
 *     └── 2026/
 *         ├── Check/
 *         ├── Done/
 *         └── 2026-Belege (Google Sheet)
 */

import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { GoogleSession } from "@/types/google";
import { getYearFolderId } from "@/lib/google/drive";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "google_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 14,
  },
};

export async function POST() {
  try {
    const session = await getIronSession<GoogleSession>(
      await cookies(),
      sessionOptions
    );

    if (!session.accessToken) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const year = String(new Date().getFullYear());
    const date = `${year}-01-01`;

    // Create folder structure: Belege/YYYY/Check/ + Done/
    const yearFolderId = await getYearFolderId(session, date);

    // Create the yearly Sheet (empty, with formatted headers)
    // appendReceiptToSheet auto-creates the sheet if it doesn't exist
    // We'll trigger it by calling the sheet finder/creator directly
    const { google, sheets_v4 } = await import("googleapis");

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    // Check if sheet already exists
    const sheetName = `${year}-Belege`;
    const existingQuery = `name='${sheetName}' and '${yearFolderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;
    const existing = await drive.files.list({
      q: existingQuery,
      fields: "files(id, name)",
    });

    let spreadsheetId: string;

    if (existing.data.files && existing.data.files.length > 0) {
      spreadsheetId = existing.data.files[0].id!;
    } else {
      // Create new sheet
      const createResponse = await sheets.spreadsheets.create({
        requestBody: {
          properties: { title: sheetName },
          sheets: [{ properties: { title: "Belege" } }],
        },
      });

      spreadsheetId = createResponse.data.spreadsheetId!;

      // Move to year folder
      await drive.files.update({
        fileId: spreadsheetId,
        addParents: yearFolderId,
        fields: "id, parents",
      });

      // Add headers (12 columns, matching sheets.ts schema)
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
        requestBody: { values: [headers] },
      });

      // Format: bold header, frozen row, column widths, alternating row colors
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            // Bold header with background color
            {
              repeatCell: {
                range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
                    backgroundColor: { red: 0.13, green: 0.13, blue: 0.13 },
                    horizontalAlignment: "CENTER",
                  },
                },
                fields: "userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)",
              },
            },
            // Freeze header row
            {
              updateSheetProperties: {
                properties: {
                  sheetId: 0,
                  gridProperties: { frozenRowCount: 1 },
                },
                fields: "gridProperties.frozenRowCount",
              },
            },
            // Set column widths
            ...([
              { index: 0, width: 110 },  // Datum
              { index: 1, width: 180 },  // Händler
              { index: 2, width: 100 },  // Betrag
              { index: 3, width: 200 },  // Kategorie
              { index: 4, width: 120 },  // Zahlungsart
              { index: 5, width: 300 },  // Positionen
              { index: 6, width: 100 },  // Konfidenz
              { index: 7, width: 250 },  // Beleg-Link
              { index: 8, width: 200 },  // Notizen
              { index: 9, width: 130 },  // Hochgeladen
              { index: 10, width: 130 }, // Letzte Änderung
              { index: 11, width: 250 }, // Änderungshistorie
            ].map((col) => ({
              updateDimensionProperties: {
                range: {
                  sheetId: 0,
                  dimension: "COLUMNS" as const,
                  startIndex: col.index,
                  endIndex: col.index + 1,
                },
                properties: { pixelSize: col.width },
                fields: "pixelSize",
              },
            }))),
            // Alternating row colors (banding)
            {
              addBanding: {
                bandedRange: {
                  range: { sheetId: 0, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: 12 },
                  rowProperties: {
                    headerColor: { red: 0.13, green: 0.13, blue: 0.13 },
                    firstBandColor: { red: 1, green: 1, blue: 1 },
                    secondBandColor: { red: 0.96, green: 0.96, blue: 0.96 },
                  },
                },
              },
            },
          ],
        },
      });
    }

    return NextResponse.json({
      success: true,
      yearFolderId,
      spreadsheetId,
      message: `Struktur erstellt: Belege/${year}/Check/, Done/, ${sheetName}`,
    });
  } catch (error) {
    console.error("Init error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
