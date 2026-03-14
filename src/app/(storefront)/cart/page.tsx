"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 1500 ? 0 : subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;
  const freeShippingProgress = Math.min((subtotal / 1500) * 100, 100);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/50">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Looks like you haven&apos;t added any sarees yet. Explore our collection to find your perfect drape.
        </p>
        <Button asChild className="mt-6 rounded-full px-8" size="lg">
          <Link href="/products">
            Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-2">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">Shopping Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} item(s) in your cart</p>
        <div className="mt-2 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary/60 to-transparent" />
      </div>

      {/* Free shipping progress */}
      {subtotal < 1500 && subtotal > 0 && (
        <div className="mt-4 mb-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 ring-1 ring-emerald-100 dark:from-emerald-950/30 dark:to-teal-950/30 dark:ring-emerald-900/30">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-800 dark:text-emerald-300">
              Add <span className="font-semibold">{formatPrice(1500 - subtotal)}</span> more for <span className="font-semibold">FREE shipping!</span>
            </span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, index) => (
            <Card key={item.productId} className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md" style={{ animationDelay: `${index * 50}ms` }}>
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-28 w-22 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="88px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() =>
                          updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-24 rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="font-heading text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>
                  {shipping === 0 ? "FREE ✓" : formatPrice(shipping)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Inclusive of all taxes</p>
              <div className="space-y-2 pt-2">
                <Button asChild className="w-full rounded-xl" size="lg">
                  <Link href="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-2 pt-3">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Truck className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground leading-tight">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground leading-tight">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground leading-tight">Easy Returns</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
