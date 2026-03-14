import { Suspense } from "react";
import { Metadata } from "next";
import { getProducts, getCategories } from "@/actions/products";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { ProductSearch } from "@/components/product/product-search";
import { ProductGridWithLoadMore } from "@/components/product/product-grid-load-more";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { CollectionPageJsonLd } from "@/components/seo/json-ld";
import { FABRIC_LABELS, OCCASION_LABELS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "All Sarees | Krishnapriya Textiles",
  description:
    "Browse our curated collection of 500+ sarees — silk, cotton, chiffon and more. Free shipping on orders above ₹1500.",
  alternates: {
    canonical: "/products",
  },
};

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    fabric?: string;
    occasion?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    inStock?: string;
  }>;
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <Skeleton className="aspect-[3/4] rounded-xl" />
          <Skeleton className="h-3 w-2/3 rounded-full" />
          <Skeleton className="h-4 w-4/5 rounded-full" />
          <Skeleton className="h-4 w-1/3 rounded-full" />
        </div>
      ))}
    </div>
  );
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: {
    page?: string;
    sort?: string;
    fabric?: string;
    occasion?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    inStock?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({
      page,
      sort: searchParams.sort as "newest" | "price_asc" | "price_desc" | "popular" | undefined,
      fabric: searchParams.fabric ? searchParams.fabric.split(",") : undefined,
      occasion: searchParams.occasion ? searchParams.occasion.split(",") : undefined,
      category: searchParams.category,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      search: searchParams.search,
      inStock: searchParams.inStock === "true",
    }),
    getCategories(),
  ]);

  const products = productsResult.items || [];
  const pagination = productsResult;
  const categories = categoriesResult || [];

  // Build active filter chip URLs
  function removeFilterUrl(overrides: Record<string, string | undefined>) {
    const merged: Record<string, string> = {};
    for (const [k, v] of Object.entries(searchParams)) {
      if (v) merged[k] = v;
    }
    for (const [k, v] of Object.entries(overrides)) {
      if (v) merged[k] = v;
      else delete merged[k];
    }
    delete merged.page;
    const qs = new URLSearchParams(merged).toString();
    return qs ? `/products?${qs}` : "/products";
  }

  const activeChips: { label: string; href: string }[] = [];
  if (searchParams.inStock === "true") {
    activeChips.push({ label: "In Stock Only", href: removeFilterUrl({ inStock: undefined }) });
  }
  if (searchParams.category) {
    const catName = categories.find((c: { slug: string; name: string }) => c.slug === searchParams.category)?.name || searchParams.category;
    activeChips.push({ label: catName, href: removeFilterUrl({ category: undefined }) });
  }
  const fabrics = searchParams.fabric?.split(",").filter(Boolean) || [];
  for (const fab of fabrics) {
    const remaining = fabrics.filter((f) => f !== fab).join(",");
    activeChips.push({
      label: FABRIC_LABELS[fab as keyof typeof FABRIC_LABELS] || fab,
      href: removeFilterUrl({ fabric: remaining || undefined }),
    });
  }
  const occasions = searchParams.occasion?.split(",").filter(Boolean) || [];
  for (const occ of occasions) {
    const remaining = occasions.filter((o) => o !== occ).join(",");
    activeChips.push({
      label: OCCASION_LABELS[occ as keyof typeof OCCASION_LABELS] || occ,
      href: removeFilterUrl({ occasion: remaining || undefined }),
    });
  }
  if (searchParams.minPrice || searchParams.maxPrice) {
    const min = searchParams.minPrice ? `₹${searchParams.minPrice}` : "";
    const max = searchParams.maxPrice ? `₹${searchParams.maxPrice}` : "";
    activeChips.push({
      label: min && max ? `${min} – ${max}` : min || max,
      href: removeFilterUrl({ minPrice: undefined, maxPrice: undefined }),
    });
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Collection SEO */}
      <CollectionPageJsonLd
        name="All Sarees"
        description="Browse our curated collection of premium sarees — silk, cotton, chiffon and more."
        url="/products"
        products={products.map((p: any) => ({
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          image: p.images[0]?.url,
        }))}
      />

      <Suspense>
        <ProductFilters categories={categories} />
      </Suspense>

      <div className="flex-1 min-w-0">
        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Active:</span>
            {activeChips.map((chip) => (
              <Link
                key={chip.label + chip.href}
                href={chip.href}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 hover:bg-primary/20 transition-colors"
              >
                {chip.label}
                <X className="h-3 w-3 opacity-60" />
              </Link>
            ))}
            <Link
              href="/products"
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              Clear all
            </Link>
          </div>
        )}

        {/* Sort and count header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/30 p-3 ring-1 ring-border/40 backdrop-blur-sm sm:p-4">
          <p className="text-sm text-muted-foreground">
            {pagination && pagination.total > 0 ? (
              <>
                Showing <span className="font-medium text-foreground">{(page - 1) * 12 + 1}–{Math.min(page * 12, pagination.total)}</span> of{" "}
                <span className="font-medium text-foreground">{pagination.total}</span> sarees
              </>
            ) : (
              "No products found"
            )}
          </p>
          <Suspense>
            <ProductSort />
          </Suspense>
        </div>

        {/* Product grid with load more */}
        {products.length > 0 ? (
          <ProductGridWithLoadMore
            initialProducts={products}
            initialHasMore={pagination.hasNext}
            initialTotal={pagination.total}
            filters={{
              sort: searchParams.sort as "newest" | "price_asc" | "price_desc" | "popular" | undefined,
              fabric: searchParams.fabric ? searchParams.fabric.split(",") : undefined,
              occasion: searchParams.occasion ? searchParams.occasion.split(",") : undefined,
              category: searchParams.category,
              minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
              maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
              search: searchParams.search,
              inStock: searchParams.inStock === "true",
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted shadow-inner">
              <Search className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="mt-5 text-lg font-semibold" style={{ fontFamily: "var(--font-heading)" }}>No sarees found</p>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters or search terms to discover more sarees
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-full px-6">
              <Link href="/products">Clear all filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  return (
    <div className="container mx-auto px-4 py-8 sm:py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-secondary font-medium">Our Collection</p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
          {params.search ? `Search: "${params.search}"` : "All Sarees"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Discover our handpicked collection of premium sarees
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-0.5 w-8 rounded-full bg-primary/60" />
          <div className="h-0.5 w-3 rounded-full bg-secondary/60" />
        </div>

        {/* Search Bar */}
        <div className="mt-5 max-w-xl">
          <Suspense>
            <ProductSearch />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsContent searchParams={params} />
      </Suspense>
    </div>
  );
}
