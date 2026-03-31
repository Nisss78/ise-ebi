import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRateLimit, RATE_LIMITS, getClientIp } from "@/lib/rate-limit";

// Disable random cleanup during tests
vi.spyOn(Math, "random").mockReturnValue(0.5);

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Reset stores by using a unique route name per test
  });

  it("allows requests under the limit", () => {
    const route = `test-allow-${Date.now()}`;
    const result = checkRateLimit("ip-1", route, { maxRequests: 5, windowMs: 60_000 });
    expect(result).toBeNull();
  });

  it("blocks requests at the limit", () => {
    const route = `test-block-${Date.now()}`;
    const config = { maxRequests: 3, windowMs: 60_000 };

    for (let i = 0; i < 3; i++) {
      const result = checkRateLimit("ip-block", route, config);
      expect(result).toBeNull();
    }

    const blocked = checkRateLimit("ip-block", route, config);
    expect(blocked).not.toBeNull();
    expect(blocked!.status).toBe(429);
  });

  it("returns Retry-After header when blocked", async () => {
    const route = `test-retry-${Date.now()}`;
    const config = { maxRequests: 1, windowMs: 30_000 };

    checkRateLimit("ip-retry", route, config);
    const blocked = checkRateLimit("ip-retry", route, config);

    expect(blocked).not.toBeNull();
    expect(blocked!.headers.get("Retry-After")).toBe("30");
  });

  it("tracks different identifiers separately", () => {
    const route = `test-separate-${Date.now()}`;
    const config = { maxRequests: 1, windowMs: 60_000 };

    expect(checkRateLimit("ip-a", route, config)).toBeNull();
    expect(checkRateLimit("ip-b", route, config)).toBeNull();

    expect(checkRateLimit("ip-a", route, config)).not.toBeNull();
    expect(checkRateLimit("ip-b", route, config)).not.toBeNull();
  });

  it("tracks different routes separately", () => {
    const routeA = `route-a-${Date.now()}`;
    const routeB = `route-b-${Date.now()}`;
    const config = { maxRequests: 1, windowMs: 60_000 };

    expect(checkRateLimit("ip-same", routeA, config)).toBeNull();
    expect(checkRateLimit("ip-same", routeB, config)).toBeNull();
  });
});

describe("RATE_LIMITS", () => {
  it("has checkout config", () => {
    expect(RATE_LIMITS.checkout).toEqual({ maxRequests: 10, windowMs: 60_000 });
  });

  it("has analytics config", () => {
    expect(RATE_LIMITS.analytics).toEqual({ maxRequests: 30, windowMs: 60_000 });
  });

  it("has aiChat config", () => {
    expect(RATE_LIMITS.aiChat).toEqual({ maxRequests: 5, windowMs: 60_000 });
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(request)).toBe("1.2.3.4");
  });

  it("extracts IP from x-real-ip header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("10.0.0.1");
  });

  it("returns 'unknown' when no IP headers present", () => {
    const request = new Request("http://localhost");
    expect(getClientIp(request)).toBe("unknown");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "1.1.1.1",
        "x-real-ip": "2.2.2.2",
      },
    });
    expect(getClientIp(request)).toBe("1.1.1.1");
  });
});
