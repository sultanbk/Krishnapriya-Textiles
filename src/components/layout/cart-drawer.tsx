"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shipping;
  const freeShippingProgress = Math.min((subtotal / 1500) * 100, 100);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col overflow-hidden sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-3 shrink-0">
          <SheetTitle className="flex items-center gap-2.5 font-heading">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse our collection and add sarees you love!
              </p>
            </div>
            <Button asChild className="rounded-full px-6" onClick={closeCart}>
              <Link href="/products">Browse Sarees</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-6 shrink-0">
              {subtotal < 1500 && (
                <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-3 ring-1 ring-emerald-100 dark:from-emerald-950/30 dark:to-teal-950/30 dark:ring-emerald-900/30">
                  <div className="flex items-center gap-2 text-xs">
                    <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 dark:text-emerald-300">
                      Add <span className="font-semibold">{formatPrice(1500 - subtotal)}</span> for free shipping
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {subtotal >= 1500 && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/30">
                  <Truck className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium">You&apos;ve unlocked FREE shipping! ✓</span>
                </div>
              )}
            </div>

            {/* Scrollable items area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6">
              <div className="space-y-3 py-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 rounded-xl bg-muted/20 p-2.5 ring-1 ring-border/30 transition-colors hover:bg-muted/40">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium leading-tight hover:text-primary line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-sm font-semibold text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() =>
                              updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed bottom: totals + buttons */}
            <div className="shrink-0 border-t bg-background px-6 py-4 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>
                    {shipping === 0 ? "FREE ✓" : formatPrice(shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline font-semibold">
                  <span>Total</span>
                  <span className="text-lg text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Button asChild className="w-full rounded-xl" size="lg" onClick={closeCart}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full rounded-xl" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
