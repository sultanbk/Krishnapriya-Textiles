import Link from "next/link";
import { Package, ChevronRight, Eye } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: { take: 1 } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="mt-4 font-heading text-xl font-bold">No orders yet</h2>
        <p className="mt-1 text-muted-foreground">
          Start shopping and your orders will appear here.
        </p>
        <Button asChild className="mt-4">
          <Link href="/products">Browse Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-bold">My Orders</h2>
      {orders.map((order) => {
        const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
        const statusColor = ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800";
        return (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="font-mono text-sm font-semibold">
                      {order.orderNumber}
                    </p>
                  </div>
                  <Badge className={statusColor}>{statusLabel}</Badge>
                </div>
                <div className="mt-3 space-y-1">
                  {order.items.slice(0, 3).map((item) => (
                    <p key={item.id} className="text-sm text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </p>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-primary">
                    {formatPrice(order.totalAmount.toNumber())}
                  </span>
                  <span className="flex items-center text-sm text-primary">
                    View Details <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
