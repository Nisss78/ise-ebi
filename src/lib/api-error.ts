import { NextRequest, NextResponse } from "next/server";

// --- Error Classes ---

export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    isOperational = true
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message, 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "認証が必要です。") {
    super("AUTHENTICATION_ERROR", message, 401);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "リソースが見つかりません。") {
    super("NOT_FOUND", message, 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "リクエストが多すぎます。しばらくしてから再試行してください。") {
    super("RATE_LIMIT_EXCEEDED", message, 429);
    this.name = "RateLimitError";
  }
}

export class PaymentError extends AppError {
  constructor(message = "決済処理中にエラーが発生しました。") {
    super("PAYMENT_ERROR", message, 402);
    this.name = "PaymentError";
  }
}

// --- Structured Logger ---

interface StructuredLog {
  readonly timestamp: string;
  readonly requestId: string;
  readonly level: "error" | "warn" | "info";
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly statusCode: number;
    readonly isOperational: boolean;
  };
  readonly stack?: string;
}

function logStructuredError(requestId: string, error: unknown): void {
  const isAppError = error instanceof AppError;

  const log: StructuredLog = {
    timestamp: new Date().toISOString(),
    requestId,
    level: isAppError && error.isOperational ? "warn" : "error",
    error: {
      code: isAppError ? error.code : "INTERNAL_ERROR",
      message: error instanceof Error ? error.message : String(error),
      statusCode: isAppError ? error.statusCode : 500,
      isOperational: isAppError ? error.isOperational : false,
    },
    stack: error instanceof Error ? error.stack : undefined,
  };

  if (log.level === "error") {
    console.error(JSON.stringify(log));
  } else {
    console.warn(JSON.stringify(log));
  }
}

// --- withErrorHandler HOF ---

type RouteHandler = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const requestId = crypto.randomUUID();

    try {
      const response = await handler(request, context);
      response.headers.set("x-request-id", requestId);
      return response;
    } catch (error) {
      logStructuredError(requestId, error);

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            error: error.message,
            code: error.code,
            requestId,
          },
          {
            status: error.statusCode,
            headers: { "x-request-id": requestId },
          }
        );
      }

      return NextResponse.json(
        {
          error: "内部サーバーエラーが発生しました。",
          code: "INTERNAL_ERROR",
          requestId,
        },
        {
          status: 500,
          headers: { "x-request-id": requestId },
        }
      );
    }
  };
}
