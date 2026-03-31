import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Stripe from "stripe";
import { withErrorHandler, ValidationError, AppError } from "@/lib/api-error";

export const runtime = "nodejs";

export const POST = withErrorHandler(async (request: NextRequest) => {
  const stripe = getStripe();
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    throw new ValidationError("Stripe署名ヘッダーがありません。");
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new AppError(
      "WEBHOOK_CONFIG_ERROR",
      "Webhookシークレットが設定されていません。",
      500,
      false
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    throw new ValidationError("Webhook署名の検証に失敗しました。");
  }

  const convex = getConvexClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("No orderId in session metadata:", session.id);
        break;
      }

      await convex.mutation(api.orders.updateStatus, {
        id: orderId as Id<"orders">,
        status: "completed",
        stripePaymentId: (session.payment_intent as string) ?? session.id,
      });

      console.log(`Order ${orderId} marked as completed.`);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await convex.mutation(api.orders.updateStatus, {
          id: orderId as Id<"orders">,
          status: "expired",
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
});
