import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createOrder } from "@/services/order.service";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 orders per 15 minutes per user
    const { limited } = rateLimit(`order:${session.userId}`, { limit: 10, windowSec: 900 });
    if (limited) {
      return NextResponse.json(
        { error: "Too many orders. Please wait before placing another." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const order = await createOrder(
      session.userId,
      body.addressId,
      body.paymentMethod,
      body.couponCode,
      body.customerNote,
    );

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
