import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { WhatsAppAlertButton } from "./whatsapp-alert-button";
import { InlineStockEditor } from "./inline-stock-editor";

export default async function AdminInventoryPage() {
  const lowStockProducts = await db.product.findMany({
    where: { isActive: true, stock: { lte: 10 } },
    include: {
      category: { select: { name: true } },
      images: { take: 1 },
    },
    orderBy: { stock: "asc" },
  });

  const outOfStockCount = lowStockProducts.filter((p) => p.stock === 0).length;
  const lowStockCount = lowStockProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Monitor product stock levels
          </p>
        </div>
        {lowStockProducts.length > 0 && (
          <WhatsAppAlertButton
            products={lowStockProducts.map((p) => ({
              name: p.name,
              sku: p.sku,
              stock: p.stock,
            }))}
          />
        )}
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="flex items-center gap-4 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 dark:from-red-950/30 to-transparent p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/40">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Out of Stock</p>
            <p className="text-xl font-bold tabular-nums text-red-600 dark:text-red-400">{outOfStockCount}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 dark:from-amber-950/30 to-transparent p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Low Stock (≤5)</p>
            <p className="text-xl font-bold tabular-nums text-amber-600 dark:text-amber-400">{lowStockCount}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Need Attention (≤10)</p>
            <p className="text-xl font-bold tabular-nums">{lowStockProducts.length}</p>
          </div>
        </Card>
      </div>

      {/* Products table */}
      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_0.8fr_1fr_0.6fr_1fr_0.7fr] gap-4 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium text-muted-foreground">
          <span>Product</span>
          <span>SKU</span>
          <span>Category</span>
          <span>Stock</span>
          <span>Update</span>
          <span>Status</span>
        </div>
        {lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-emerald-600 dark:text-emerald-400">
            <Package className="mb-3 h-10 w-10 opacity-50" />
            <p className="text-sm font-medium">All products are well-stocked!</p>
          </div>
        ) : (
          <div className="divide-y">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="hidden md:grid grid-cols-[1.5fr_0.8fr_1fr_0.6fr_1fr_0.7fr] gap-4 items-center px-5 py-3 transition-colors hover:bg-muted/40">
                <span className="truncate text-sm font-medium">{product.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
                <span className="text-sm text-muted-foreground">{product.category?.name || "—"}</span>
                <span className="text-lg font-bold tabular-nums">{product.stock}</span>
                <InlineStockEditor
                  productId={product.id}
                  initialStock={product.stock}
                />
                <Badge
                  variant="secondary"
                  className={`w-fit border-0 text-[10px] font-medium ${
                    product.stock === 0
                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      : product.stock <= 5
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : product.stock <= 5
                    ? "Low Stock"
                    : "Warning"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
