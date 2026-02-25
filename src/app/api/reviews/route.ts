import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviewSchema } from "@/validators/review";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const reviews = await db.review.findMany({
      where: { productId, isVisible: true },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate stats
    const total = reviews.length;
    const averageRating =
      total > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    return NextResponse.json({
      reviews,
      stats: {
        total,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    });
  } catch (error: any) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please login to write a review" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = reviewSchema.parse(body);

    // Check if user already reviewed this product
    const existing = await db.review.findUnique({
      where: {
        productId_userId: {
          productId: validated.productId,
          userId: session.userId,
        },
      },
    });

    if (existing) {
      // Update existing review
      const review = await db.review.update({
        where: { id: existing.id },
        data: {
          rating: validated.rating,
          comment: validated.comment || null,
        },
        include: { user: { select: { name: true } } },
      });
      return NextResponse.json({ success: true, review, updated: true });
    }

    // Check if user has purchased this product
    const hasPurchased = await db.orderItem.findFirst({
      where: {
        productId: validated.productId,
        order: {
          userId: session.userId,
          status: { in: ["DELIVERED"] },
        },
      },
    });

    // Create review (allow even without purchase but flag it)
    const review = await db.review.create({
      data: {
        productId: validated.productId,
        userId: session.userId,
        rating: validated.rating,
        comment: validated.comment || null,
        isVisible: !!hasPurchased, // Auto-approve for verified buyers
      },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({
      success: true,
      review,
      message: hasPurchased
        ? "Review published!"
        : "Review submitted! It will be visible after moderation.",
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
