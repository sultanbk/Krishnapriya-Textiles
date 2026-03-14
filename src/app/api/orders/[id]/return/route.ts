import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

const RETURN_REASONS = [
  "Defective/damaged product",
  "Wrong product received",
  "Product doesn't match description",
  "Quality not as expected",
  "Size/length issue",
  "Color doesn't match",
  "Changed my mind",
  "Other",
];

/**
 * POST /api/orders/[id]/return
 * Request a return for a delivered order.
 * Only DELIVERED orders within 7 days can be returned.
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
    const body = await req.json();
    const { reason, details } = body;

    if (!reason || !RETURN_REASONS.includes(reason)) {
      return NextResponse.json(
        { error: "Please select a valid return reason" },
        { status: 400 }
      );
    }

    // Fetch order and verify ownership
    const order = await db.order.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        orderNumber: true,
        deliveredAt: true,
        createdAt: true,
        totalAmount: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only DELIVERED orders can be returned
    if (order.status !== "DELIVERED") {
      return NextResponse.json(
        { error: "Only delivered orders can be returned" },
        { status: 400 }
      );
    }

    // Check if within return window (7 days from delivery or order creation)
    const deliveryDate = order.deliveredAt || order.createdAt;
    const daysSinceDelivery = Math.floor(
      (Date.now() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDelivery > 7) {
      return NextResponse.json(
        {
          error:
            "Return window has expired. Returns are accepted within 7 days of delivery. Please contact support for assistance.",
        },
        { status: 400 }
      );
    }

    // Create a contact message for the return request (or a dedicated returns table)
    await db.contactMessage.create({
      data: {
        name: "Customer",
        phone: session.phone || "",
        email: null,
        subject: `Return Request - Order #${order.orderNumber}`,
        message: `Return Reason: ${reason}\n${details ? `Details: ${details}\n` : ""}Order Total: ₹${Number(order.totalAmount).toLocaleString("en-IN")}\nDays since delivery: ${daysSinceDelivery}`,
      },
    });

    // Update order note
    await db.order.update({
      where: { id },
      data: {
        customerNote: `RETURN REQUESTED: ${reason}${details ? ` - ${details}` : ""}`,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Return request submitted successfully. Our team will contact you within 24 hours with return instructions.",
    });
  } catch (error: unknown) {
    console.error("Return request error:", error);
    return NextResponse.json(
      { error: "Failed to submit return request. Please try again." },
      { status: 500 }
    );
  }
}
