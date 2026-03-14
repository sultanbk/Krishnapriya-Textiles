import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  MessageCircle,
  Clock,
  CheckCircle2,
  Settings,
  PackageCheck,
  Truck,
  Home,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { siteConfig } from "@/config/site";
import { DownloadInvoiceButton } from "@/components/orders/download-invoice-button";
import { CancelOrderButton } from "@/components/orders/cancel-order-button";
import { ReturnRequestButton } from "@/components/orders/return-request-button";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const ORDER_TIMELINE = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
] as const;

const STEP_ICONS = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PROCESSING: Settings,
  PACKED: PackageCheck,
  SHIPPED: Truck,
  DELIVERED: Home,
} as const;

const STEP_DESCRIPTIONS = {
  PENDING: "Order placed, awaiting confirmation",
  CONFIRMED: "Order confirmed by seller",
  PROCESSING: "Being prepared for dispatch",
  PACKED: "Packed and ready to ship",
  SHIPPED: "On the way to you",
  DELIVERED: "Delivered successfully",
} as const;

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const order = await db.order.findFirst({
    where: { id, userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: { take: 1 } },
          },
        },
      },
    },
  });

  if (!order) notFound();

  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
  const statusColor = ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800";

  const currentStep = ORDER_TIMELINE.indexOf(
    order.status as (typeof ORDER_TIMELINE)[number]
  );

  const shippingAddress = order.shippingAddress as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="font-heading text-xl font-bold">
            Order {order.orderNumber}
          </h2>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge className={`ml-auto ${statusColor}`}>{statusLabel}</Badge>
        <DownloadInvoiceButton orderId={order.id} orderNumber={order.orderNumber} />
        <CancelOrderButton orderId={order.id} orderNumber={order.orderNumber} status={order.status} />
        <ReturnRequestButton
          orderId={order.id}
          orderNumber={order.orderNumber}
          status={order.status}
          deliveredAt={order.deliveredAt?.toISOString() ?? null}
          createdAt={order.createdAt.toISOString()}
        />
      </div>

      {/* Order Status Timeline */}
      {order.status !== "CANCELLED" && order.status !== "REFUNDED" ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop horizontal timeline */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between">
                {ORDER_TIMELINE.map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  const StepIcon = STEP_ICONS[step];
                  return (
                    <div key={step} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        {index > 0 && (
                          <div
                            className={`h-0.5 flex-1 transition-colors ${
                              index <= currentStep
                                ? "bg-primary"
                                : "bg-muted-foreground/20"
                            }`}
                          />
                        )}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg"
                              : isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <StepIcon className="h-4.5 w-4.5" />
                        </div>
                        {index < ORDER_TIMELINE.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 transition-colors ${
                              index < currentStep
                                ? "bg-primary"
                                : "bg-muted-foreground/20"
                            }`}
                          />
                        )}
                      </div>
                      <span className={`mt-2 text-xs text-center font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {ORDER_STATUS_LABELS[step as keyof typeof ORDER_STATUS_LABELS]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile vertical timeline */}
            <div className="sm:hidden space-y-0">
              {ORDER_TIMELINE.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                const StepIcon = STEP_ICONS[step];
                const stepLabel = ORDER_STATUS_LABELS[step as keyof typeof ORDER_STATUS_LABELS] || step;
                const stepDesc = STEP_DESCRIPTIONS[step];
                const isLast = index === ORDER_TIMELINE.length - 1;

                return (
                  <div key={step} className="flex gap-3">
                    {/* Icon + vertical line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isCurrent
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : isCompleted
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StepIcon className="h-3.5 w-3.5" />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 min-h-[24px] ${
                            index < currentStep ? "bg-primary" : "bg-muted-foreground/20"
                          }`}
                        />
                      )}
                    </div>
                    {/* Label + description */}
                    <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
                      <p className={`text-sm font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {stepLabel}
                      </p>
                      <p className="text-xs text-muted-foreground">{stepDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tracking number / shipped date */}
            {order.trackingNumber && (
              <div className="mt-4 rounded-lg bg-muted/30 p-3 text-sm ring-1 ring-border/30">
                <span className="text-muted-foreground">Tracking: </span>
                <span className="font-medium">{order.trackingNumber}</span>
              </div>
            )}
            {order.shippedAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Shipped on {formatDate(order.shippedAt)}
              </p>
            )}
            {order.deliveredAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Delivered on {formatDate(order.deliveredAt)}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Cancelled / Refunded state */
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              order.status === "CANCELLED" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            }`}>
              {order.status === "CANCELLED" ? (
                <XCircle className="h-6 w-6" />
              ) : (
                <RotateCcw className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="font-semibold">
                {order.status === "CANCELLED" ? "Order Cancelled" : "Order Refunded"}
              </p>
              {order.cancelReason && (
                <p className="text-sm text-muted-foreground">Reason: {order.cancelReason}</p>
              )}
              {order.cancelledAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  on {formatDate(order.cancelledAt)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × {formatPrice(item.price.toNumber())}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(item.price.toNumber() * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4">
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
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(order.totalAmount.toNumber())}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Payment</span>
                <span>
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}{" "}
                  ({order.paymentStatus.toLowerCase()})
                </span>
              </div>
            </CardContent>
          </Card>

          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
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
                <p>Phone: +91 {shippingAddress.phone}</p>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" className="w-full" asChild>
            <a
              href={`https://wa.me/91${siteConfig.whatsapp}?text=${encodeURIComponent(`Hi! I have a query about my order ${order.orderNumber}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Need Help?
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
