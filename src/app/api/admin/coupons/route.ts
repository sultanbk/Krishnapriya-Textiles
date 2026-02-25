import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { couponSchema } from "@/validators/coupon";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = couponSchema.parse(body);

    // Check for duplicate code
    const existing = await db.coupon.findUnique({
      where: { code: validated.code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: validated.code.toUpperCase(),
        discountType: validated.discountType,
        discountValue: validated.discountValue,
        minOrderAmount: validated.minOrderAmount || null,
        maxDiscount: validated.maxDiscount || null,
        usageLimit: validated.usageLimit || null,
        perUserLimit: validated.perUserLimit ?? 1,
        validFrom: validated.validFrom || new Date(),
        validUntil: validated.validUntil ? new Date(validated.validUntil as unknown as string) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Create coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
