import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify, generateSku } from "@/lib/utils";
import { createProductSchema } from "@/validators/product";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { images, ...productBody } = body;
    const data = createProductSchema.parse(productBody);

    const slug = slugify(data.name);
    const sku = data.sku || generateSku(data.fabric, Math.floor(Math.random() * 999));

    // Check for existing slug
    const existing = await db.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await db.product.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description || "",
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        sku,
        stock: data.stock || 0,
        fabric: data.fabric as any,
        occasion: data.occasion as any,
        color: data.color,
        length: data.length,
        width: data.width,
        weight: data.weight,
        blouseIncluded: data.blouseIncluded,
        blouseLength: data.blouseLength,
        borderType: data.borderType,
        palluDetail: data.palluDetail,
        zariType: data.zariType,
        washCare: data.washCare,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        categoryId: data.categoryId,
        images: images && images.length > 0 ? {
          create: images.map((img: { url: string; publicId: string; alt?: string; position?: number }, i: number) => ({
            url: img.url,
            publicId: img.publicId,
            alt: img.alt || "",
            position: img.position ?? i,
          })),
        } : undefined,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
