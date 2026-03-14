import Link from "next/link";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  AlertCircle,
  Star,
  MessageSquare,
  Plus,
  BarChart3,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

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

async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    revenueResult,
    pendingOrders,
    lowStockProducts,
    pendingReviews,
    unreadMessages,
    todayOrders,
    todayRevenue,
    recentOrders,
    newCustomersToday,
  ] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count({ where: { role: "USER" } }),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED", "PACKED"] } },
    }),
    db.order.count({ where: { status: "PENDING" } }),
    db.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
    db.review.count({ where: { isVisible: false } }),
    db.contactMessage.count({ where: { isRead: false } }),
    db.order.count({ where: { createdAt: { gte: todayStart } } }),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: todayStart } },
    }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, phone: true } }, items: { select: { id: true } } },
    }),
    db.user.count({ where: { role: "USER", createdAt: { gte: todayStart } } }),
  ]);

  return {
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
    pendingOrders,
    lowStockProducts,
    pendingReviews,
    unreadMessages,
    todayOrders,
    todayRevenue: Number(todayRevenue._sum.totalAmount ?? 0),
    recentOrders,
    newCustomersToday,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const mainStats = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/40",
      href: "/admin/reports",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/40",
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: stats.totalProducts.toLocaleString("en-IN"),
      icon: Package,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-100 dark:bg-violet-900/40",
      href: "/admin/products",
    },
    {
      label: "Customers",
      value: stats.totalCustomers.toLocaleString("en-IN"),
      icon: Users,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/40",
      href: "/admin/customers",
    },
  ];

  const alerts = [
    stats.pendingOrders > 0 && {
      label: `${stats.pendingOrders} pending order${stats.pendingOrders > 1 ? "s" : ""}`,
      href: "/admin/orders?status=PENDING",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    },
    stats.lowStockProducts > 0 && {
      label: `${stats.lowStockProducts} low-stock product${stats.lowStockProducts > 1 ? "s" : ""}`,
      href: "/admin/inventory",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    },
    stats.pendingReviews > 0 && {
      label: `${stats.pendingReviews} review${stats.pendingReviews > 1 ? "s" : ""} awaiting moderation`,
      href: "/admin/reviews",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800",
    },
    stats.unreadMessages > 0 && {
      label: `${stats.unreadMessages} unread message${stats.unreadMessages > 1 ? "s" : ""}`,
      href: "/admin/messages",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    },
  ].filter(Boolean) as { label: string; href: string; color: string; bg: string }[];

  const quickActions = [
    { label: "Add Product", href: "/admin/products/new", icon: Plus },
    { label: "View Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your store performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/reports">
              <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
              Reports
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Today&apos;s Highlight Strip */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Card className="flex items-center gap-4 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Today&apos;s Orders</p>
            <p className="text-xl font-bold tabular-nums">{stats.todayOrders}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 dark:from-emerald-950/30 to-transparent p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Today&apos;s Revenue</p>
            <p className="text-xl font-bold tabular-nums">{formatPrice(stats.todayRevenue)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 dark:from-blue-950/30 to-transparent p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">New Customers</p>
            <p className="text-xl font-bold tabular-nums">{stats.newCustomersToday}</p>
          </div>
        </Card>
      </div>

      {/* Main Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="group relative overflow-hidden p-4 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                </div>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                </div>
              </div>
              <ArrowUpRight className="absolute bottom-2 right-2 h-3.5 w-3.5 text-muted-foreground/0 transition-all group-hover:text-muted-foreground/50" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {alerts.map((alert) => (
            <Link key={alert.href} href={alert.href}>
              <Card className={`group flex items-center gap-3 border p-3 transition-all hover:shadow-sm ${alert.bg}`}>
                <AlertCircle className={`h-4 w-4 shrink-0 ${alert.color}`} />
                <span className={`flex-1 text-[13px] font-medium ${alert.color}`}>
                  {alert.label}
                </span>
                <ChevronRight className={`h-4 w-4 shrink-0 ${alert.color} opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5`} />
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <h2 className="font-heading text-sm font-semibold">Recent Orders</h2>
            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
              <Link href="/admin/orders">View all</Link>
            </Button>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {order.items.length}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {order.user.name || order.user.phone}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-mono">{order.orderNumber}</span>
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatPrice(Number(order.totalAmount))}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`mt-0.5 border-0 text-[10px] font-medium ${STATUS_STYLE[order.status] ?? ""}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="overflow-hidden">
          <div className="border-b px-5 py-3.5">
            <h2 className="font-heading text-sm font-semibold">Quick Actions</h2>
          </div>
          <div className="grid gap-1.5 p-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="justify-start gap-3 h-10 px-3 text-[13px] font-medium"
                asChild
              >
                <Link href={action.href}>
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
