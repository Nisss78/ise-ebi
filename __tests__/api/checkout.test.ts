import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock convex client
const mockQuery = vi.fn();
const mockMutation = vi.fn();
vi.mock("@/lib/convex", () => ({
  getConvexClient: () => ({
    query: mockQuery,
    mutation: mockMutation,
  }),
}));

// Mock stripe
vi.mock("@/lib/stripe", () => ({
  USE_MOCK_PAYMENT: true,
  createMockCheckoutSession: vi.fn(() => ({
    id: "mock_session_123",
    url: "http://localhost/checkout/success?session_id=mock_session_123",
  })),
  getStripe: vi.fn(),
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
vi.mock("../../../../convex/_generated/api", () => ({
  api: {
    products: { getById: "products:getById" },
    orders: { create: "orders:create", updateStatus: "orders:updateStatus" },
    analyticsFns: { track: "analyticsFns:track" },
  },
}));

import { NextRequest } from "next/server";

// Import after mocks
const { POST } = await import("@/app/api/checkout/route");

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid body", async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 for invalid email", async () => {
    const response = await POST(
      createRequest({ productId: "prod_1", buyerEmail: "bad" })
    );
    expect(response.status).toBe(400);
  });

  it("returns 404 when product not found", async () => {
    mockQuery.mockResolvedValueOnce(null);

    const response = await POST(
      createRequest({ productId: "prod_1", buyerEmail: "a@b.com" })
    );
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.code).toBe("NOT_FOUND");
  });

  it("returns 400 when product is inactive", async () => {
    mockQuery.mockResolvedValueOnce({
      _id: "prod_1",
      title: "Test",
      price: 1000,
      currency: "jpy",
      isActive: false,
      userId: "user_1",
    });

    const response = await POST(
      createRequest({ productId: "prod_1", buyerEmail: "a@b.com" })
    );
    expect(response.status).toBe(400);
  });

  it("returns checkout URL on success (mock mode)", async () => {
    mockQuery.mockResolvedValueOnce({
      _id: "prod_1",
      title: "Test Product",
      price: 1000,
      currency: "jpy",
      isActive: true,
      userId: "user_1",
    });
    mockMutation.mockResolvedValueOnce({ _id: "order_1" });
    mockMutation.mockResolvedValue(undefined);

    const response = await POST(
      createRequest({ productId: "prod_1", buyerEmail: "buyer@test.com" })
    );
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.url).toBeTruthy();
  });

  it("returns 402 when order creation fails", async () => {
    mockQuery.mockResolvedValueOnce({
      _id: "prod_1",
      title: "Test",
      price: 1000,
      currency: "jpy",
      isActive: true,
      userId: "user_1",
    });
    mockMutation.mockResolvedValueOnce(null);

    const response = await POST(
      createRequest({ productId: "prod_1", buyerEmail: "a@b.com" })
    );
    expect(response.status).toBe(402);
  });
});
