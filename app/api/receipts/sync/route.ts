/**
 * Receipt Sync API Endpoints
 *
 * POST /api/receipts/sync — Push receipt to Google Drive + Sheets
 * GET  /api/receipts/sync?year=2026 — Pull all receipts from yearly Sheet
 * PATCH /api/receipts/sync — Update a single row in the Sheet
 */

import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { GoogleSession } from "@/types/google";
import type { Receipt } from "@/types/receipt";
import {
  uploadReceiptImage,
  generateReceiptFilename,
  initializeFolderStructure,
} from "@/lib/google/drive";
import {
  appendReceiptToSheet,
  getYearFolderIdFromDate,
  readAllReceipts,
  updateReceiptRow,
} from "@/lib/google/sheets";
import { checkRateLimit, getClientIdentifier } from "@/lib/security/rate-limiter";

// Vercel serverless function timeout (default 10s, max 60s on Hobby)
export const maxDuration = 60;

// Session configuration (must match auth routes)
const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "google_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 14, // 14 days
  },
};

interface SyncRequest {
  receipt: Receipt;
  imageBase64?: string;
  metadataOnly?: boolean;
}

interface SyncResponse {
  success: boolean;
  driveFileId?: string;
  driveFileUrl?: string;
  sheetRowNumber?: number;
  sheetId?: string;
  syncedAt?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SyncResponse>> {
  try {
    // Get session
    const session = await getIronSession<GoogleSession>(
      await cookies(),
      sessionOptions
    );

    // Check authentication
    if (!session.accessToken) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Rate limiting: 20 requests per 5 minutes per client
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId, 20, 5 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many sync requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 60),
          },
        }
      );
    }

    // Parse request body
    const body: SyncRequest = await request.json();
    const { receipt, imageBase64, metadataOnly } = body;

    if (!receipt) {
      return NextResponse.json(
        { success: false, error: "Missing receipt data" },
        { status: 400 }
      );
    }

    if (!metadataOnly && !imageBase64) {
      return NextResponse.json(
        { success: false, error: "Missing image data" },
        { status: 400 }
      );
    }

    // Idempotency check - prevent duplicate uploads
    if (receipt.driveFileId && receipt.sheetRowNumber) {
      console.log('[Sync] Receipt already synced, returning existing metadata');
      return NextResponse.json({
        success: true,
        driveFileId: receipt.driveFileId,
        driveFileUrl: receipt.driveFileUrl,
        sheetRowNumber: receipt.sheetRowNumber,
        syncedAt: receipt.syncedAt || new Date().toISOString(),
      });
    }

    // Initialize folder structure (creates folders if needed)
    await initializeFolderStructure(session);

    let fileId = "";
    let webViewLink = "";

    if (imageBase64 && !metadataOnly) {
      // Full sync: upload image to Drive
      const mimeTypeMatch = imageBase64.match(/^data:([^;]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";

      const filename = generateReceiptFilename(
        receipt.date,
        receipt.merchantName,
        receipt.totalAmount,
        mimeType
      );

      const uploadResult = await uploadReceiptImage(
        session,
        imageBase64,
        filename,
        receipt.date
      );
      fileId = uploadResult.fileId;
      webViewLink = uploadResult.webViewLink;
    }

    // Get year folder ID
    const yearFolderId = await getYearFolderIdFromDate(session, receipt.date);

    // Append to Google Sheets
    const { rowNumber, spreadsheetId } = await appendReceiptToSheet(
      session,
      receipt,
      webViewLink,
      yearFolderId
    );

    const syncedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      driveFileId: fileId || `metadata_${Date.now()}`,
      driveFileUrl: webViewLink || undefined,
      sheetRowNumber: rowNumber,
      sheetId: spreadsheetId,
      syncedAt,
    });
  } catch (error) {
    console.error("Receipt sync error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        error: `Failed to sync receipt: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/receipts/sync?year=2026
 * Pull all receipts from the yearly Google Sheet
 */
export async function GET(request: NextRequest) {
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

    const year = request.nextUrl.searchParams.get("year") || String(new Date().getFullYear());

    // Get year folder
    const yearFolderId = await getYearFolderIdFromDate(session, `${year}-01-01`);

    // Read all receipts from Sheet
    const result = await readAllReceipts(session, yearFolderId, year);

    if (!result) {
      return NextResponse.json({
        success: true,
        rows: [],
        spreadsheetId: null,
      });
    }

    return NextResponse.json({
      success: true,
      rows: result.rows,
      spreadsheetId: result.spreadsheetId,
    });
  } catch (error) {
    console.error("Receipt pull error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: `Failed to pull receipts: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/receipts/sync
 * Update a single row in the Google Sheet
 */
export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { receipt, spreadsheetId, rowNumber, driveLink } = body as {
      receipt: Receipt;
      spreadsheetId: string;
      rowNumber: number;
      driveLink: string;
    };

    if (!receipt || !spreadsheetId || !rowNumber) {
      return NextResponse.json(
        { success: false, error: "Missing receipt, spreadsheetId, or rowNumber" },
        { status: 400 }
      );
    }

    await updateReceiptRow(
      session,
      spreadsheetId,
      rowNumber,
      receipt,
      driveLink || ""
    );

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Receipt update error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: `Failed to update receipt: ${errorMessage}` },
      { status: 500 }
    );
  }
}
