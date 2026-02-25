import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createProductSchema } from "@/validators/product";
import { slugify } from "@/lib/utils";

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
    const { images, ...rest } = body;
    const data = createProductSchema.parse(rest);

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const slug = data.name !== existing.name ? slugify(data.name) : existing.slug;

    // Update product + replace all images
    const product = await db.$transaction(async (tx) => {
      // Delete old images
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
      }

      const updated = await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          description: data.description || "",
          shortDescription: data.shortDescription ?? existing.shortDescription,
          price: data.price,
          compareAtPrice: data.compareAtPrice ?? null,
          costPrice: data.costPrice ?? existing.costPrice,
          sku: data.sku || existing.sku,
          stock: data.stock ?? existing.stock,
          lowStockThreshold: data.lowStockThreshold ?? existing.lowStockThreshold,
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
          isActive: data.isActive ?? existing.isActive,
          isFeatured: data.isFeatured ?? existing.isFeatured,
          isNewArrival: data.isNewArrival ?? existing.isNewArrival,
          codAvailable: data.codAvailable ?? existing.codAvailable,
          metaTitle: data.metaTitle ?? existing.metaTitle,
          metaDescription: data.metaDescription ?? existing.metaDescription,
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

      return updated;
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Update product error:", error);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
