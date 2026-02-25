"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore, type RecentlyViewedItem } from "@/stores/recently-viewed-store";

interface TrackProductViewProps {
  product: Omit<RecentlyViewedItem, "viewedAt">;
}

export function TrackProductView({ product }: TrackProductViewProps) {
  const addItem = useRecentlyViewedStore((s) => s.addItem);

  useEffect(() => {
    addItem(product);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
