/**
 * Google OAuth Authentication Library
 *
 * Handles OAuth 2.0 flow with Google:
 * - Generate OAuth URL with drive.file and spreadsheets scopes
 * - Exchange authorization code for tokens
 * - Auto-refresh expired access tokens
 *
 * Uses googleapis library for OAuth client management.
 *
 * TEST CHECKLIST:
 * [ ] Environment variables added to .env.local
 * [ ] Dependencies installed (googleapis, iron-session)
 * [ ] OAuth URL generated correctly with scopes
 * [ ] Callback handles code exchange
 * [ ] Session stored in encrypted cookie
 * [ ] Sign-in button triggers OAuth flow
 * [ ] User email displayed after auth
 * [ ] Disconnect clears session
 * [ ] TypeScript compiles without errors
 */

import { google } from "googleapis";
import type { GoogleTokenResponse } from "@/types/google";

// OAuth Scopes
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file", // Create/edit files in Drive
  "https://www.googleapis.com/auth/spreadsheets", // Create/edit spreadsheets
  "https://www.googleapis.com/auth/userinfo.email", // Get user email
];

/**
 * Create OAuth2 client with credentials from environment
 */
function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing Google OAuth credentials. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI in .env"
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generate Google OAuth authorization URL
 * User is redirected here to consent to app permissions
 *
 * @returns OAuth URL string
 */
export function getAuthUrl(): string {
  const oauth2Client = getOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline", // Request refresh token
    scope: SCOPES,
    prompt: "consent", // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for access + refresh tokens
 * Called after user returns from Google consent screen
 *
 * @param code - Authorization code from OAuth callback
 * @returns Token data with access_token, refresh_token, expiry_date
 */
export async function exchangeCodeForTokens(
  code: string
): Promise<GoogleTokenResponse> {
  const oauth2Client = getOAuth2Client();

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      throw new Error("No access token received from Google");
    }

    // Get user email using the access token
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || undefined,
      expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000, // 1 hour default
      token_type: tokens.token_type || "Bearer",
      scope: tokens.scope || SCOPES.join(" "),
    };
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    throw new Error("Failed to exchange authorization code for tokens");
  }
}

/**
 * Refresh an expired access token using refresh token
 * Called automatically when access token expires
 *
 * @param refreshToken - Long-lived refresh token from initial OAuth flow
 * @returns New access token and updated expiry
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresAt: number;
}> {
  const oauth2Client = getOAuth2Client();

  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error("No access token received during refresh");
    }

    return {
      accessToken: credentials.access_token,
      expiresAt: credentials.expiry_date || Date.now() + 3600 * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token. User may need to re-authenticate.");
  }
}

/**
 * Revoke Google OAuth access (sign out)
 *
 * @param accessToken - Current access token to revoke
 */
export async function revokeAccess(accessToken: string): Promise<void> {
  const oauth2Client = getOAuth2Client();

  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    await oauth2Client.revokeCredentials();
  } catch (error) {
    console.error("Error revoking access token:", error);
    // Don't throw - session will be cleared anyway
  }
}
