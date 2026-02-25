"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag, Check, Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WishlistButton } from "@/components/product/wishlist-button";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, getDiscountPercentage, getBlurPlaceholder } from "@/lib/utils";
import { toast } from "sonner";

interface QuickViewProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  fabric: string;
  images: { url: string; alt: string | null }[];
  category?: { name: string; slug: string } | null;
  isNewArrival?: boolean;
}

interface QuickViewModalProps {
  product: QuickViewProduct;
  children: React.ReactNode;
}

export function QuickViewModal({ product, children }: QuickViewModalProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.compareAtPrice, product.price)
    : 0;

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0]?.url || "",
      quantity,
      stock: product.stock,
    });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    openCart();
    setTimeout(() => {
      setAdded(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {children}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden sm:rounded-2xl">
          <DialogTitle className="sr-only">Quick View: {product.name}</DialogTitle>
          <div className="grid sm:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-muted">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 320px"
                  placeholder={getBlurPlaceholder(product.images[0].url) ? "blur" : "empty"}
                  blurDataURL={getBlurPlaceholder(product.images[0].url) || undefined}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
                  <span className="text-5xl font-bold text-primary/10" style={{ fontFamily: "var(--font-heading)" }}>
                    KPT
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {discount > 0 && (
                  <Badge variant="destructive" className="rounded-md px-2 py-0.5 text-xs font-bold shadow-sm">
                    {discount}% OFF
                  </Badge>
                )}
                {product.isNewArrival && (
                  <Badge className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold shadow-sm hover:bg-emerald-600">
                    New
                  </Badge>
                )}
                {outOfStock && (
                  <Badge variant="secondary" className="rounded-md bg-gray-800 text-white px-2 py-0.5 text-xs font-bold shadow-sm">
                    Out of Stock
                  </Badge>
                )}
                {lowStock && (
                  <Badge className="rounded-md bg-amber-500 text-white px-2 py-0.5 text-xs font-bold shadow-sm hover:bg-amber-500">
                    Only {product.stock} left
                  </Badge>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col p-5 sm:p-6">
              {product.category && (
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {product.category.name}
                </span>
              )}
              <h3
                className="mt-1 text-lg font-bold leading-snug sm:text-xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.name}
              </h3>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fabric</span>
                  <span className="font-medium capitalize">
                    {product.fabric.toLowerCase().replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={`font-medium ${outOfStock ? "text-red-600" : lowStock ? "text-amber-600" : "text-emerald-600"}`}>
                    {outOfStock ? "Out of Stock" : lowStock ? `Only ${product.stock} left` : "In Stock"}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-5 space-y-3">
                {/* Quantity */}
                {!outOfStock && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Qty:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Add to cart */}
                <Button
                  className="w-full rounded-xl"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={outOfStock || added}
                >
                  {outOfStock ? (
                    "Out of Stock"
                  ) : added ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> Added!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" /> Add to Cart
                    </span>
                  )}
                </Button>

                {/* Wishlist + View Full */}
                <div className="flex gap-2">
                  <WishlistButton
                    variant="button"
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      compareAtPrice: product.compareAtPrice,
                      image: product.images[0]?.url || null,
                      fabric: product.fabric,
                    }}
                    className="flex-1 rounded-xl"
                  />
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href={`/products/${product.slug}`}>View Full Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Trigger button for product cards */
export function QuickViewTrigger() {
  return (
    <button className="flex items-center justify-center gap-1.5 rounded-lg bg-background/90 backdrop-blur-sm px-3 py-2 text-xs font-medium shadow-lg ring-1 ring-border/50 transition-all hover:bg-background hover:shadow-xl">
      <Eye className="h-3.5 w-3.5" />
      Quick View
    </button>
  );
}
