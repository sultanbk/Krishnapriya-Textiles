import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/actions/products";

export const metadata: Metadata = {
  title: "Collections | Krishnapriya Textiles",
  description:
    "Browse our curated saree collections — silk, cotton, Banarasi and more. Find the perfect saree for every occasion.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Page header */}
      <div className="mb-10 text-center">
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our Collections
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Explore our handpicked saree collections, curated for every occasion
          and style
        </p>
        <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"
            >
              {/* Category image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <span
                      className="text-4xl font-bold text-primary/20"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Category info */}
              <div className="p-5">
                <h2
                  className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {category._count.products}{" "}
                    {category._count.products === 1 ? "product" : "products"}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                    View Collection
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-20 text-center">
          <p
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            No collections available yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon for our curated saree collections
          </p>
        </div>
      )}
    </div>
  );
}
