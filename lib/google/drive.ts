/**
 * Google Drive Integration
 *
 * Handles receipt storage in Google Drive:
 * - Create folder structure: Trautes Heim/Belege/YYYY/
 * - Subfolders: Check/ (to review), Done/ (confirmed)
 * - Upload confirmed receipt images directly to Done/
 * - Generate shareable links
 *
 * Folder Structure:
 * Trautes Heim (1brNFgQDbX2sF4Hhg-ieMKnmFk-vRmqNq)
 * └── Belege/
 *     └── 2026/
 *         ├── Check/                    ← To review
 *         ├── Done/                     ← Confirmed receipts
 *         └── 2026-Belege.xlsx
 */

import { google, drive_v3 } from "googleapis";
import { Readable } from "stream";
import type { GoogleSession } from "@/types/google";

/**
 * Get parent folder ID from environment variables
 * Throws if not configured
 */
function getParentFolderId(): string {
  const folderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
  if (!folderId) {
    throw new Error(
      "GOOGLE_DRIVE_PARENT_FOLDER_ID must be set in environment variables"
    );
  }
  return folderId;
}

/**
 * Create Drive API client with user session
 */
function getDriveClient(session: GoogleSession): drive_v3.Drive {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  return google.drive({ version: "v3", auth: oauth2Client });
}

/**
 * Find or create a folder in Drive
 *
 * @param drive - Drive API client
 * @param name - Folder name
 * @param parentId - Parent folder ID
 * @returns Folder ID
 */
async function findOrCreateFolder(
  drive: drive_v3.Drive,
  name: string,
  parentId: string
): Promise<string> {
  // Search for existing folder
  const query = `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;

  const searchResponse = await drive.files.list({
    q: query,
    fields: "files(id, name)",
    spaces: "drive",
  });

  if (searchResponse.data.files && searchResponse.data.files.length > 0) {
    return searchResponse.data.files[0].id!;
  }

  // Create new folder
  const createResponse = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });

  return createResponse.data.id!;
}

/**
 * Initialize folder structure in "Trautes Heim"
 * Creates: Belege/
 *
 * @param session - User's Google session
 * @returns Object with belegeId
 */
export async function initializeFolderStructure(session: GoogleSession): Promise<{
  belegeId: string;
}> {
  const drive = getDriveClient(session);
  const parentFolderId = getParentFolderId();

  const belegeId = await findOrCreateFolder(drive, "Belege", parentFolderId);

  return { belegeId };
}

/**
 * Get or create the YYYY folder under Belege/
 * Also ensures Check/ and Done/ subfolders exist.
 * Returns the YYYY folder ID (parent of Check/ and Done/).
 *
 * @param session - User's Google session
 * @param date - Receipt date (ISO format YYYY-MM-DD)
 * @returns YYYY folder ID
 */
export async function getYearFolderId(
  session: GoogleSession,
  date: string
): Promise<string> {
  const drive = getDriveClient(session);
  const [year] = date.split("-");

  // Get Belege folder
  const { belegeId } = await initializeFolderStructure(session);

  // Get or create year folder: Belege/YYYY/
  const yearFolderId = await findOrCreateFolder(drive, year, belegeId);

  // Ensure Check/ and Done/ subfolders exist
  await findOrCreateFolder(drive, "Check", yearFolderId);
  await findOrCreateFolder(drive, "Done", yearFolderId);

  return yearFolderId;
}

/**
 * Get or create the Done/ folder for a given year
 * Path: Belege/YYYY/Done/
 *
 * @param session - User's Google session
 * @param date - Receipt date (ISO format YYYY-MM-DD)
 * @returns Done/ folder ID
 */
export async function getYearDoneFolder(
  session: GoogleSession,
  date: string
): Promise<string> {
  const drive = getDriveClient(session);

  // Ensure year folder and subfolders exist
  const yearFolderId = await getYearFolderId(session, date);

  // Return the Done/ folder ID
  return findOrCreateFolder(drive, "Done", yearFolderId);
}

/**
 * Get or create the Check/ folder for a given year
 * Path: Belege/YYYY/Check/
 *
 * @param session - User's Google session
 * @param date - Receipt date (ISO format YYYY-MM-DD)
 * @returns Check/ folder ID
 */
export async function getYearCheckFolder(
  session: GoogleSession,
  date: string
): Promise<string> {
  const drive = getDriveClient(session);

  // Ensure year folder and subfolders exist
  const yearFolderId = await getYearFolderId(session, date);

  // Return the Check/ folder ID
  return findOrCreateFolder(drive, "Check", yearFolderId);
}

/**
 * Upload receipt image to Drive
 * Uploads directly to the Done/ folder for confirmed receipts.
 *
 * @param session - User's Google session
 * @param imageBase64 - Base64-encoded image data (with data:image/... prefix)
 * @param filename - File name (e.g., "2026-03-16_REWE_45.67.jpg")
 * @param date - Receipt date (for folder organization)
 * @returns Object with fileId and webViewLink
 */
export async function uploadReceiptImage(
  session: GoogleSession,
  imageBase64: string,
  filename: string,
  date: string
): Promise<{
  fileId: string;
  webViewLink: string;
}> {
  const drive = getDriveClient(session);

  // Get Done/ folder for confirmed receipts
  const doneFolderId = await getYearDoneFolder(session, date);

  // Extract base64 data and mime type
  const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid base64 image format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  // Convert buffer to stream for googleapis
  const stream = Readable.from(buffer);

  // Upload file
  const response = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [doneFolderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: "id, webViewLink",
  });

  if (!response.data.id || !response.data.webViewLink) {
    throw new Error("Failed to upload file to Drive");
  }

  return {
    fileId: response.data.id,
    webViewLink: response.data.webViewLink,
  };
}

/**
 * Delete receipt image from Drive
 *
 * @param session - User's Google session
 * @param fileId - Drive file ID
 */
export async function deleteReceiptImage(
  session: GoogleSession,
  fileId: string
): Promise<void> {
  const drive = getDriveClient(session);

  await drive.files.delete({
    fileId,
  });
}

/**
 * Generate filename for receipt
 * Format: YYYY-MM-DD_MerchantName_Amount.ext
 *
 * @param date - Receipt date (ISO format)
 * @param merchantName - Merchant name
 * @param amount - Total amount in cents
 * @param mimeType - Image MIME type
 * @returns Filename string
 */
export function generateReceiptFilename(
  date: string,
  merchantName: string,
  amount: number,
  mimeType: string
): string {
  // Sanitize merchant name (remove special chars)
  const sanitized = merchantName.replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, "_");

  // Format amount (convert cents to euros)
  const euros = (amount / 100).toFixed(2);

  // Get file extension from MIME type
  const ext = mimeType.split("/")[1] || "jpg";

  return `${date}_${sanitized}_${euros}.${ext}`;
}
