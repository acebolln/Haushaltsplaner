/**
 * Google Session Check API
 *
 * GET /api/google/session
 * Returns current Google authentication status from session cookie
 */

import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { GoogleSession } from "@/types/google";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "google_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<GoogleSession>(
      cookieStore,
      sessionOptions
    );

    // Check if session exists and token hasn't expired
    const isAuthenticated =
      !!session.accessToken && session.expiresAt > Date.now();

    return NextResponse.json({
      authenticated: isAuthenticated,
      email: isAuthenticated ? session.email : null,
    });
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json({
      authenticated: false,
      email: null,
    });
  }
}
