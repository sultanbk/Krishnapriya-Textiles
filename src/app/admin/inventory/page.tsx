import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { WhatsAppAlertButton } from "./whatsapp-alert-button";

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Inventory</h1>
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
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              <p className="text-sm text-muted-foreground">Low Stock (≤5)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div>
              <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              <p className="text-sm text-muted-foreground">Need Attention (≤10)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Product</th>
                  <th className="p-3 text-left font-medium">SKU</th>
                  <th className="p-3 text-left font-medium">Category</th>
                  <th className="p-3 text-left font-medium">Stock</th>
                  <th className="p-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3 font-mono text-xs">{product.sku}</td>
                    <td className="p-3">{product.category?.name || "—"}</td>
                    <td className="p-3">
                      <span className="text-lg font-bold">{product.stock}</span>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={product.stock === 0 ? "destructive" : "secondary"}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 5
                          ? "Low Stock"
                          : "Warning"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-green-600">
                      All products are well-stocked!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
