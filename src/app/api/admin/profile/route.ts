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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        themeColor: true,
        themeName: true,
        twitterUrl: true,
        instagramUrl: true,
        youtubeUrl: true,
        tiktokUrl: true,
        websiteUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/admin/profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const {
      name,
      bio,
      avatarUrl,
      themeColor,
      themeName,
      twitterUrl,
      instagramUrl,
      youtubeUrl,
      tiktokUrl,
      websiteUrl,
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name ?? undefined,
        bio: bio ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        themeColor: themeColor ?? undefined,
        themeName: themeName ?? undefined,
        twitterUrl: twitterUrl ?? undefined,
        instagramUrl: instagramUrl ?? undefined,
        youtubeUrl: youtubeUrl ?? undefined,
        tiktokUrl: tiktokUrl ?? undefined,
        websiteUrl: websiteUrl ?? undefined,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        themeColor: true,
        themeName: true,
        twitterUrl: true,
        instagramUrl: true,
        youtubeUrl: true,
        tiktokUrl: true,
        websiteUrl: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /api/admin/profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
