import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            {coupons.length} coupons
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <Plus className="mr-2 h-4 w-4" /> Add Coupon
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Code</th>
                  <th className="p-3 text-left font-medium">Discount</th>
                  <th className="p-3 text-left font-medium">Min Order</th>
                  <th className="p-3 text-left font-medium">Usage</th>
                  <th className="p-3 text-left font-medium">Valid Until</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                  const isMaxed = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
                  return (
                    <tr key={coupon.id} className="border-b last:border-0">
                      <td className="p-3 font-mono font-semibold">{coupon.code}</td>
                      <td className="p-3">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : formatPrice(coupon.discountValue.toNumber())}
                        {coupon.maxDiscount && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (max {formatPrice(coupon.maxDiscount.toNumber())})
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {coupon.minOrderAmount
                          ? formatPrice(coupon.minOrderAmount.toNumber())
                          : "—"}
                      </td>
                      <td className="p-3">
                        {coupon.usedCount}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </td>
                      <td className="p-3 text-xs">
                        {coupon.validUntil
                          ? formatDate(coupon.validUntil)
                          : "No expiry"}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            !coupon.isActive || isExpired || isMaxed
                              ? "secondary"
                              : "default"
                          }
                        >
                          {!coupon.isActive
                            ? "Inactive"
                            : isExpired
                            ? "Expired"
                            : isMaxed
                            ? "Max Used"
                            : "Active"}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/coupons/${coupon.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No coupons yet
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
