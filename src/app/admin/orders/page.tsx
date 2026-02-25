import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { ExportOrdersButton } from "./export-orders-button";

interface AdminOrdersPageProps {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const perPage = 20;
  const status = params.status;
  const search = params.search;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { phone: { contains: search } } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, phone: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const statusFilters = [
    { label: "All", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">{total} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <form className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search order # or phone"
              defaultValue={search}
              className="pl-9 w-60"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
        <div className="flex gap-1 flex-wrap">
          {statusFilters.map((f) => (
            <Button
              key={f.value}
              variant={status === f.value || (!status && !f.value) ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={{ query: { ...params, status: f.value || undefined, page: undefined } }}>
                {f.label}
              </Link>
            </Button>
          ))}
        </div>
        <div className="ml-auto">
          <ExportOrdersButton status={status} />
        </div>
      </div>

      {/* Orders table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Order</th>
                  <th className="p-3 text-left font-medium">Customer</th>
                  <th className="p-3 text-left font-medium">Items</th>
                  <th className="p-3 text-left font-medium">Total</th>
                  <th className="p-3 text-left font-medium">Payment</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusLabel = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS];
                  const statusColor = ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] || "bg-gray-100 text-gray-800";
                  return (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="p-3 font-mono text-xs">{order.orderNumber}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{order.user?.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.user?.phone}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">{order._count.items}</td>
                      <td className="p-3 font-semibold">
                        {formatPrice(order.totalAmount.toNumber())}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            order.paymentStatus === "PAID"
                              ? "default"
                              : order.paymentStatus === "FAILED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {statusLabel && (
                          <Badge className={statusColor}>{statusLabel}</Badge>
                        )}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="mr-1 h-4 w-4" /> View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={{ query: { ...params, page: page - 1 } }}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Prev
              </Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link href={{ query: { ...params, page: page + 1 } }}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
