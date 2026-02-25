import crypto from "crypto";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { PaymentError } from "@/lib/errors";

/**
 * Verify Razorpay payment signature (client-side callback)
 */
export async function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ verified: boolean; orderId: string }> {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new PaymentError("Payment configuration error");

  // Generate expected signature
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new PaymentError("Payment verification failed. Invalid signature.");
  }

  // Update order
  const order = await db.order.findUnique({
    where: { razorpayOrderId },
  });

  if (!order) throw new PaymentError("Order not found for payment");

  // Idempotency check
  if (order.paymentStatus === "PAID") {
    return { verified: true, orderId: order.id };
  }

  await db.order.update({
    where: { id: order.id },
    data: {
      razorpayPaymentId,
      paymentStatus: "PAID",
      status: "CONFIRMED",
      paidAt: new Date(),
    },
  });

  return { verified: true, orderId: order.id };
}

/**
 * Handle Razorpay webhook event
 */
export async function handleWebhookEvent(
  body: string,
  signature: string
): Promise<void> {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) throw new PaymentError("Webhook not configured");

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new PaymentError("Invalid webhook signature");
  }

  const event = JSON.parse(body);
  const eventType = event.event;

  switch (eventType) {
    case "payment.captured": {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      const order = await db.order.findUnique({
        where: { razorpayOrderId },
      });

      if (order && order.paymentStatus !== "PAID") {
        await db.order.update({
          where: { id: order.id },
          data: {
            razorpayPaymentId,
            paymentStatus: "PAID",
            status: "CONFIRMED",
            paidAt: new Date(),
          },
        });
      }
      break;
    }

    case "payment.failed": {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      const order = await db.order.findUnique({
        where: { razorpayOrderId },
      });

      if (order && order.paymentStatus === "PENDING") {
        await db.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "FAILED",
            status: "CANCELLED",
            cancelledAt: new Date(),
            cancelReason: "Payment failed",
          },
        });

        // Restore stock
        const items = await db.orderItem.findMany({
          where: { orderId: order.id },
        });
        for (const item of items) {
          await db.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
      break;
    }
  }
}
