import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Heart, Award, Truck, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Krishnapriya Textiles — a trusted saree store in Karnataka, India. Discover our story, values, and commitment to quality handloom sarees.",
};

const values = [
  {
    icon: Heart,
    title: "Passion for Sarees",
    description:
      "Every saree in our collection is handpicked with love and an eye for quality. We believe in the art of handloom weaving.",
  },
  {
    icon: Award,
    title: "Uncompromised Quality",
    description:
      "We source directly from master weavers across India, ensuring every thread meets our high standards.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "We carefully package every saree and deliver it right to your doorstep, across India.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Our customers are our family. We go the extra mile to ensure your shopping experience is delightful.",
  },
];

const whyChoose = [
  { title: "Direct from Weavers", desc: "We cut out middlemen to bring you the best prices on authentic handloom sarees." },
  { title: "500+ Curated Sarees", desc: "From budget-friendly cotton to premium silk, we have a saree for every occasion." },
  { title: "Free Shipping", desc: `Enjoy free delivery on orders above ₹${siteConfig.shipping.freeShippingThreshold}.` },
  { title: "Easy Returns", desc: "Not satisfied? Return within 7 days of delivery — no questions asked." },
  { title: "Cash on Delivery", desc: "Pay when you receive your saree. We trust our customers." },
  { title: "WhatsApp Support", desc: "Have questions? Reach us anytime on WhatsApp for personalized help." },
];

export default async function AboutPage() {
  const siteImages = await getSiteImages(["about-hero", "about-story", "about-store"]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 to-background py-16 md:py-24">
        {siteImages["about-hero"] ? (
          <div className="absolute inset-0">
            <Image
              src={siteImages["about-hero"]}
              alt="About Krishnapriya Textiles"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </>
        )}
        <div className="container relative mx-auto px-4 text-center">
          <h1
            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Story
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            From a small textile shop in Karnataka to your doorstep — we bring
            you the finest handloom sarees from across India.
          </p>
          <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </div>
      </section>

      {/* Story */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Welcome to {siteConfig.name}
              </h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary/60 to-transparent" />
              <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Founded with a passion for preserving India&apos;s rich textile
                  heritage, Krishnapriya Textiles is a family-owned saree store
                  based in Karnataka, India. What started as a small shop in our
                  hometown has grown into a trusted destination for saree lovers
                  across the country.
                </p>
                <p>
                  We believe that every saree tells a story — of the weaver who
                  crafted it, the tradition it carries, and the woman who wears it.
                  Our collection of over 500 sarees spans the finest silks of
                  Kanchipuram, the intricate weaves of Banarasi, the luxurious
                  Mysore silks, comfortable cotton handlooms, and trendy modern
                  fabrics.
                </p>
              </div>
            </div>
            {siteImages["about-story"] ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/50">
                <Image
                  src={siteImages["about-story"]}
                  alt="Our Story"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : null}
          </div>
          <div className={`${siteImages["about-story"] ? "mt-8 max-w-3xl" : "mt-0"} space-y-5 text-muted-foreground leading-relaxed`}>
            <p>
              Every saree in our store is personally selected by our team. We
              visit weaving clusters across South India, interact directly with
              artisans, and handpick pieces that meet our standards of quality,
              design, and value. We take pride in offering genuine handloom
              products at honest prices.
            </p>
            <p>
              Whether you&apos;re looking for a grand wedding silk, an everyday
              cotton saree, or a statement piece for a special occasion —
              Krishnapriya Textiles has something for every woman, every budget,
              and every occasion.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/20 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Values
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-xl bg-card p-6 text-center shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:shadow-md hover:ring-primary/20 hover:-translate-y-0.5"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/15">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3
                  className="mt-5 text-lg font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="text-center lg:text-left">
                <h2
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Why Choose Us?
                </h2>
                <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent lg:mx-0 lg:from-primary/60 lg:via-transparent lg:to-transparent" />
              </div>
              <div className="mt-8 space-y-4">
                {whyChoose.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-xl bg-muted/20 p-4 ring-1 ring-border/30">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {siteImages["about-store"] && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/50 lg:mt-12">
                <Image
                  src={siteImages["about-store"]}
                  alt="Krishnapriya Textiles Store"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-secondary/50 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-secondary/50 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start Shopping Today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80 sm:text-lg">
            Browse our latest collection and find the perfect saree for your
            next occasion.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-primary shadow-lg hover:bg-white/90">
              <Link href="/products">
                Browse Sarees
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl border-2 border-primary-foreground/30 px-8 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
