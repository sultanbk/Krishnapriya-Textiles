import { db } from "@/lib/db";

/**
 * Adjust stock for a product (admin)
 */
export async function adjustStock(
  productId: string,
  change: number,
  reason: string,
  adminId: string
): Promise<void> {
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const newStock = product.stock + change;
  if (newStock < 0) throw new Error("Stock cannot be negative");

  await db.$transaction([
    db.product.update({
      where: { id: productId },
      data: { stock: newStock },
    }),
    db.inventoryLog.create({
      data: {
        productId,
        change,
        reason,
        newStock,
        performedBy: adminId,
      },
    }),
  ]);
}

/**
 * Get products with low stock
 */
export async function getLowStockProducts(limit = 20) {
  return db.product.findMany({
    where: {
      isActive: true,
      stock: { lte: db.product.fields?.lowStockThreshold ? undefined : 5 },
    },
    orderBy: { stock: "asc" },
    take: limit,
    include: {
      images: { take: 1, orderBy: { position: "asc" } },
      category: { select: { name: true } },
    },
  });
}

/**
 * Get inventory logs for a product
 */
export async function getInventoryLogs(productId?: string, page = 1, pageSize = 20) {
  const where = productId ? { productId } : {};

  const [logs, total] = await Promise.all([
    db.inventoryLog.findMany({
      where,
      include: {
        product: { select: { name: true, sku: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.inventoryLog.count({ where }),
  ]);

  return {
    items: logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
}
