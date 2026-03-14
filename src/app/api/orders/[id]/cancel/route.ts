import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * POST /api/orders/[id]/cancel
 * Self-service order cancellation for users.
 * Only PENDING and CONFIRMED orders can be cancelled.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body.reason || "Cancelled by customer";

    // Fetch order and verify ownership
    const order = await db.order.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        orderNumber: true,
        totalAmount: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow cancellation for PENDING or CONFIRMED orders
    const cancellableStatuses = ["PENDING", "CONFIRMED"];
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        {
          error: `Cannot cancel order in "${order.status}" status. Contact support for help.`,
        },
        { status: 400 }
      );
    }

    // Update order status to CANCELLED
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
        customerNote: reason,
      },
    });

    // Restore inventory for each order item
    const orderItems = await db.orderItem.findMany({
      where: { orderId: id },
    });

    for (const item of orderItems) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order #${order.orderNumber} has been cancelled.`,
      order: updatedOrder,
    });
  } catch (error: unknown) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: "Failed to cancel order. Please try again." },
      { status: 500 }
    );
  }
}
