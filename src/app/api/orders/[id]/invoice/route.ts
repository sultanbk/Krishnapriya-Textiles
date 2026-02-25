import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, phone: true, email: true } },
      items: {
        select: {
          productName: true,
          productSku: true,
          price: true,
          quantity: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Only allow admin or the order owner
  if (session.role !== "ADMIN" && session.userId !== order.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shippingAddress = order.shippingAddress as any;

  // Return order data as JSON for client-side PDF generation
  return NextResponse.json({
    orderNumber: order.orderNumber,
    date: order.createdAt.toISOString(),
    customer: {
      name: order.user?.name || shippingAddress?.fullName || "—",
      phone: order.user?.phone || "",
      email: order.user?.email || "",
    },
    shippingAddress: shippingAddress
      ? {
          fullName: shippingAddress.fullName,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || "",
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          phone: shippingAddress.phone,
        }
      : null,
    items: order.items.map((item) => ({
      name: item.productName,
      sku: item.productSku,
      price: item.price.toNumber(),
      quantity: item.quantity,
      total: item.price.toNumber() * item.quantity,
    })),
    subtotal: order.subtotal.toNumber(),
    shippingCharge: order.shippingCharge.toNumber(),
    discount: order.discount.toNumber(),
    totalAmount: order.totalAmount.toNumber(),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    couponCode: order.couponCode,
  });
}
