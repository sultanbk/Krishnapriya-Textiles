import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * POST /api/cart/sync
 * Sync client-side cart items to the database cart before checkout.
 * Expects: { items: [{ productId, quantity }] }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items to sync" }, { status: 400 });
    }

    // Get or create a cart for the user
    let cart = await db.cart.findUnique({
      where: { userId: session.userId },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: session.userId },
      });
    }

    // Replace all existing cart items with the synced items
    await db.$transaction(async (tx) => {
      // Clear existing cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Insert new items (validate each product exists and is active)
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId, isActive: true },
          select: { id: true, stock: true, name: true },
        });

        if (!product) continue; // Skip invalid products
        
        const quantity = Math.min(item.quantity, product.stock); // Cap at stock
        if (quantity <= 0) continue;

        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cart sync error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sync cart" },
      { status: 500 }
    );
  }
}
