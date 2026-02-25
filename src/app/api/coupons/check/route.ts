import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * POST /api/coupons/check
 * Validate a coupon code and return the discount amount for a given subtotal.
 * Body: { code: string, subtotal: number }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please login to apply coupons" }, { status: 401 });
    }

    const { code, subtotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }
    if (!subtotal || typeof subtotal !== "number" || subtotal <= 0) {
      return NextResponse.json({ error: "Invalid subtotal" }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    const now = new Date();
    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json({ valid: false, error: "This coupon has expired" });
    }
    if (coupon.validFrom > now) {
      return NextResponse.json({ valid: false, error: "This coupon is not yet active" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
    }

    // Check per-user usage
    const userUsage = await db.order.count({
      where: {
        userId: session.userId,
        couponId: coupon.id,
        status: { not: "CANCELLED" },
      },
    });
    if (userUsage >= coupon.perUserLimit) {
      return NextResponse.json({ valid: false, error: "You have already used this coupon" });
    }

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of ₹${Number(coupon.minOrderAmount).toLocaleString("en-IN")} required`,
      });
    }

    // Calculate discount
    let discount: number;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (subtotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else {
      // FLAT
      discount = Number(coupon.discountValue);
    }
    discount = Math.min(Math.round(discount), subtotal);

    return NextResponse.json({
      valid: true,
      discount,
      description: coupon.description || `${coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}`,
      code: coupon.code,
    });
  } catch (error: any) {
    console.error("Coupon check error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
