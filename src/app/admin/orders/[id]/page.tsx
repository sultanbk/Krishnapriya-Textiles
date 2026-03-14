import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { OrderStatusUpdate } from "../order-status-update";
import { OrderDetailsForm } from "../order-details-form";
import { DownloadInvoiceButton } from "@/components/orders/download-invoice-button";

interface AdminOrderDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, phone: true, email: true } },
      items: {
        include: {
          product: {
            select: { name: true, slug: true, sku: true, images: { take: 1 } },
          },
        },
      },
    },
  });

  if (!order) notFound();

  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
  const statusColor = ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800";
  const shippingAddress = order.shippingAddress as any;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-heading text-xl font-bold">
              Order {order.orderNumber}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
          <DownloadInvoiceButton orderId={order.id} orderNumber={order.orderNumber} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {item.product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatPrice(item.price.toNumber() * item.quantity)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatPrice(item.price.toNumber())}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order notes */}
          {order.customerNote && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.customerNote}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal.toNumber())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shippingCharge.toNumber() === 0
                    ? "FREE"
                    : formatPrice(order.shippingCharge.toNumber())}
                </span>
              </div>
              {order.discount.toNumber() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount.toNumber())}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(order.totalAmount.toNumber())}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>{order.paymentMethod === "COD" ? "COD" : "Online"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
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
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Status</span>
                <Badge className={statusColor}>{statusLabel}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.user?.name || "—"}</p>
              <p className="text-muted-foreground">{order.user?.phone}</p>
              {order.user?.email && (
                <p className="text-muted-foreground">{order.user.email}</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping */}
          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">
                  {shippingAddress.fullName}
                </p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && (
                  <p>{shippingAddress.addressLine2}</p>
                )}
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.pincode}
                </p>
                <p>+91 {shippingAddress.phone}</p>
                {shippingAddress.landmark && (
                  <p className="text-xs">Landmark: {shippingAddress.landmark}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tracking & Admin Notes */}
          <OrderDetailsForm
            orderId={order.id}
            initialTrackingNumber={order.trackingNumber}
            initialAdminNote={order.adminNote}
            customerPhone={order.user?.phone || null}
            orderNumber={order.orderNumber}
          />
        </div>
      </div>
    </div>
  );
}
