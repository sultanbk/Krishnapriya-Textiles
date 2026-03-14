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
    const body = await req.json();

    const order = await db.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};

    if (typeof body.trackingNumber === "string") {
      data.trackingNumber = body.trackingNumber.trim() || null;
    }

    if (typeof body.adminNote === "string") {
      data.adminNote = body.adminNote.trim() || null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data to update" }, { status: 400 });
    }

    const updated = await db.order.update({
      where: { id },
      data,
      select: { trackingNumber: true, adminNote: true },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("Update order details error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
