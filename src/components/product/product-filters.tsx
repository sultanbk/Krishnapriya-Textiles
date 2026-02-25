"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FABRIC_LABELS, OCCASION_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹3,000", min: 2000, max: 3000 },
  { label: "₹3,000 - ₹5,000", min: 3000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: 99999 },
];

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string }[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // Reset page on filter change
      return params.toString();
    },
    [searchParams]
  );

  /** Toggle a single-select filter (category) */
  const toggleFilter = (name: string, value: string) => {
    const current = searchParams.get(name);
    if (current === value) {
      router.push(`${pathname}?${createQueryString(name, "")}`);
    } else {
      router.push(`${pathname}?${createQueryString(name, value)}`);
    }
  };

  /** Toggle a multi-select filter (fabric, occasion) — comma-separated */
  const toggleMultiFilter = (name: string, value: string) => {
    const current = searchParams.get(name);
    const values = current ? current.split(",").filter(Boolean) : [];
    const idx = values.indexOf(value);
    if (idx >= 0) {
      values.splice(idx, 1);
    } else {
      values.push(value);
    }
    const newValue = values.join(",");
    router.push(`${pathname}?${createQueryString(name, newValue)}`);
  };

  /** Check if a value is active in a multi-select filter */
  const isMultiActive = (name: string, value: string) => {
    const current = searchParams.get(name);
    if (!current) return false;
    return current.split(",").includes(value);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const fabricCount = searchParams.get("fabric")?.split(",").filter(Boolean).length || 0;
  const occasionCount = searchParams.get("occasion")?.split(",").filter(Boolean).length || 0;
  const activeCount = [
    fabricCount > 0,
    occasionCount > 0,
    searchParams.get("category"),
    searchParams.get("minPrice") || searchParams.get("maxPrice"),
  ].filter(Boolean).length;

  const filterContent = (
    <div className="space-y-2">
      {activeCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active Filters ({activeCount})</span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-3 w-3" /> Clear All
          </Button>
        </div>
      )}
      <Accordion type="multiple" defaultValue={["category", "fabric", "price", "occasion"]}>
        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={searchParams.get("category") === cat.slug}
                    onCheckedChange={() => toggleFilter("category", cat.slug)}
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fabric — Multi-select */}
        <AccordionItem value="fabric">
          <AccordionTrigger className="text-sm font-semibold">
            Fabric
            {searchParams.get("fabric") && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {searchParams.get("fabric")!.split(",").length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {Object.entries(FABRIC_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={isMultiActive("fabric", key)}
                    onCheckedChange={() => toggleMultiFilter("fabric", key)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => {
                const isActive =
                  searchParams.get("minPrice") === String(range.min) &&
                  searchParams.get("maxPrice") === String(range.max);
                return (
                  <label
                    key={range.label}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={isActive}
                      onCheckedChange={() => {
                        if (isActive) {
                          const params = new URLSearchParams(searchParams.toString());
                          params.delete("minPrice");
                          params.delete("maxPrice");
                          params.delete("page");
                          router.push(`${pathname}?${params.toString()}`);
                        } else {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set("minPrice", String(range.min));
                          params.set("maxPrice", String(range.max));
                          params.delete("page");
                          router.push(`${pathname}?${params.toString()}`);
                        }
                      }}
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Occasion — Multi-select */}
        <AccordionItem value="occasion">
          <AccordionTrigger className="text-sm font-semibold">
            Occasion
            {searchParams.get("occasion") && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {searchParams.get("occasion")!.split(",").length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {Object.entries(OCCASION_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={isMultiActive("occasion", key)}
                    onCheckedChange={() => toggleMultiFilter("occasion", key)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Desktop filters */}
      <aside className="hidden lg:block w-64 shrink-0">
        <h2 className="font-heading text-lg font-semibold mb-4">Filters</h2>
        {filterContent}
      </aside>

      {/* Mobile filter trigger */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{filterContent}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
