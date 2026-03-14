import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Fabric, Prisma } from "@prisma/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * GET /api/search/suggestions?q=silk
 * Returns up to 8 product suggestions for autocomplete
 */
export async function GET(req: NextRequest) {
  try {
    // Rate limit: 60 requests per minute
    const ip = getClientIp(req);
    const { limited } = rateLimit(`search:${ip}`, { limit: 60, windowSec: 60 });
    if (limited) {
      return NextResponse.json({ suggestions: [] });
    }

    const q = req.nextUrl.searchParams.get("q")?.trim();
    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Check if query matches any fabric enum value
    const qUpper = q.toUpperCase().replace(/\s+/g, "_");
    const matchingFabrics = Object.values(Fabric).filter(
      (f) => f.includes(qUpper) || qUpper.includes(f)
    );

    const orConditions: Prisma.ProductWhereInput[] = [
      { name: { contains: q, mode: "insensitive" } },
      { color: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];

    // Add fabric enum matches
    for (const fabric of matchingFabrics) {
      orConditions.push({ fabric: { equals: fabric } });
    }

    const products = await db.product.findMany({
      where: {
        isActive: true,
        OR: orConditions,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          select: { url: true },
          take: 1,
        },
        category: {
          select: { name: true },
        },
      },
      take: 8,
      orderBy: { isFeatured: "desc" },
    });

    const suggestions = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      image: p.images[0]?.url || null,
      category: p.category?.name || null,
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
