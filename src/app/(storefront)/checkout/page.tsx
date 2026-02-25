"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, CreditCard, Banknote, ArrowRight, ShoppingBag, Plus, Tag, Check, X } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { checkoutSchema } from "@/validators/order";
import { createOrderAction } from "@/actions/checkout";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface AddressData {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearItems = useCartStore((s) => s.clearItems);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shipping - couponDiscount;

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema) as any,
    defaultValues: {
      addressId: "",
      paymentMethod: "PREPAID",
      couponCode: "",
      customerNote: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("/api/addresses");
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
          const defaultAddr = data.find((a: AddressData) => a.isDefault);
          if (defaultAddr) {
            form.setValue("addressId", defaultAddr.id);
          }
        }
      } catch {
        // User may not have addresses yet
      } finally {
        setLoadingAddresses(false);
      }
    }
    fetchAddresses();
  }, [form]);

  async function onSubmit(data: CheckoutFormData) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      // Sync client cart to database before placing order
      const syncRes = await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!syncRes.ok) {
        const err = await syncRes.json();
        throw new Error(err.error || "Failed to sync cart");
      }

      const result = await createOrderAction({
        addressId: data.addressId,
        paymentMethod: data.paymentMethod,
        couponCode: data.couponCode || undefined,
        customerNote: data.customerNote || undefined,
      });

      if (result.success && result.data) {
        if (data.paymentMethod === "PREPAID" && result.data.razorpayOrderId) {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: total * 100,
            currency: "INR",
            name: "Krishnapriya Textiles",
            description: `Order ${result.data.orderNumber}`,
            order_id: result.data.razorpayOrderId,
            handler: async function (response: Record<string, string>) {
              const { verifyPaymentAction } = await import("@/actions/checkout");
              const verifyResult = await verifyPaymentAction({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              if (verifyResult.success) {
                clearItems();
                toast.success("Payment successful!");
                router.push(`/orders/${result.data!.orderId}/confirmation`);
              } else {
                toast.error("Payment verification failed");
              }
            },
            theme: { color: "#800020" },
          };
          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } else {
          clearItems();
          toast.success("Order placed successfully!");
          router.push(`/orders/${result.data.orderId}/confirmation`);
        }
      } else if (!result.success) {
        toast.error(result.error || "Failed to place order");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/30" />
        <h1 className="mt-4 font-heading text-2xl font-bold">Cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add some sarees to your cart before checking out.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-muted-foreground">Complete your order</p>

        {/* Progress Steps */}
        <div className="mt-6 flex items-center justify-center gap-0 sm:gap-2">
          {[
            { step: 1, label: "Cart", icon: ShoppingBag, done: true },
            { step: 2, label: "Address & Payment", icon: MapPin, done: false, active: true },
            { step: 3, label: "Confirmation", icon: Check, done: false },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center">
              {i > 0 && (
                <div className={`h-0.5 w-6 sm:w-10 ${s.done ? "bg-primary" : "bg-border"}`} />
              )}
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  s.done ? "bg-primary text-primary-foreground" :
                  s.active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {s.done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium ${s.active ? "text-primary" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Address Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-heading text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingAddresses ? (
                      <div className="flex items-center justify-center py-8">
                        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground mb-4">
                          No saved addresses. Add an address to continue.
                        </p>
                        <Button asChild variant="outline">
                          <Link href="/addresses/new?redirect=checkout">
                            <Plus className="h-4 w-4 mr-2" /> Add Address
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="addressId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="space-y-3"
                              >
                                {addresses.map((addr) => (
                                  <label
                                    key={addr.id}
                                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                                      field.value === addr.id ? "border-primary bg-primary/5" : ""
                                    }`}
                                  >
                                    <RadioGroupItem value={addr.id} className="mt-1" />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{addr.fullName}</span>
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{addr.label}</span>
                                        {addr.isDefault && (
                                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {addr.city}, {addr.state} - {addr.pincode}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Phone: +91 {addr.phone}</p>
                                    </div>
                                  </label>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-heading text-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="PREPAID" />
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-primary" />
                                  <div>
                                    <p className="text-sm font-medium">Pay Online</p>
                                    <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking via Razorpay</p>
                                  </div>
                                </div>
                              </label>
                              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="COD" />
                                <div className="flex items-center gap-2">
                                  <Banknote className="h-4 w-4 text-primary" />
                                  <div>
                                    <p className="text-sm font-medium">Cash on Delivery</p>
                                    <p className="text-xs text-muted-foreground">Pay when you receive the order</p>
                                  </div>
                                </div>
                              </label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Coupon & Notes */}
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Coupon Code (Optional)
                      </label>
                      {couponApplied ? (
                        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              {couponApplied} applied — you save {formatPrice(couponDiscount)}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="rounded p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900"
                            onClick={() => {
                              setCouponApplied(null);
                              setCouponDiscount(0);
                              setCouponError(null);
                              form.setValue("couponCode", "");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name="couponCode"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter coupon code"
                                    className="uppercase"
                                    disabled={checkingCoupon}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={checkingCoupon || !form.watch("couponCode")}
                            onClick={async () => {
                              const code = form.getValues("couponCode");
                              if (!code) return;
                              setCheckingCoupon(true);
                              setCouponError(null);
                              try {
                                const res = await fetch("/api/coupons/check", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ code, subtotal }),
                                });
                                const data = await res.json();
                                if (data.valid) {
                                  setCouponDiscount(data.discount);
                                  setCouponApplied(data.code);
                                  setCouponError(null);
                                  toast.success(`Coupon applied! You save ${formatPrice(data.discount)}`);
                                } else {
                                  setCouponError(data.error || "Invalid coupon");
                                  setCouponDiscount(0);
                                  setCouponApplied(null);
                                }
                              } catch {
                                setCouponError("Failed to verify coupon");
                              } finally {
                                setCheckingCoupon(false);
                              }
                            }}
                          >
                            {checkingCoupon ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <>
                                <Tag className="mr-1.5 h-4 w-4" /> Apply
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      {couponError && (
                        <p className="mt-1.5 text-xs text-destructive">{couponError}</p>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name="customerNote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Any special instructions for your order..." rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground line-clamp-1 flex-1 pr-2">
                          {item.name} × {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={shipping === 0 ? "text-green-600" : ""}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" /> Coupon Discount
                        </span>
                        <span className="text-green-600 font-medium">
                          −{formatPrice(couponDiscount)}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading || addresses.length === 0}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Place Order <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
