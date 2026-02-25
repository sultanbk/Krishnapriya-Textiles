"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Button } from "@/components/ui/button";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem, clearAll } = useWishlistStore();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            My Wishlist
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {items.length === 0
              ? "Your wishlist is empty"
              : `${items.length} saree${items.length !== 1 ? "s" : ""} saved`}
          </p>
          <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary/60 to-transparent" />
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearAll();
              toast.success("Wishlist cleared");
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Heart className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <p
            className="mt-4 text-lg font-semibold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            No saved sarees yet
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Tap the heart icon on any saree to save it here for later
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Sarees
            </Link>
          </Button>
        </div>
      ) : (
        /* Wishlist grid */
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((item) => {
            const discount = item.compareAtPrice
              ? getDiscountPercentage(item.compareAtPrice, item.price)
              : 0;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:shadow-lg hover:ring-primary/20"
              >
                <Link href={`/products/${item.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
                        <span
                          className="text-4xl font-bold text-primary/10"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          KPT
                        </span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="absolute left-2.5 top-2.5">
                        <span className="rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          {discount}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {item.fabric.toLowerCase().replace(/_/g, " ")}
                    </p>
                    <h3
                      className="mt-1.5 text-sm font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-primary sm:text-base"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.name}
                    </h3>
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="text-base font-bold text-primary sm:text-lg">
                        {formatPrice(item.price)}
                      </span>
                      {item.compareAtPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => {
                    removeItem(item.id);
                    toast.success("Removed from wishlist");
                  }}
                  className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-red-50"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
