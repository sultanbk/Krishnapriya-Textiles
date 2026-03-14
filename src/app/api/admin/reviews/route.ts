import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = 20;
    const filter = searchParams.get("filter"); // "all" | "visible" | "hidden"

    const where: { isVisible?: boolean } = {};
    if (filter === "visible") where.isVisible = true;
    if (filter === "hidden") where.isVisible = false;

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          user: { select: { name: true, phone: true } },
          product: { select: { name: true, slug: true, images: { take: 1 } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({ reviews, total, page, perPage });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
