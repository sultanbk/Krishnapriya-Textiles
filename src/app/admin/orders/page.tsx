import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Clock,
  Package,
} from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { ExportOrdersButton } from "./export-orders-button";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  PROCESSING: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  PACKED: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  SHIPPED: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
  DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const PAYMENT_STYLE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

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
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString("en-IN")} total orders
          </p>
        </div>
        <ExportOrdersButton status={status} />
      </div>

      {/* Search + Status Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form className="flex gap-2 flex-1">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search order # or phone..."
                defaultValue={search}
                className="pl-9 h-9"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="h-9 px-3">
              Search
            </Button>
          </form>
          <div className="flex gap-1 flex-wrap">
            {statusFilters.map((f) => (
              <Button
                key={f.value}
                variant={status === f.value || (!status && !f.value) ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs rounded-full"
                asChild
              >
                <Link href={{ query: { ...params, status: f.value || undefined, page: undefined } }}>
                  {f.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders list */}
      <Card className="overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden md:grid grid-cols-[1fr_1.2fr_0.5fr_0.8fr_0.7fr_0.7fr_0.7fr] gap-4 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium text-muted-foreground">
          <span>Order</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ShoppingCart className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No orders found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => {
              const statusLabel =
                ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status;
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="group block transition-colors hover:bg-muted/40"
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[1fr_1.2fr_0.5fr_0.8fr_0.7fr_0.7fr_0.7fr] gap-4 items-center px-5 py-3">
                    <span className="font-mono text-xs font-medium">{order.orderNumber}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{order.user?.name || "—"}</p>
                      <p className="truncate text-xs text-muted-foreground">{order.user?.phone}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      {order._count.items}
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatPrice(order.totalAmount.toNumber())}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`w-fit border-0 text-[10px] font-medium ${PAYMENT_STYLE[order.paymentStatus] ?? ""}`}
                    >
                      {order.paymentStatus}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`w-fit border-0 text-[10px] font-medium ${STATUS_STYLE[order.status] ?? ""}`}
                    >
                      {statusLabel}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="flex items-center gap-3 px-4 py-3 md:hidden">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                      {order._count.items}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{order.user?.name || order.user?.phone}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-mono">{order.orderNumber}</span>
                        <span>·</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatPrice(order.totalAmount.toNumber())}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`mt-0.5 border-0 text-[10px] font-medium ${STATUS_STYLE[order.status] ?? ""}`}
                      >
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground tabular-nums">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                <Link href={{ query: { ...params, page: page - 1 } }}>
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Link>
              </Button>
            )}
            <span className="text-xs text-muted-foreground tabular-nums">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                <Link href={{ query: { ...params, page: page + 1 } }}>
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
