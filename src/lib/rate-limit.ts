import { NextResponse } from "next/server";

interface SlidingWindowEntry {
  readonly timestamps: readonly number[];
}

interface RateLimitConfig {
  readonly maxRequests: number;
  readonly windowMs: number;
}

const stores = new Map<string, Map<string, SlidingWindowEntry>>();

function getStore(route: string): Map<string, SlidingWindowEntry> {
  const existing = stores.get(route);
  if (existing) return existing;

  const store = new Map<string, SlidingWindowEntry>();
  stores.set(route, store);
  return store;
}

function cleanupOldEntries(store: Map<string, SlidingWindowEntry>, windowMs: number): void {
  const now = Date.now();
  const keys = Array.from(store.keys());
  for (const key of keys) {
    const entry = store.get(key)!;
    const valid = entry.timestamps.filter((t) => now - t < windowMs);
    if (valid.length === 0) {
      store.delete(key);
    } else {
      store.set(key, { timestamps: valid });
    }
  }
}

export function checkRateLimit(
  identifier: string,
  route: string,
  config: RateLimitConfig
): NextResponse | null {
  const store = getStore(route);
  const now = Date.now();

  // Periodic cleanup (every 100th check)
  if (Math.random() < 0.01) {
    cleanupOldEntries(store, config.windowMs);
  }

  const entry = store.get(identifier);
  const timestamps = entry
    ? entry.timestamps.filter((t) => now - t < config.windowMs)
    : [];

  if (timestamps.length >= config.maxRequests) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(config.windowMs / 1000)),
        },
      }
    );
  }

  store.set(identifier, { timestamps: [...timestamps, now] });
  return null;
}

// Pre-configured rate limits
export const RATE_LIMITS = {
  checkout: { maxRequests: 10, windowMs: 60_000 } as const,
  analytics: { maxRequests: 30, windowMs: 60_000 } as const,
  aiChat: { maxRequests: 5, windowMs: 60_000 } as const,
} as const;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
