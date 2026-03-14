import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendAbandonedCartEmail } from "@/lib/email";

/**
 * POST /api/cron/abandoned-carts
 * 
 * Processes abandoned carts that have been inactive for 2+ hours.
 * Sends a recovery email to logged-in users with items in cart.
 * 
 * Call this from a cron job (e.g., Vercel Cron, cron-job.org)
 * Secured with CRON_SECRET env var.
 */
export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    // Find carts updated more than 2 hours ago, with items, belonging to users with email
    const abandonedCarts = await db.cart.findMany({
      where: {
        updatedAt: { lt: twoHoursAgo },
        abandonedEmailSent: false,
        userId: { not: null },
        items: { some: {} }, // Must have at least one item
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: { select: { url: true }, take: 1 },
              },
            },
          },
        },
      },
      take: 50, // Process max 50 per run to avoid rate limits
    });

    let sent = 0;
    let skipped = 0;

    for (const cart of abandonedCarts) {
      if (!cart.user?.email) {
        skipped++;
        continue;
      }

      const items = cart.items.map((ci) => ({
        name: ci.product.name,
        price: Number(ci.product.price),
        image: ci.product.images[0]?.url || null,
      }));

      const cartTotal = items.reduce((sum, i) => sum + i.price, 0);

      const result = await sendAbandonedCartEmail({
        to: cart.user.email,
        customerName: cart.user.name || "",
        items,
        cartTotal,
      });

      if (result.success) {
        await db.cart.update({
          where: { id: cart.id },
          data: { abandonedEmailSent: true },
        });
        sent++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: abandonedCarts.length,
      sent,
      skipped,
    });
  } catch (error) {
    console.error("Abandoned cart cron error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
