/**
 * Client-side Google Authentication Hook
 *
 * Manages Google OAuth state and provides sign-in/sign-out methods.
 * Session stored in httpOnly cookie, this hook only manages UI state.
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, userEmail, signIn, signOut, loading } = useGoogleAuth();
 * ```
 */

"use client";

import { useState, useEffect } from "react";
import type { GoogleAuthState } from "@/types/google";

export function useGoogleAuth(): GoogleAuthState & {
  signIn: () => void;
  signOut: () => Promise<void>;
} {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check if user is authenticated by calling session API
   */
  async function checkAuthStatus() {
    try {
      const response = await fetch("/api/google/session");

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        setUserEmail(data.email || null);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUserEmail(null);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Redirect to Google OAuth flow
   */
  function signIn() {
    setLoading(true);
    // Redirect to server endpoint that generates auth URL
    window.location.href = "/api/google/signin";
  }

  /**
   * Sign out and revoke access
   */
  async function signOut() {
    setLoading(true);

    try {
      const response = await fetch("/api/google/auth", {
        method: "DELETE",
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUserEmail(null);
      } else {
        throw new Error("Sign out failed");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return {
    isAuthenticated,
    userEmail,
    loading,
    signIn,
    signOut,
  };
}
