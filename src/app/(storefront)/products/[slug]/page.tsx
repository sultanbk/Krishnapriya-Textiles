import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, Shield, RotateCcw, MessageCircle, Star } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import { ImageGallery } from "@/components/product/image-gallery";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductCard } from "@/components/product/product-card";
import { ShareButton } from "@/components/product/share-button";
import { WhatsAppShareButton } from "@/components/product/whatsapp-share-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatPrice, getDiscountPercentage, getDeliveryEstimate } from "@/lib/utils";
import { FABRIC_LABELS, OCCASION_LABELS } from "@/lib/constants";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ProductJsonLd, BreadcrumbJsonLd, FAQJsonLd } from "@/components/seo/json-ld";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { TrackProductView } from "@/components/product/track-product-view";
import { StickyAddToCart } from "@/components/product/sticky-add-to-cart";
import { PincodeChecker } from "@/components/product/pincode-checker";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  if (!result) {
    return { title: "Product Not Found" };
  }
  const product = result;
  return {
    title: product.metaTitle || `${product.name} | Krishnapriya Textiles`,
    description:
      product.metaDescription ||
      product.shortDescription ||
      product.description?.slice(0, 160) ||
      `Buy ${product.name} online at Krishnapriya Textiles`,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.metaTitle || product.name,
      description:
        product.metaDescription ||
        product.shortDescription ||
        product.description?.slice(0, 160) ||
        "",
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.metaTitle || product.name,
      description: product.shortDescription || product.description?.slice(0, 160) || "",
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result) {
    notFound();
  }

  const product = result;
  const discount = product.compareAtPrice
    ? getDiscountPercentage(Number(product.compareAtPrice), Number(product.price))
    : 0;
  const deliveryEstimate = getDeliveryEstimate();

  // Inline rating stats from the first batch of reviews
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
        product.reviews.length
      : null;
  const reviewCount = product.reviews.length;

  // Deterministic social proof viewer count (changes every hour)
  const viewerCount = ((product.id.charCodeAt(0) + new Date().getHours()) % 15) + 3;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* JSON-LD Structured Data */}
      <ProductJsonLd
        product={{
          name: product.name,
          description: product.description,
          slug: product.slug,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          stock: product.stock,
          images: product.images,
          category: product.category,
          sku: product.sku,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "All Sarees", href: "/products" },
          ...(product.category
            ? [{ name: product.category.name, href: `/categories/${product.category.slug}` }]
            : []),
          { name: product.name, href: `/products/${product.slug}` },
        ]}
      />
      <FAQJsonLd
        questions={[
          {
            question: `What is the price of ${product.name}?`,
            answer: `${product.name} is priced at ${formatPrice(Number(product.price))}${product.compareAtPrice ? ` (originally ${formatPrice(Number(product.compareAtPrice))})` : ""}. Inclusive of all taxes.`,
          },
          {
            question: `What fabric is ${product.name} made of?`,
            answer: `${product.name} is made of ${FABRIC_LABELS[product.fabric as keyof typeof FABRIC_LABELS] || product.fabric} fabric.`,
          },
          {
            question: "What is the shipping policy?",
            answer: `Free shipping on orders above ₹${siteConfig.shipping.freeShippingThreshold}. Standard shipping charge: ₹${siteConfig.shipping.defaultShippingCharge}. Delivery takes 5-7 business days across India.`,
          },
          {
            question: "What is the return policy?",
            answer: "Returns are accepted within 7 days for unused products in original packaging.",
          },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-primary transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
        <Link href="/products" className="hover:text-primary transition-colors shrink-0">
          All Sarees
        </Link>
        <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
        {product.category && (
          <>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-primary transition-colors shrink-0"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
          </>
        )}
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Images */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Product info */}
        <div className="space-y-6">
          {/* Title & price */}
          <div>
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Inline rating badge */}
            {avgRating !== null && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
                <a
                  href="#reviews"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ({reviewCount}{reviewCount === 10 ? "+" : ""} reviews)
                </a>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-primary sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                {formatPrice(Number(product.price))}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(Number(product.compareAtPrice))}
                  </span>
                  <Badge variant="destructive">{discount}% OFF</Badge>
                </>
              )}
              <div className="ml-auto flex items-center gap-2">
                <WishlistButton
                  variant="icon"
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
                    image: product.images[0]?.url || null,
                    fabric: product.fabric as string,
                  }}
                  className="opacity-100 h-9 w-9 bg-muted/50"
                />
                <ShareButton url={`/products/${product.slug}`} title={product.name} />
              </div>
            </div>

            {/* Stock Status */}
            <div className="mt-3 flex items-center gap-2">
              {product.stock <= 0 ? (
                <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                  Out of Stock
                </Badge>
              ) : product.stock <= (product.lowStockThreshold || 5) ? (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                  🔥 Only {product.stock} left — Hurry!
                </Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                  ✓ In Stock
                </Badge>
              )}
              {product.codAvailable && product.stock > 0 && (
                <Badge variant="outline" className="text-xs">
                  COD Available
                </Badge>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Inclusive of all taxes
            </p>
          </div>

          <Separator />

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-muted/30 p-4 sm:p-5 text-sm ring-1 ring-border/50">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Fabric</span>
              <p className="font-medium">
                {FABRIC_LABELS[product.fabric as keyof typeof FABRIC_LABELS] || product.fabric}
              </p>
            </div>
            {product.occasion && product.occasion.length > 0 && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Occasion</span>
                <p className="font-medium">
                  {(product.occasion as string[]).map((o) => OCCASION_LABELS[o as keyof typeof OCCASION_LABELS] || o).join(", ")}
                </p>
              </div>
            )}
            {product.color && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Color</span>
                <p className="font-medium">{product.color}</p>
              </div>
            )}
            {product.blouseIncluded !== null && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Blouse</span>
                <p className="font-medium">
                  {product.blouseIncluded ? "Included" : "Not included"}
                </p>
              </div>
            )}
            {product.borderType && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Border</span>
                <p className="font-medium">{product.borderType}</p>
              </div>
            )}
            {product.zariType && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Zari</span>
                <p className="font-medium">{product.zariType}</p>
              </div>
            )}
            {product.length && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Length</span>
                <p className="font-medium">{product.length}</p>
              </div>
            )}
            {product.width && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Width</span>
                <p className="font-medium">{product.width}</p>
              </div>
            )}
            {product.weight && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Weight</span>
                <p className="font-medium">{product.weight}</p>
              </div>
            )}
            {product.blouseIncluded && product.blouseLength && (
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Blouse Length</span>
                <p className="font-medium">{product.blouseLength}</p>
              </div>
            )}
            {product.sku && (
              <div className="space-y-0.5 col-span-2">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">SKU</span>
                <p className="font-medium font-mono text-xs text-muted-foreground">{product.sku}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Social proof */}
          {product.stock > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50/60 px-3.5 py-2.5 text-sm ring-1 ring-red-100 dark:bg-red-950/20 dark:ring-red-900/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="text-red-700 dark:text-red-400 font-medium">
                {viewerCount} people are viewing this right now
              </span>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              stock: product.stock,
              image: product.images[0]?.url,
            }}
            showBuyNow
          />

          {/* Pincode Checker */}
          <PincodeChecker />

          {/* Trust signals */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground ring-1 ring-border/30 transition-all hover:ring-primary/20 hover:bg-muted/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900/30">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium leading-tight">
                {Number(product.price) >= 1500 ? "Free Shipping" : "₹99 shipping"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground ring-1 ring-border/30 transition-all hover:ring-primary/20 hover:bg-muted/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900/30">
                <Shield className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium leading-tight">100% Authentic</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground ring-1 ring-border/30 transition-all hover:ring-primary/20 hover:bg-muted/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100 dark:bg-amber-950/30 dark:ring-amber-900/30">
                <RotateCcw className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-medium leading-tight">7 Day Returns</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground ring-1 ring-border/30 transition-all hover:ring-primary/20 hover:bg-muted/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 ring-1 ring-purple-100 dark:bg-purple-950/30 dark:ring-purple-900/30">
                <MessageCircle className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-xs font-medium leading-tight">WhatsApp Support</span>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-4 text-sm ring-1 ring-border/50">
            <p className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>📦 Estimated Delivery</p>
            <p className="mt-0.5 text-muted-foreground">{deliveryEstimate.from} – {deliveryEstimate.to}</p>
          </div>

          {/* WhatsApp inquiry */}
          <div className="flex flex-col gap-2.5">
            <Button variant="outline" className="w-full rounded-xl border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300 transition-all" asChild>
              <a
                href={`https://wa.me/91${siteConfig.whatsapp}?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" (${product.sku}). Can you share more details?`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask about this saree on WhatsApp
              </a>
            </Button>
            <WhatsAppShareButton
              productName={product.name}
              productPrice={formatPrice(Number(product.price))}
              productSlug={product.slug}
            />
          </div>

          {/* Accordion Details */}
          <Accordion type="multiple" defaultValue={["description"]}>
            {product.description && (
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            )}
            {product.palluDetail && (
              <AccordionItem value="pallu">
                <AccordionTrigger>Pallu Detail</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    {product.palluDetail}
                  </p>
                </AccordionContent>
              </AccordionItem>
            )}
            {product.washCare && (
              <AccordionItem value="care">
                <AccordionTrigger>Wash & Care</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    {product.washCare}
                  </p>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Free shipping on orders above ₹{siteConfig.shipping.freeShippingThreshold}.
                    Standard shipping charge: ₹{siteConfig.shipping.defaultShippingCharge}.
                  </p>
                  <p>Delivery: 5-7 business days across India.</p>
                  <p>
                    Returns accepted within 7 days for unused products in
                    original packaging.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Customer Reviews */}
      <ProductReviews productId={product.id} productName={product.name} />

      {/* Related Products */}
      <RelatedProducts productId={product.id} categoryId={product.categoryId} />

      {/* Recently Viewed */}
      <RecentlyViewed currentProductId={product.id} />

      {/* Track this product view */}
      <TrackProductView
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          image: product.images[0]?.url || null,
          fabric: product.fabric as string,
        }}
      />

      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          stock: product.stock,
          image: product.images[0]?.url,
        }}
      />
    </div>
  );
}

async function RelatedProducts({
  productId,
  categoryId,
}: {
  productId: string;
  categoryId: string | null;
}) {
  const related = await getRelatedProducts(productId, categoryId);
  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3">
        <h2
          className="text-xl font-bold tracking-tight sm:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          You May Also Like
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {related.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
