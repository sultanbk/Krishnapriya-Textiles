/**
 * Simple in-memory rate limiter for API routes.
 * For production at scale, use Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Cleanup every minute

export interface RateLimitConfig {
  /** Maximum number of requests in the window */
  limit: number;
  /** Time window in seconds */
  windowSec: number;
}

/**
 * Check if a request should be rate limited.
 * @param identifier - Unique identifier (e.g., IP + route)
 * @param config - Rate limit configuration
 * @returns { limited: boolean, remaining: number, resetIn: number }
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, windowSec: 60 }
) {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Start a new window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowSec * 1000,
    });
    return {
      limited: false,
      remaining: config.limit - 1,
      resetIn: config.windowSec,
    };
  }

  entry.count += 1;

  if (entry.count > config.limit) {
    return {
      limited: true,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  return {
    limited: false,
    remaining: config.limit - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
