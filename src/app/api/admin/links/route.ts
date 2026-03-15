import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("GET /api/admin/links error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, url, icon, isActive } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    // Get the highest order value to append at the end
    const lastLink = await prisma.link.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastLink ? lastLink.order + 1 : 0;

    const link = await prisma.link.create({
      data: {
        userId: session.user.id,
        title,
        url,
        icon: icon ?? null,
        isActive: isActive ?? true,
        order: newOrder,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/links error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
