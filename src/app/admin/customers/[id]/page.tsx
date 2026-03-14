import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, ShoppingBag, Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  const customer = await db.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: {
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      reviews: {
        include: { product: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!customer || customer.role !== "USER") notFound();

  const totalOrders = customer.orders.length;
  const paidOrders = customer.orders.filter((o) => o.paymentStatus === "PAID");
  const totalSpent = paidOrders.reduce(
    (sum, o) => sum + o.totalAmount.toNumber(),
    0
  );
  const avgOrderValue = paidOrders.length > 0 ? totalSpent / paidOrders.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-xl font-bold">
            {customer.name || "Unnamed Customer"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Customer since {formatDate(customer.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Orders + Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(totalSpent)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">
                  {avgOrderValue > 0 ? formatPrice(avgOrderValue) : "—"}
                </p>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </CardContent>
            </Card>
          </div>

          {/* Order history */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Order</th>
                      <th className="p-3 text-left font-medium">Date</th>
                      <th className="p-3 text-left font-medium">Items</th>
                      <th className="p-3 text-left font-medium">Total</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((order) => {
                      const statusLabel =
                        ORDER_STATUS_LABELS[order.status] || order.status;
                      const statusColor =
                        ORDER_STATUS_COLORS[order.status] ||
                        "bg-gray-100 text-gray-800";
                      return (
                        <tr
                          key={order.id}
                          className="border-b last:border-0 hover:bg-muted/30"
                        >
                          <td className="p-3">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="p-3">
                            <span className="text-muted-foreground">
                              {order.items
                                .map((i) => i.product.name)
                                .slice(0, 2)
                                .join(", ")}
                              {order.items.length > 2 &&
                                ` +${order.items.length - 2} more`}
                            </span>
                          </td>
                          <td className="p-3 font-medium">
                            {formatPrice(order.totalAmount.toNumber())}
                          </td>
                          <td className="p-3">
                            <Badge className={statusColor}>{statusLabel}</Badge>
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
                        </tr>
                      );
                    })}
                    {customer.orders.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-muted-foreground"
                        >
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          {customer.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Reviews ({customer.reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex gap-3 rounded-lg border p-3"
                  >
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={
                            i <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-primary">
                        {review.product.name}
                      </p>
                      {review.comment && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                        {!review.isVisible && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Hidden
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Contact + Addresses */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(customer.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Addresses ({customer.addresses.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved addresses
                </p>
              ) : (
                customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-lg border p-3 text-sm space-y-1"
                  >
                    <p className="font-medium">
                      {addr.fullName}
                      {addr.isDefault && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Default
                        </Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground">{addr.line1}</p>
                    {addr.line2 && (
                      <p className="text-muted-foreground">
                        {addr.line2}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      {addr.city}, {addr.state} {addr.pincode}
                    </p>
                    <p className="text-muted-foreground">+91 {addr.phone}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
