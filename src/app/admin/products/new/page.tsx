import { db } from "@/lib/db";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Add Product</h1>
        <p className="text-muted-foreground">Create a new product listing</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
