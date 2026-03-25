/**
 * Rate Limiter
 *
 * Simple in-memory rate limiter for API routes.
 * Tracks request counts per identifier within a time window.
 *
 * IMPORTANT: This is a basic implementation for development/MVP.
 * For production with multiple servers, use Redis or a distributed cache.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

// In-memory store
const store: RateLimitStore = {};

/**
 * Clean up expired entries (garbage collection)
 * Runs automatically when store size exceeds threshold
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  const keys = Object.keys(store);

  // Only cleanup if store has many entries
  if (keys.length < 1000) return;

  for (const key of keys) {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  }
}

/**
 * Check if request should be rate-limited
 *
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param maxRequests - Maximum requests allowed in window
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and optional retry-after seconds
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();

  // Clean up expired entries periodically
  cleanupExpiredEntries();

  // Check if entry exists and is still valid
  if (!store[identifier] || store[identifier].resetAt < now) {
    // Create new entry or reset expired one
    store[identifier] = {
      count: 1,
      resetAt: now + windowMs,
    };
    return { allowed: true };
  }

  // Check if limit exceeded
  if (store[identifier].count >= maxRequests) {
    const retryAfter = Math.ceil((store[identifier].resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment counter
  store[identifier].count++;
  return { allowed: true };
}

/**
 * Get client identifier from request
 * Uses IP address or fallback to a default for development
 *
 * @param request - Next.js request object
 * @returns Identifier string
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (works with most proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for development (not secure for production)
  return "dev-client";
}
