import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingUp, ShoppingBag, Package } from "lucide-react";
import { RevenueChart } from "./revenue-chart";
import { TopSellingTable } from "./top-selling-table";

async function getReportData() {
  const now = new Date();
  
  // Monthly revenue for last 12 months
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  
  const monthlyOrders = await db.order.findMany({
    where: {
      paymentStatus: "PAID",
      createdAt: { gte: twelveMonthsAgo },
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
  });

  // Group by month
  const monthlyRevenue: { month: string; revenue: number; orders: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
    const ordersInMonth = monthlyOrders.filter((o) => {
      const od = new Date(o.createdAt);
      return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
    });
    monthlyRevenue.push({
      month: monthLabel,
      revenue: ordersInMonth.reduce((sum, o) => sum + o.totalAmount.toNumber(), 0),
      orders: ordersInMonth.length,
    });
  }

  // Weekly revenue for last 8 weeks
  const weeklyRevenue: { week: string; revenue: number; orders: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i * 7 + now.getDay()) * 86400000);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);
    const ordersInWeek = monthlyOrders.filter((o) => {
      const od = new Date(o.createdAt);
      return od >= weekStart && od < weekEnd;
    });
    const label = weekStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    weeklyRevenue.push({
      week: label,
      revenue: ordersInWeek.reduce((sum, o) => sum + o.totalAmount.toNumber(), 0),
      orders: ordersInWeek.length,
    });
  }

  // Top selling products (by quantity sold, from paid orders)
  const topSelling = await db.orderItem.groupBy({
    by: ["productId", "productName", "productSku"],
    _sum: { quantity: true },
    _count: true,
    orderBy: { _sum: { quantity: "desc" } },
    take: 10,
    where: {
      order: { paymentStatus: "PAID" },
    },
  });

  // Get revenue per product
  const topSellingWithRevenue = await Promise.all(
    topSelling.map(async (item) => {
      const revenue = await db.orderItem.aggregate({
        where: {
          productId: item.productId,
          order: { paymentStatus: "PAID" },
        },
        _sum: { quantity: true },
      });
      const orderItems = await db.orderItem.findMany({
        where: {
          productId: item.productId,
          order: { paymentStatus: "PAID" },
        },
        select: { price: true, quantity: true },
      });
      const totalRevenue = orderItems.reduce(
        (sum, oi) => sum + oi.price.toNumber() * oi.quantity,
        0
      );
      return {
        productId: item.productId,
        name: item.productName,
        sku: item.productSku,
        quantitySold: item._sum.quantity || 0,
        orderCount: item._count,
        revenue: totalRevenue,
      };
    })
  );

  // Summary stats
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthRevenue, lastMonthRevenue, thisMonthOrders, totalRevenue] =
    await Promise.all([
      db.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "PAID", createdAt: { gte: thisMonth } },
      }),
      db.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: lastMonth, lt: thisMonth },
        },
      }),
      db.order.count({
        where: { paymentStatus: "PAID", createdAt: { gte: thisMonth } },
      }),
      db.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "PAID" },
      }),
    ]);

  const thisMonthRev = thisMonthRevenue._sum.totalAmount?.toNumber() || 0;
  const lastMonthRev = lastMonthRevenue._sum.totalAmount?.toNumber() || 0;
  const growthPercent =
    lastMonthRev > 0
      ? Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 100)
      : thisMonthRev > 0
      ? 100
      : 0;

  return {
    monthlyRevenue,
    weeklyRevenue,
    topSelling: topSellingWithRevenue,
    summary: {
      thisMonthRevenue: thisMonthRev,
      lastMonthRevenue: lastMonthRev,
      growthPercent,
      thisMonthOrders,
      totalRevenue: totalRevenue._sum.totalAmount?.toNumber() || 0,
    },
  };
}

export default async function AdminReportsPage() {
  const data = await getReportData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Sales Reports</h1>
        <p className="text-sm text-muted-foreground">
          Track your revenue, orders and best-selling sarees
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(data.summary.thisMonthRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.summary.growthPercent >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(data.summary.growthPercent)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Month
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(data.summary.lastMonthRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Previous month earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders This Month
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.thisMonthOrders}
            </div>
            <p className="text-xs text-muted-foreground">Paid orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(data.summary.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <RevenueChart
        monthlyData={data.monthlyRevenue}
        weeklyData={data.weeklyRevenue}
      />

      {/* Top Selling Sarees */}
      <TopSellingTable products={data.topSelling} />
    </div>
  );
}
