import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const order = await db.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If cancelling, restore stock
    if (status === "CANCELLED" && order.status !== "CANCELLED") {
      const orderItems = await db.orderItem.findMany({
        where: { orderId: id },
      });

      await db.$transaction(async (tx) => {
        await tx.order.update({
          where: { id },
          data: { status },
        });

        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      });
    } else {
      await db.order.update({
        where: { id },
        data: { status },
      });
    }

    // If delivered and COD, mark as paid
    if (status === "DELIVERED" && order.paymentMethod === "COD") {
      await db.order.update({
        where: { id },
        data: { paymentStatus: "PAID" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
