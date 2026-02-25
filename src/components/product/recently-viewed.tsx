"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRecentlyViewedStore, type RecentlyViewedItem } from "@/stores/recently-viewed-store";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";

interface RecentlyViewedProps {
  currentProductId: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const getItems = useRecentlyViewedStore((s) => s.getItems);

  // Hydrate after mount to avoid SSR mismatch
  useEffect(() => {
    setItems(getItems(currentProductId));
  }, [currentProductId, getItems]);

  if (items.length === 0) return null;

  return (
    <div className="mt-16">
      <h2
        className="text-xl font-bold tracking-tight sm:text-2xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Recently Viewed
      </h2>
      <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary/60 to-transparent" />

      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:gap-5 scrollbar-thin">
        {items.slice(0, 8).map((item) => {
          const discount = item.compareAtPrice
            ? getDiscountPercentage(item.compareAtPrice, item.price)
            : 0;

          return (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="group block w-[160px] shrink-0 sm:w-[200px]"
            >
              <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:shadow-lg hover:ring-primary/20">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="200px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
                      <span
                        className="text-2xl font-bold text-primary/10"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        KPT
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="absolute left-2 top-2">
                      <span className="rounded-md bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2.5 sm:p-3">
                  <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                    {item.fabric.toLowerCase().replace(/_/g, " ")}
                  </p>
                  <h3
                    className="mt-1 text-xs font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-primary sm:text-sm"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                    {item.compareAtPrice && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
