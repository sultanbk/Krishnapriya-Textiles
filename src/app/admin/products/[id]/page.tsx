import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "../product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    db.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  // Convert Prisma types to plain JS for the form
  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription || "",
    sku: product.sku,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toNumber() : undefined,
    costPrice: product.costPrice ? product.costPrice.toNumber() : undefined,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    fabric: product.fabric,
    occasion: product.occasion,
    categoryId: product.categoryId,
    color: product.color,
    length: product.length || "",
    width: product.width || "",
    weight: product.weight || "",
    blouseIncluded: product.blouseIncluded,
    blouseLength: product.blouseLength || "",
    borderType: product.borderType || "",
    palluDetail: product.palluDetail || "",
    washCare: product.washCare || "",
    zariType: product.zariType || "",
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    codAvailable: product.codAvailable,
    metaTitle: product.metaTitle || "",
    metaDescription: product.metaDescription || "",
    images: product.images,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm categories={categories} initialData={initialData} isEdit />
    </div>
  );
}
