import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, USE_MOCK_PAYMENT, createMockCheckoutSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, buyerEmail } = body;

    if (!productId || !buyerEmail) {
      return NextResponse.json(
        { error: "商品IDとメールアドレスは必須です。" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "商品が見つかりません。" },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: "この商品は現在販売停止中です。" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Create a pending Order record first
    const order = await prisma.order.create({
      data: {
        productId: product.id,
        userId: product.userId,
        buyerEmail,
        amount: product.price,
        currency: product.currency,
        status: "pending",
      },
    });

    // モック決済モード
    if (USE_MOCK_PAYMENT) {
      const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`;
      const cancelUrl = `${baseUrl}/checkout/cancel?order_id=${order.id}`;
      
      const session = createMockCheckoutSession(
        order.id,
        product.id,
        buyerEmail,
        product.price,
        successUrl,
        cancelUrl
      );

      // 注文を即座に完了状態にする（モック用）
      await prisma.order.update({
        where: { id: order.id },
        data: {
          stripePaymentId: session.id,
          status: "completed",
        },
      });

      // 分析イベントを記録
      await prisma.analytics.create({
        data: {
          userId: product.userId,
          eventType: "purchase",
          metadata: JSON.stringify({
            orderId: order.id,
            productId: product.id,
            amount: product.price,
            buyerEmail,
          }),
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // 本番Stripe決済
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: buyerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency.toLowerCase(),
            unit_amount: product.price,
            product_data: {
              name: product.title,
              description: product.description || undefined,
              images: product.thumbnailUrl ? [product.thumbnailUrl] : undefined,
            },
          },
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${baseUrl}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
        productId: product.id,
        sellerId: product.userId,
      },
    });

    // Store the Stripe session ID on the order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "決済セッションの作成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
