import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, eventType, metadata } = body;

    if (!userId || !eventType) {
      return NextResponse.json(
        { error: "userId and eventType are required" },
        { status: 400 }
      );
    }

    const event = await prisma.analytics.create({
      data: {
        userId,
        eventType,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ success: true, id: event.id });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
