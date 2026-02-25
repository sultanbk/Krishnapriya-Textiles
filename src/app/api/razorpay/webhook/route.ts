import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { handleWebhookEvent } from "@/services/payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    await handleWebhookEvent(body, signature);

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    // Always return 200 to prevent retries for handled errors
    return NextResponse.json({ status: "error", message: error.message });
  }
}
