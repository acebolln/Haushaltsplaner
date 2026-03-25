/**
 * Google OAuth Callback Handler
 *
 * GET /api/google/auth
 * - Handles OAuth callback with authorization code
 * - Exchanges code for tokens
 * - Saves session to encrypted cookie via iron-session
 * - Redirects to dashboard
 *
 * DELETE /api/google/auth
 * - Revokes Google access
 * - Clears session cookie
 */

import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { exchangeCodeForTokens, revokeAccess } from "@/lib/google/auth";
import type { GoogleSession } from "@/types/google";
import { google } from "googleapis";
import { checkRateLimit, getClientIdentifier } from "@/lib/security/rate-limiter";

// Session configuration for iron-session
const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "google_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true, // XSS protection
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

/**
 * GET handler - OAuth callback
 * Query params: ?code=... (from Google)
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 5 requests per hour per client (prevent OAuth abuse)
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(clientId, 5, 60 * 60 * 1000);

  if (!rateLimit.allowed) {
    return NextResponse.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent("Too many authentication attempts. Please try again later.")}`,
        request.url
      )
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle OAuth errors (user denied consent, etc.)
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent("Google authentication failed")}`,
        request.url
      )
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  try {
    // Exchange code for tokens
    const tokenData = await exchangeCodeForTokens(code);

    // Get user email
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: tokenData.access_token });
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    if (!userInfo.data.email) {
      throw new Error("Could not retrieve user email from Google");
    }

    // Store session in encrypted cookie
    const cookieStore = await cookies();
    const session = await getIronSession<GoogleSession>(
      cookieStore,
      sessionOptions
    );

    session.accessToken = tokenData.access_token;
    session.refreshToken = tokenData.refresh_token || "";
    session.expiresAt = tokenData.expiry_date;
    session.email = userInfo.data.email;

    await session.save();

    // Redirect to dashboard
    return NextResponse.redirect(
      new URL("/dashboard?google_auth=success", request.url)
    );
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    return NextResponse.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent("Failed to authenticate with Google")}`,
        request.url
      )
    );
  }
}

/**
 * DELETE handler - Sign out
 * Revokes access and clears session cookie
 */
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<GoogleSession>(
      cookieStore,
      sessionOptions
    );

    // Revoke access token if exists
    if (session.accessToken) {
      await revokeAccess(session.accessToken);
    }

    // Clear session
    session.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
}
