/**
 * Budget Sync API Endpoints
 *
 * POST /api/budget/sync — Push current budget + scenarios to Google Sheets
 * GET  /api/budget/sync — Pull budget + scenarios from Google Sheets
 */

import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { GoogleSession } from "@/types/google";
import type { BudgetData, Scenario } from "@/types/budget";
import {
  pushCurrentBudget,
  pushScenarios,
  pullCurrentBudget,
  pullScenarios,
} from "@/lib/google/budget-sheets";

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

interface PushRequest {
  budgetData: BudgetData;
  scenarios: Scenario[];
}

/**
 * POST — Push budget data + scenarios to Google Sheets
 */
export async function POST(request: Request) {
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

    const body: PushRequest = await request.json();
    const { budgetData, scenarios } = body;

    if (!budgetData) {
      return NextResponse.json(
        { success: false, error: "Missing budget data" },
        { status: 400 }
      );
    }

    // Push both in parallel
    await Promise.all([
      pushCurrentBudget(session, budgetData),
      pushScenarios(session, scenarios || []),
    ]);

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Budget sync push error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: `Failed to sync budget: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * GET — Pull budget data + scenarios from Google Sheets
 */
export async function GET() {
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

    // Pull both in parallel
    const [budgetData, scenarios] = await Promise.all([
      pullCurrentBudget(session),
      pullScenarios(session),
    ]);

    return NextResponse.json({
      success: true,
      budgetData,
      scenarios,
    });
  } catch (error) {
    console.error("Budget sync pull error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: `Failed to pull budget: ${errorMessage}` },
      { status: 500 }
    );
  }
}
