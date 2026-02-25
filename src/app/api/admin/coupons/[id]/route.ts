import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { couponSchema } from "@/validators/coupon";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const coupon = await db.coupon.findUnique({ where: { id } });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error: any) {
    console.error("Get coupon error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const validated = couponSchema.parse(body);

    // Check for duplicate code (exclude current coupon)
    const existing = await db.coupon.findFirst({
      where: {
        code: validated.code.toUpperCase(),
        id: { not: id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );
    }

    const coupon = await db.coupon.update({
      where: { id },
      data: {
        code: validated.code.toUpperCase(),
        discountType: validated.discountType,
        discountValue: validated.discountValue,
        minOrderAmount: validated.minOrderAmount || null,
        maxDiscount: validated.maxDiscount || null,
        usageLimit: validated.usageLimit || null,
        perUserLimit: validated.perUserLimit ?? 1,
        validFrom: validated.validFrom || new Date(),
        validUntil: validated.validUntil
          ? new Date(validated.validUntil as unknown as string)
          : null,
        isActive: validated.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Update coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
