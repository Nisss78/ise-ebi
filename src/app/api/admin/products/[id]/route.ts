import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "商品が見つかりません。" },
        { status: 404 }
      );
    }

    if (product.userId !== session.user.id) {
      return NextResponse.json({ error: "権限がありません。" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, price, thumbnailUrl, fileUrl, isActive } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (price !== undefined) {
      const parsedPrice = parseInt(String(price), 10);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { error: "価格は0以上の整数で入力してください。" },
          { status: 400 }
        );
      }
      updateData.price = parsedPrice;
    }
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl || null;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl || null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Products PUT error:", error);
    return NextResponse.json(
      { error: "商品の更新中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "商品が見つかりません。" },
        { status: 404 }
      );
    }

    if (product.userId !== session.user.id) {
      return NextResponse.json({ error: "権限がありません。" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json(
      { error: "商品の削除中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
