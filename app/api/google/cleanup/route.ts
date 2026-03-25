/**
 * Google Drive Cleanup API
 *
 * DELETE /api/google/cleanup
 * Removes all contents inside the Belege/ folder (test data, old structures).
 * The Belege/ folder itself is kept. New structure is auto-created on first upload.
 *
 * ONE-TIME USE — remove this route after cleanup.
 */

import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { google } from "googleapis";
import type { GoogleSession } from "@/types/google";

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

export async function DELETE() {
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

    const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
    if (!parentFolderId) {
      return NextResponse.json(
        { success: false, error: "GOOGLE_DRIVE_PARENT_FOLDER_ID not set" },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Find Belege folder
    const belegeResponse = await drive.files.list({
      q: `name='Belege' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    const belegeFolder = belegeResponse.data.files?.[0];
    if (!belegeFolder?.id) {
      return NextResponse.json({
        success: true,
        message: "No Belege folder found — nothing to clean",
        deleted: 0,
      });
    }

    // List ALL files/folders inside Belege/
    const contents = await drive.files.list({
      q: `'${belegeFolder.id}' in parents and trashed=false`,
      fields: "files(id, name, mimeType)",
      pageSize: 100,
    });

    const files = contents.data.files || [];
    let deleted = 0;

    // Also find Archiv folder at parent level
    const archivResponse = await drive.files.list({
      q: `name='Archiv' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    const archivFolder = archivResponse.data.files?.[0];

    // Delete everything inside Belege/
    for (const file of files) {
      if (file.id) {
        await drive.files.delete({ fileId: file.id });
        deleted++;
        console.log(`[Cleanup] Deleted: ${file.name} (${file.mimeType})`);
      }
    }

    // Delete Archiv folder if it exists
    if (archivFolder?.id) {
      await drive.files.delete({ fileId: archivFolder.id });
      deleted++;
      console.log(`[Cleanup] Deleted: Archiv folder`);
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deleted} items. Belege/ folder kept (empty).`,
      deleted,
      items: files.map((f) => f.name),
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
