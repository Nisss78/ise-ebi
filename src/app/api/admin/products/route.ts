import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "商品の取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, thumbnailUrl, fileUrl } = body;

    if (!title || price === undefined || price === null) {
      return NextResponse.json(
        { error: "商品名と価格は必須です。" },
        { status: 400 }
      );
    }

    const parsedPrice = parseInt(String(price), 10);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: "価格は0以上の整数で入力してください。" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        userId: session.user.id,
        title,
        description: description || null,
        price: parsedPrice,
        currency: "JPY",
        thumbnailUrl: thumbnailUrl || null,
        fileUrl: fileUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { error: "商品の作成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
