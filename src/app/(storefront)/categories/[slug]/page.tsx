import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getProducts, getCategories } from "@/actions/products";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    fabric?: string;
    occasion?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug, isActive: true },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Krishnapriya Textiles`,
    description:
      category.description ||
      `Shop ${category.name} from Krishnapriya Textiles. Premium quality sarees with free shipping on orders above ₹1500.`,
  };
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

async function CategoryProducts({
  categorySlug,
  categoryName,
  searchParams,
}: {
  categorySlug: string;
  categoryName: string;
  searchParams: {
    page?: string;
    sort?: string;
    fabric?: string;
    occasion?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({
      page,
      sort: searchParams.sort as
        | "newest"
        | "price_asc"
        | "price_desc"
        | "popular"
        | undefined,
      fabric: searchParams.fabric
        ? searchParams.fabric.split(",")
        : undefined,
      occasion: searchParams.occasion
        ? searchParams.occasion.split(",")
        : undefined,
      category: categorySlug,
      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,
      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined,
    }),
    getCategories(),
  ]);

  const products = productsResult.items || [];
  const pagination = productsResult;
  const categories = categoriesResult || [];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <Suspense>
        <ProductFilters categories={categories} />
      </Suspense>

      <div className="flex-1 min-w-0">
        {/* Sort and count header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/30 p-3 ring-1 ring-border/50 sm:p-4">
          <p className="text-sm text-muted-foreground">
            {pagination ? (
              <>
                Showing {products.length > 0 ? (page - 1) * 12 + 1 : 0}–
                {Math.min(page * 12, pagination.total)} of {pagination.total}{" "}
                sarees in {categoryName}
              </>
            ) : (
              "No products found"
            )}
          </p>
          <Suspense>
            <ProductSort />
          </Suspense>
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={{
                        pathname: `/categories/${categorySlug}`,
                        query: { ...searchParams, page: page - 1 },
                      }}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                    </Link>
                  </Button>
                )}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === pagination.totalPages ||
                        Math.abs(p - page) <= 2
                    )
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && p - prev > 1;
                      return (
                        <span key={p} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-1 text-muted-foreground">
                              …
                            </span>
                          )}
                          <Button
                            variant={p === page ? "default" : "outline"}
                            size="sm"
                            className="h-9 w-9 rounded-lg p-0"
                            asChild={p !== page}
                          >
                            {p !== page ? (
                              <Link
                                href={{
                                  pathname: `/categories/${categorySlug}`,
                                  query: { ...searchParams, page: p },
                                }}
                              >
                                {p}
                              </Link>
                            ) : (
                              <span>{p}</span>
                            )}
                          </Button>
                        </span>
                      );
                    })}
                </div>
                {page < pagination.totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={{
                        pathname: `/categories/${categorySlug}`,
                        query: { ...searchParams, page: page + 1 },
                      }}
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p
              className="mt-4 text-lg font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No sarees found in {categoryName}
            </p>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters or check back later for new arrivals
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-xl">
              <Link href={`/categories/${categorySlug}`}>Clear filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/categories"
          className="hover:text-primary transition-colors"
        >
          Collections
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">{category.name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="mt-0.5 h-9 w-9 shrink-0 rounded-lg"
          >
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {category.description}
              </p>
            )}
            <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary/60 to-transparent" />
          </div>
        </div>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <CategoryProducts
          categorySlug={slug}
          categoryName={category.name}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </div>
  );
}
