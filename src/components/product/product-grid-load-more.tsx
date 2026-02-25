"use client";

import { useState, useTransition } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/actions/products";
import type { ProductFilters } from "@/types";

interface ProductGridWithLoadMoreProps {
  initialProducts: any[];
  initialHasMore: boolean;
  initialTotal: number;
  filters: ProductFilters;
}

export function ProductGridWithLoadMore({
  initialProducts,
  initialHasMore,
  initialTotal,
  filters,
}: ProductGridWithLoadMoreProps) {
  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await getProducts({ ...filters, page: nextPage });
      setProducts((prev) => [...prev, ...result.items]);
      setHasMore(result.hasNext);
      setPage(nextPage);
    });
  };

  if (products.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl px-8 gap-2"
            onClick={loadMore}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more sarees...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Load More Sarees ({products.length} of {initialTotal})
              </>
            )}
          </Button>
        </div>
      )}

      {!hasMore && products.length > 12 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          You&apos;ve browsed all {products.length} sarees ✨
        </p>
      )}
    </>
  );
}
