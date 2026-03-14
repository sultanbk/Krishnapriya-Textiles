import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, stock } = await req.json();

    if (!productId || typeof stock !== "number" || stock < 0) {
      return NextResponse.json(
        { error: "Valid productId and non-negative stock required" },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      select: { stock: true, name: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const oldStock = product.stock;
    const change = stock - oldStock;

    await db.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: { stock },
      });

      if (change !== 0) {
        await tx.inventoryLog.create({
          data: {
            productId,
            change,
            newStock: stock,
            reason: `Manual adjustment: ${oldStock} → ${stock}`,
            performedBy: session.userId,
          },
        });
      }
    });

    return NextResponse.json({ success: true, stock });
  } catch (error: unknown) {
    console.error("Quick stock update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
