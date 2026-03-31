import { describe, it, expect, vi } from "vitest";
import {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  PaymentError,
  withErrorHandler,
} from "@/lib/api-error";
import { NextRequest } from "next/server";

describe("AppError", () => {
  it("sets all properties correctly", () => {
    const error = new AppError("TEST_CODE", "test message", 418);
    expect(error.code).toBe("TEST_CODE");
    expect(error.message).toBe("test message");
    expect(error.statusCode).toBe(418);
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe("AppError");
    expect(error).toBeInstanceOf(Error);
  });

  it("defaults isOperational to true", () => {
    const error = new AppError("CODE", "msg", 500);
    expect(error.isOperational).toBe(true);
  });

  it("allows isOperational to be set to false", () => {
    const error = new AppError("CODE", "msg", 500, false);
    expect(error.isOperational).toBe(false);
  });
});

describe("ValidationError", () => {
  it("has correct code and status", () => {
    const error = new ValidationError("invalid input");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("ValidationError");
    expect(error.message).toBe("invalid input");
  });
});

describe("AuthenticationError", () => {
  it("has correct defaults", () => {
    const error = new AuthenticationError();
    expect(error.code).toBe("AUTHENTICATION_ERROR");
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe("AuthenticationError");
    expect(error.message).toBe("認証が必要です。");
  });

  it("accepts custom message", () => {
    const error = new AuthenticationError("custom auth error");
    expect(error.message).toBe("custom auth error");
  });
});

describe("NotFoundError", () => {
  it("has correct defaults", () => {
    const error = new NotFoundError();
    expect(error.code).toBe("NOT_FOUND");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("NotFoundError");
  });
});

describe("RateLimitError", () => {
  it("has correct defaults", () => {
    const error = new RateLimitError();
    expect(error.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(error.statusCode).toBe(429);
    expect(error.name).toBe("RateLimitError");
  });
});

describe("PaymentError", () => {
  it("has correct defaults", () => {
    const error = new PaymentError();
    expect(error.code).toBe("PAYMENT_ERROR");
    expect(error.statusCode).toBe(402);
    expect(error.name).toBe("PaymentError");
  });
});

describe("withErrorHandler", () => {
  function createMockRequest(): NextRequest {
    return new NextRequest("http://localhost/api/test", { method: "POST" });
  }

  it("returns handler response with x-request-id header on success", async () => {
    const handler = withErrorHandler(async () => {
      const { NextResponse } = await import("next/server");
      return NextResponse.json({ ok: true });
    });

    const response = await handler(createMockRequest());
    expect(response.status).toBe(200);
    expect(response.headers.get("x-request-id")).toBeTruthy();

    const body = await response.json();
    expect(body.ok).toBe(true);
  });

  it("returns structured error for AppError", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const handler = withErrorHandler(async () => {
      throw new ValidationError("bad input");
    });

    const response = await handler(createMockRequest());
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("bad input");
    expect(body.code).toBe("VALIDATION_ERROR");
    expect(body.requestId).toBeTruthy();

    vi.restoreAllMocks();
  });

  it("returns 500 for unknown errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const handler = withErrorHandler(async () => {
      throw new Error("unexpected");
    });

    const response = await handler(createMockRequest());
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(body.requestId).toBeTruthy();

    vi.restoreAllMocks();
  });

  it("returns 404 for NotFoundError", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const handler = withErrorHandler(async () => {
      throw new NotFoundError();
    });

    const response = await handler(createMockRequest());
    expect(response.status).toBe(404);

    vi.restoreAllMocks();
  });
});
