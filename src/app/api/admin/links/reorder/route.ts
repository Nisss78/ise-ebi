import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ReorderItem {
  id: string;
  order: number;
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const items: ReorderItem[] = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Expected an array of {id, order}" },
        { status: 400 }
      );
    }

    // Verify all links belong to the current user
    const ids = items.map((item) => item.id);
    const links = await prisma.link.findMany({
      where: { id: { in: ids } },
      select: { id: true, userId: true },
    });

    const unauthorized = links.some((l: { id: string; userId: string }) => l.userId !== session.user.id);
    if (unauthorized || links.length !== ids.length) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update all orders in a transaction
    await prisma.$transaction(
      items.map(({ id, order }) =>
        prisma.link.update({
          where: { id },
          data: { order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/links/reorder error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
