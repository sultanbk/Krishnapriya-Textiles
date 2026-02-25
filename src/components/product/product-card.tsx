import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/product/wishlist-button";
import { QuickViewModal, QuickViewTrigger } from "@/components/product/quick-view-modal";
import { formatPrice, getDiscountPercentage, getBlurPlaceholder } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    images: { url: string; alt: string | null }[];
    fabric: string;
    isNew?: boolean;
    isNewArrival?: boolean;
    category?: { name: string; slug: string } | null;
  };
}

export function ProductCard({ product: rawProduct }: ProductCardProps) {
  // Coerce Prisma Decimal values to plain numbers so they can cross the
  // Server → Client Component boundary (WishlistButton, QuickViewModal).
  const product = {
    ...rawProduct,
    price: Number(rawProduct.price),
    compareAtPrice: rawProduct.compareAtPrice != null ? Number(rawProduct.compareAtPrice) : null,
    stock: Number(rawProduct.stock ?? 0),
  };

  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.compareAtPrice, product.price)
    : 0;

  const outOfStock = (product.stock ?? 0) <= 0;
  const lowStock = !outOfStock && (product.stock ?? 0) <= 5;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className={`overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:shadow-lg hover:ring-primary/20 ${outOfStock ? "opacity-75" : ""}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder={getBlurPlaceholder(product.images[0].url) ? "blur" : "empty"}
              blurDataURL={getBlurPlaceholder(product.images[0].url) || undefined}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
              <span className="text-4xl font-bold text-primary/10" style={{ fontFamily: "var(--font-heading)" }}>KPT</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge variant="destructive" className="rounded-md px-2 py-0.5 text-[10px] font-bold shadow-sm">
                {discount}% OFF
              </Badge>
            )}
            {(product.isNew || product.isNewArrival) && (
              <Badge className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold shadow-sm hover:bg-emerald-600">
                New
              </Badge>
            )}
            {outOfStock && (
              <Badge variant="secondary" className="rounded-md bg-gray-800 text-white px-2 py-0.5 text-[10px] font-bold shadow-sm">
                Sold Out
              </Badge>
            )}
            {lowStock && (
              <Badge className="rounded-md bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold shadow-sm hover:bg-amber-500">
                Only {product.stock} left
              </Badge>
            )}
          </div>
          {/* Wishlist */}
          <div className="absolute right-2.5 top-2.5 z-10 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100 [&:has(button[data-wishlisted=true])]:!opacity-100">
            <WishlistButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                image: product.images[0]?.url || null,
                fabric: product.fabric,
              }}
            />
          </div>
          {/* Quick View */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 z-10">
            <QuickViewModal
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                stock: product.stock ?? 0,
                fabric: product.fabric,
                images: product.images,
                category: product.category,
                isNewArrival: product.isNew || product.isNewArrival,
              }}
            >
              <QuickViewTrigger />
            </QuickViewModal>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {product.fabric.toLowerCase().replace(/_/g, " ")}
          </p>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-primary sm:text-base" style={{ fontFamily: "var(--font-heading)" }}>
            {product.name}
          </h3>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base font-bold text-primary sm:text-lg">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
