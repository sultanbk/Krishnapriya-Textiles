"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  fabric: string;
  viewedAt: number;
}

interface RecentlyViewedStore {
  items: RecentlyViewedItem[];
  addItem: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  getItems: (excludeId?: string) => RecentlyViewedItem[];
}

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const filtered = get().items.filter((i) => i.id !== item.id);
        const updated = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(
          0,
          MAX_ITEMS
        );
        set({ items: updated });
      },

      getItems: (excludeId) => {
        return get().items.filter((i) => i.id !== excludeId);
      },
    }),
    {
      name: "kpt-recently-viewed",
    }
  )
);
