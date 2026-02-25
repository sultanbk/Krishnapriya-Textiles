import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Package,
  Users,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
  Image,
  Ticket,
} from "lucide-react";

async function getDashboardStats() {
  const [
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    db.order.count(),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "PAID" },
    }),
    db.user.count({ where: { role: "USER" } }),
    db.product.count({ where: { isActive: true } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
    db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, phone: true } },
        _count: { select: { items: true } },
      },
    }),
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount?.toNumber() || 0,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Earnings",
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      description: "From all paid orders",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      description: stats.pendingOrders > 0
        ? `⚠️ ${stats.pendingOrders} new orders to check`
        : "All orders processed ✅",
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      description: "People who signed up",
    },
    {
      title: "Products Listed",
      value: stats.totalProducts.toString(),
      icon: Package,
      description: stats.lowStockProducts > 0
        ? `⚠️ ${stats.lowStockProducts} running out of stock`
        : "All products in stock ✅",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">🙏 Welcome Back!</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your store today</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
          <Link href="/admin/products/new">
            <Plus className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">Add New Saree</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
          <Link href="/admin/orders">
            <Eye className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">View Orders</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
          <Link href="/admin/banners">
            <Image className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">Change Banners</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
          <Link href="/admin/coupons/new">
            <Ticket className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">Create Coupon</span>
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts - needs attention */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders?status=PENDING">
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="font-semibold">New Orders Waiting!</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.pendingOrders} orders — Click here to view and confirm them
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          {stats.lowStockProducts > 0 && (
            <Link href="/admin/inventory">
              <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-semibold">Stock Running Low!</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.lowStockProducts} sarees have very less stock — Click to update
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg">Recent Orders</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">View All Orders</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No orders yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Orders will appear here when customers place them
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      Order #
                    </th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      Items
                    </th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 cursor-pointer">
                      <td className="py-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-primary hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">
                        {order.user?.name || order.user?.phone || "Unknown"}
                      </td>
                      <td className="py-3">{order._count.items}</td>
                      <td className="py-3 font-semibold">
                        {formatPrice(order.totalAmount.toNumber())}
                      </td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                          order.status === "SHIPPED" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          order.status === "CONFIRMED" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" :
                          order.status === "CANCELLED" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                          order.status === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
