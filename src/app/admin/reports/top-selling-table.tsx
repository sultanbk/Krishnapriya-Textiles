"use client";

import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopSellingProduct {
  productId: string;
  name: string;
  sku: string;
  quantitySold: number;
  orderCount: number;
  revenue: number;
}

export function TopSellingTable({
  products,
}: {
  products: TopSellingProduct[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">
          Top Selling Sarees
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">#</th>
                <th className="p-3 text-left font-medium">Product</th>
                <th className="p-3 text-left font-medium">SKU</th>
                <th className="p-3 text-right font-medium">Qty Sold</th>
                <th className="p-3 text-right font-medium">Orders</th>
                <th className="p-3 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.productId} className="border-b last:border-0">
                  <td className="p-3">
                    {index < 3 ? (
                      <Badge
                        variant={index === 0 ? "default" : "secondary"}
                        className={
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                            ? "bg-gray-400 text-white"
                            : "bg-amber-700 text-white"
                        }
                      >
                        #{index + 1}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </td>
                  <td className="p-3 font-medium max-w-[200px] truncate">
                    {product.name}
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {product.quantitySold}
                  </td>
                  <td className="p-3 text-right">{product.orderCount}</td>
                  <td className="p-3 text-right font-semibold text-primary">
                    {formatPrice(product.revenue)}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No sales data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
