"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  mobileImage: string | null;
  link: string | null;
}

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, isPaused, next]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div
      className={`relative w-full overflow-hidden${banner.link ? " cursor-pointer" : ""}`}
      role={banner.link ? "link" : undefined}
      tabIndex={banner.link ? 0 : undefined}
      aria-label={banner.link ? `${banner.title} — Click to shop` : undefined}
      onClick={() => banner.link && router.push(banner.link)}
      onKeyDown={(e) => {
        if (banner.link && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          router.push(banner.link);
        }
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Desktop Image */}
      <div className="relative hidden aspect-[32/10] w-full sm:block">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority={current === 0}
        />
      </div>

      {/* Mobile Image */}
      <div className="relative aspect-[4/3] w-full sm:hidden">
        <Image
          src={banner.mobileImage || banner.image}
          alt={banner.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority={current === 0}
        />
      </div>

      {/* Overlay with title/subtitle */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-lg space-y-3 text-white sm:space-y-4">
            <h2
              className="text-2xl font-bold leading-tight drop-shadow-lg sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {banner.title}
            </h2>
            {banner.subtitle && (
              <p className="text-sm text-white/90 drop-shadow sm:text-base lg:text-lg">
                {banner.subtitle}
              </p>
            )}
            {banner.link && (
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30">
                  Shop Now
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
