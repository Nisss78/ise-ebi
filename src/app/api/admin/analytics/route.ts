import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [pageViewCount, linkClickCount, completedOrders, recentEvents] =
    await Promise.all([
      prisma.analytics.count({
        where: { userId: user.id, eventType: "page_view" },
      }),
      prisma.analytics.count({
        where: { userId: user.id, eventType: "link_click" },
      }),
      prisma.order.findMany({
        where: { userId: user.id, status: "completed" },
        select: { amount: true },
      }),
      prisma.analytics.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          eventType: true,
          metadata: true,
          createdAt: true,
        },
      }),
    ]);

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  return NextResponse.json({
    counts: {
      pageViews: pageViewCount,
      linkClicks: linkClickCount,
      orders: completedOrders.length,
    },
    totalRevenue,
    recentEvents,
  });
}
