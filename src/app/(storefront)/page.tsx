import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Headphones, Star, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { db } from "@/lib/db";
import { getFeaturedProducts, getNewArrivals, getBudgetProducts, getCategories } from "@/actions/products";
import { siteConfig } from "@/config/site";
import { InstagramEmbed } from "@/components/instagram-embed";
import { BannerCarousel } from "@/components/banner-carousel";
import { getSiteImage } from "@/lib/site-images";
import { ProductCard as SharedProductCard } from "@/components/product/product-card";

/* ──────────────────────────── Section Header ──────────────────────────── */

function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View All",
  centered = false,
}: {
  title: string;
  subtitle: string;
  href?: string;
  linkText?: string;
  centered?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1 ${centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div>
        <h2
          className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        {centered && (
          <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
        )}
      </div>
      {href && (
        <Button asChild variant="ghost" className="mt-3 group/btn gap-1 text-primary hover:text-primary sm:mt-0">
          <Link href={href}>
            {linkText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      )}
    </div>
  );
}

/* ──────────────────────────── Hero Banner ──────────────────────────── */

async function HeroBanner() {
  const banners = await db.banner.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
    select: { id: true, title: true, subtitle: true, image: true, mobileImage: true, link: true },
  });

  // If we have banners in the database, show the carousel
  if (banners.length > 0) {
    return (
      <section>
        <BannerCarousel banners={banners} />
      </section>
    );
  }

  // Fallback: static hero when no banners are configured
  const heroVisual = await getSiteImage("hero-visual");

  return (
    <section className="relative overflow-hidden">
      {/* Background with elegant pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/10" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container relative mx-auto px-4 py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              Premium Collection
            </div>
            <h1
              className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Timeless Elegance,{" "}
              <span className="relative">
                <span className="text-primary">Woven in Tradition</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C40 2 60 2 100 4C140 6 160 3 199 5.5" stroke="oklch(0.72 0.1 85)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Discover handpicked sarees from the finest weavers of Karnataka.
              From pure Mysore silk to everyday cotton — find your perfect drape.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                <Link href="/products">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8 text-base border-2">
                <Link href="/products?occasion=WEDDING">Wedding Sarees</Link>
              </Button>
            </div>
            {/* Quick stats */}
            <div className="flex items-center gap-6 pt-4 sm:gap-10">
              <div>
                <p className="text-2xl font-bold text-primary sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>500+</p>
                <p className="text-xs text-muted-foreground sm:text-sm">Curated Sarees</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>100%</p>
                <p className="text-xs text-muted-foreground sm:text-sm">Authentic Weaves</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Free</p>
                <p className="text-xs text-muted-foreground sm:text-sm">Shipping ₹1500+</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 ring-1 ring-border/50 shadow-2xl">
              {heroVisual ? (
                <Image
                  src={heroVisual}
                  alt="Krishnapriya Textiles"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 0px, 40vw"
                  priority
                />
              ) : (
                <>
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Crown className="mx-auto h-10 w-10 text-secondary/40" />
                      <p className="text-7xl font-bold text-primary/15" style={{ fontFamily: "var(--font-display)" }}>KPT</p>
                      <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground/60">Premium Sarees</p>
                      <div className="mx-auto h-0.5 w-16 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="absolute -bottom-3 -left-3 rounded-xl bg-card px-5 py-3 shadow-lg ring-1 ring-border/50">
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>₹499</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Features Bar ──────────────────────────── */

function FeaturesBar() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "Orders above ₹1,500" },
    { icon: Shield, title: "100% Authentic", desc: "Genuine handloom" },
    { icon: Headphones, title: "WhatsApp Support", desc: "Quick assistance" },
    { icon: Star, title: "500+ Sarees", desc: "Curated collection" },
  ];
  return (
    <section className="border-y bg-card/50">
      <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-6 sm:py-8 lg:grid-cols-4 lg:gap-8">
        {features.map((f, i) => (
          <div key={f.title} className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 sm:h-12 sm:w-12">
              <f.icon className="h-5 w-5 text-primary sm:h-[22px] sm:w-[22px]" />
            </div>
            <div>
              <p className="text-xs font-semibold sm:text-sm">{f.title}</p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────── Featured Section ──────────────────────────── */

async function FeaturedSection() {
  let products: any[] = [];
  try {
    products = await getFeaturedProducts();
  } catch { }

  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-14 sm:py-20">
      <SectionHeader
        title="Featured Collection"
        subtitle="Our most loved sarees, handpicked for you"
        href="/products?featured=true"
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:mt-10">
        {products.map((product: any) => (
          <SharedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────── Categories Section ──────────────────────────── */

async function CategoriesSection() {
  let categories: any[] = [];
  try {
    categories = await getCategories();
  } catch { }

  if (categories.length === 0) return null;

  const gradients = [
    "from-rose-50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/10",
    "from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10",
    "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10",
    "from-violet-50 to-violet-100/50 dark:from-violet-950/20 dark:to-violet-900/10",
    "from-sky-50 to-sky-100/50 dark:from-sky-950/20 dark:to-sky-900/10",
    "from-fuchsia-50 to-fuchsia-100/50 dark:from-fuchsia-950/20 dark:to-fuchsia-900/10",
  ];

  return (
    <section className="bg-muted/20">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <SectionHeader
          title="Shop by Category"
          subtitle="Find the perfect saree for every occasion"
          centered
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:mt-10">
          {categories.map((cat: any, i: number) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-border/30 hover:ring-primary/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} opacity-60`} />
              <div className="relative z-10">
                <h3
                  className="text-base font-semibold transition-colors group-hover:text-primary sm:text-lg"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 sm:text-sm">
                    {cat.description}
                  </p>
                )}
                <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary sm:text-sm">
                  Explore
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── New Arrivals ──────────────────────────── */

async function NewArrivalsSection() {
  let products: any[] = [];
  try {
    products = await getNewArrivals();
  } catch { }

  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-14 sm:py-20">
      <SectionHeader
        title="New Arrivals"
        subtitle="Fresh additions to our collection"
        href="/products?sort=newest"
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:mt-10">
        {products.map((product: any) => (
          <SharedProductCard key={product.id} product={{ ...product, isNew: true }} />
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────── Budget Section ──────────────────────────── */

async function BudgetSection() {
  let products: any[] = [];
  try {
    products = await getBudgetProducts();
  } catch { }

  if (products.length === 0) return null;

  return (
    <section className="bg-muted/20">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <SectionHeader
          title="Budget Friendly"
          subtitle="Beautiful sarees under ₹1,000"
          href="/products?maxPrice=1000"
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:mt-10">
          {products.map((product: any) => (
            <SharedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
/* ──────────────────────────── Instagram Section ──────────────────────── */

async function InstagramSection() {
  const videos = await db.instagramVideo.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
    take: 6,
  });

  if (videos.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-14 sm:py-20">
      <SectionHeader
        title="Follow Us on Instagram"
        subtitle="Watch our latest reels & collections on @krishnapriyatextiles"
        centered
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <InstagramEmbed
            key={video.id}
            url={video.url}
            title={video.title || undefined}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          asChild
          variant="outline"
          className="gap-2 rounded-xl border-primary/30 px-8 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <a
            href="https://www.instagram.com/krishnapriyatextiles"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Follow @krishnapriyatextiles
          </a>
        </Button>
      </div>
    </section>
  );
}
/* ──────────────────────────── WhatsApp CTA ──────────────────────────── */

function WhatsAppCTA() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-secondary/50 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-secondary/50 blur-3xl" />
      </div>
      <div className="container relative mx-auto px-4 py-14 text-center sm:py-20">
        <h2
          className="text-3xl font-bold sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Need Help Choosing?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80 sm:text-base lg:text-lg">
          Chat with us on WhatsApp for personalized recommendations,
          video calls, and more!
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 h-12 rounded-xl bg-white px-8 text-base font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
        >
          <a
            href={`https://wa.me/91${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
}

/* ──────────────────────────── Home Page ──────────────────────────── */

export default async function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturesBar />
      <FeaturedSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <BudgetSection />
      <InstagramSection />
      <WhatsAppCTA />
    </>
  );
}
