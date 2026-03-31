import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { analyticsTrackSchema } from "@/lib/validations";
import { checkRateLimit, RATE_LIMITS, getClientIp } from "@/lib/rate-limit";
import { withErrorHandler, ValidationError } from "@/lib/api-error";

export const POST = withErrorHandler(async (request: NextRequest) => {
  const rateLimitResponse = checkRateLimit(
    getClientIp(request),
    "analytics",
    RATE_LIMITS.analytics
  );
  if (rateLimitResponse) return rateLimitResponse;

  const body = await request.json();
  const parsed = analyticsTrackSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues.map((i) => i.message).join(", ")
    );
  }

  const { userId, eventType, metadata } = parsed.data;

  const convex = getConvexClient();

  const result = await convex.mutation(api.analyticsFns.track, {
    userId: userId as Id<"users">,
    eventType,
    metadata: metadata ? JSON.stringify(metadata) : undefined,
  });

  return NextResponse.json({ success: true, id: result.id });
});
