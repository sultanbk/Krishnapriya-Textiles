import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createOrder } from "@/services/order.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
