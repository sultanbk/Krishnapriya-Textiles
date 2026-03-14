import Link from "next/link";
import { Plus, Edit, Ticket } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/coupons/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Coupon
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_0.8fr_0.7fr_0.8fr_0.6fr_0.4fr] gap-4 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium text-muted-foreground">
          <span>Code</span>
          <span>Discount</span>
          <span>Min Order</span>
          <span>Usage</span>
          <span>Valid Until</span>
          <span>Status</span>
          <span></span>
        </div>
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Ticket className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No coupons yet</p>
            <p className="text-xs">Create your first coupon to offer discounts</p>
          </div>
        ) : (
          <div className="divide-y">
            {coupons.map((coupon) => {
              const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
              const isMaxed = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
              const statusLabel = !coupon.isActive ? "Inactive" : isExpired ? "Expired" : isMaxed ? "Max Used" : "Active";
              const statusClass = statusLabel === "Active"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : statusLabel === "Expired" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
              return (
                <div key={coupon.id} className="group hidden md:grid grid-cols-[1fr_1fr_0.8fr_0.7fr_0.8fr_0.6fr_0.4fr] gap-4 items-center px-5 py-3 transition-colors hover:bg-muted/40">
                  <span className="font-mono text-sm font-semibold">{coupon.code}</span>
                  <div className="text-sm">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}%`
                      : formatPrice(coupon.discountValue.toNumber())}
                    {coupon.maxDiscount && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (max {formatPrice(coupon.maxDiscount.toNumber())})
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {coupon.minOrderAmount ? formatPrice(coupon.minOrderAmount.toNumber()) : "—"}
                  </span>
                  <span className="text-sm tabular-nums">
                    {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {coupon.validUntil ? formatDate(coupon.validUntil) : "No expiry"}
                  </span>
                  <Badge variant="secondary" className={`w-fit border-0 text-[10px] font-medium ${statusClass}`}>
                    {statusLabel}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity justify-self-end" asChild>
                    <Link href={`/admin/coupons/${coupon.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
