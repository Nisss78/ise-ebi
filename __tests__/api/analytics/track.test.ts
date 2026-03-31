import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock convex client
const mockMutation = vi.fn();
vi.mock("@/lib/convex", () => ({
  getConvexClient: () => ({
    mutation: mockMutation,
  }),
}));

// Mock rate limit to always allow
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => null),
  RATE_LIMITS: {
    checkout: { maxRequests: 10, windowMs: 60_000 },
    analytics: { maxRequests: 30, windowMs: 60_000 },
    aiChat: { maxRequests: 5, windowMs: 60_000 },
  },
  getClientIp: vi.fn(() => "127.0.0.1"),
}));

// Mock convex generated API
vi.mock("../../../../../convex/_generated/api", () => ({
  api: {
    analyticsFns: { track: "analyticsFns:track" },
  },
}));

import { NextRequest } from "next/server";

const { POST } = await import("@/app/api/analytics/track/route");

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/analytics/track", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/analytics/track", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid body", async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 for missing userId", async () => {
    const response = await POST(
      createRequest({ eventType: "page_view" })
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for missing eventType", async () => {
    const response = await POST(
      createRequest({ userId: "user_1" })
    );
    expect(response.status).toBe(400);
  });

  it("tracks event successfully", async () => {
    mockMutation.mockResolvedValueOnce({ id: "event_1" });

    const response = await POST(
      createRequest({
        userId: "user_1",
        eventType: "page_view",
      })
    );
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.id).toBe("event_1");
  });

  it("tracks event with metadata", async () => {
    mockMutation.mockResolvedValueOnce({ id: "event_2" });

    const response = await POST(
      createRequest({
        userId: "user_1",
        eventType: "purchase",
        metadata: { productId: "prod_1", amount: 1000 },
      })
    );
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);

    // Verify mutation was called with stringified metadata
    const [, args] = mockMutation.mock.calls[0];
    expect(args.userId).toBe("user_1");
    expect(args.eventType).toBe("purchase");
    expect(args.metadata).toBe(JSON.stringify({ productId: "prod_1", amount: 1000 }));
  });

  it("passes undefined metadata when not provided", async () => {
    mockMutation.mockResolvedValueOnce({ id: "event_3" });

    await POST(
      createRequest({
        userId: "user_1",
        eventType: "click",
      })
    );

    const [, args] = mockMutation.mock.calls[0];
    expect(args.userId).toBe("user_1");
    expect(args.eventType).toBe("click");
    expect(args.metadata).toBeUndefined();
  });
});
