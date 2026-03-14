import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FABRIC_LABELS } from "@/lib/constants";
import { ProductArchiveButton } from "./product-archive-button";

interface AdminProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const perPage = 20;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { sku: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString("en-IN")} total products
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Product
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="p-3 sm:p-4">
        <form className="flex gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search by name or SKU..."
              defaultValue={search}
              className="pl-9 h-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="h-9 px-3">
            Search
          </Button>
        </form>
      </Card>

      {/* Products list */}
      <Card className="overflow-hidden">
        {/* Desktop header */}
        <div className="hidden lg:grid grid-cols-[2.5fr_0.8fr_1fr_0.8fr_0.6fr_0.6fr_0.4fr] gap-4 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium text-muted-foreground">
          <span>Product</span>
          <span>SKU</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
          <span></span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Package className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No products found</p>
            <p className="text-xs">Try adjusting your search</p>
          </div>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div
                key={product.id}
                className="group transition-colors hover:bg-muted/40"
              >
                {/* Desktop row */}
                <div className="hidden lg:grid grid-cols-[2.5fr_0.8fr_1fr_0.8fr_0.6fr_0.6fr_0.4fr] gap-4 items-center px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="truncate text-sm font-medium hover:underline block"
                      >
                        {product.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {FABRIC_LABELS[product.fabric as keyof typeof FABRIC_LABELS] || product.fabric}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
                  <span className="text-sm text-muted-foreground">{product.category?.name || "—"}</span>
                  <div>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatPrice(product.price.toNumber())}
                    </span>
                    {product.compareAtPrice && (
                      <span className="ml-1 text-[10px] text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice.toNumber())}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`w-fit border-0 text-[10px] font-medium ${
                      product.stock <= 0
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        : product.stock <= 5
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                    }`}
                  >
                    {product.stock}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`w-fit border-0 text-[10px] font-medium ${
                      product.isActive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {product.isActive ? "Active" : "Draft"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <ProductArchiveButton
                        productId={product.id}
                        isActive={product.isActive}
                        productName={product.name}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile row */}
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 px-4 py-3 lg:hidden"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{product.category?.name || "—"}</span>
                      <span>·</span>
                      <span className="font-mono">{product.sku}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatPrice(product.price.toNumber())}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`mt-0.5 border-0 text-[10px] font-medium ${
                        product.stock <= 5
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                          : ""
                      }`}
                    >
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground tabular-nums">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                <Link href={{ query: { ...params, page: page - 1 } }}>
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Link>
              </Button>
            )}
            <span className="text-xs text-muted-foreground tabular-nums">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                <Link href={{ query: { ...params, page: page + 1 } }}>
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
