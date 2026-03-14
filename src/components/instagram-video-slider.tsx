"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── types ──────────────────────────────────────────────── */
interface VideoItem {
  id: string;
  url: string;
  title?: string;
}

interface InstagramVideoSliderProps {
  videos: VideoItem[];
}

/* ─── helpers ────────────────────────────────────────────── */
function getEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    return `https://www.instagram.com${path}/embed/`;
  } catch {
    return url;
  }
}

/* ─── single video card (lazy-loads iframe on visibility) ── */
function VideoCard({ video, isActive }: { video: VideoItem; isActive: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Load when active and visible; unload when scrolled away
        setShouldLoad(entry.isIntersecting && isActive);
        if (!entry.isIntersecting) setIframeLoaded(false);
      },
      { rootMargin: "50px 100px", threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isActive]);

  const embedUrl = getEmbedUrl(video.url);

  return (
    <div
      ref={cardRef}
      className="group relative flex-shrink-0 snap-center"
      style={{ width: "var(--slide-width)" }}
    >
      {/* card frame */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-[2px] shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-pink-500/20">
        <div className="relative overflow-hidden rounded-[14px] bg-black">
          {/* 9:16 aspect ratio for reels */}
          <div className="relative aspect-[9/16]">
            {/* Loading skeleton */}
            {(!shouldLoad || !iframeLoaded) && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="relative">
                  {/* Instagram gradient ring */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-[2px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-900">
                      {shouldLoad ? (
                        /* loading spinner */
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      ) : (
                        <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
                      )}
                    </div>
                  </div>
                  {/* pulse ring animation */}
                  {!shouldLoad && (
                    <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] opacity-20" />
                  )}
                </div>
                {video.title && (
                  <p className="max-w-[80%] text-center text-xs font-medium text-white/60 line-clamp-2">
                    {video.title}
                  </p>
                )}
              </div>
            )}

            {/* Instagram iframe */}
            {shouldLoad && (
              <iframe
                src={embedUrl}
                className={cn(
                  "absolute inset-0 h-full w-full border-0 transition-opacity duration-700",
                  iframeLoaded ? "opacity-100" : "opacity-0"
                )}
                allowFullScreen
                loading="lazy"
                title={video.title || "Instagram Reel"}
                onLoad={() => setIframeLoaded(true)}
              />
            )}
          </div>

          {/* bottom gradient overlay with title */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-3 pt-10">
            {video.title && (
              <p className="text-xs font-medium text-white/90 line-clamp-1 sm:text-sm">
                {video.title}
              </p>
            )}
          </div>

          {/* Instagram link overlay (top-right) */}
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/60 hover:text-white group-hover:opacity-100"
            aria-label="Open on Instagram"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── main slider component ──────────────────────────────── */
export function InstagramVideoSlider({ videos }: InstagramVideoSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  /* check scroll boundaries */
  const checkScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  /* track active slide index */
  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = el.querySelector<HTMLElement>("[data-slide]")?.offsetWidth;
    if (!slideWidth) return;
    const gap = 16; // matches gap-4
    const idx = Math.round(el.scrollLeft / (slideWidth + gap));
    setActiveIndex(Math.max(0, Math.min(idx, videos.length - 1)));
  }, [videos.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      checkScrollState();
      updateActiveIndex();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check after layout
    const raf = requestAnimationFrame(checkScrollState);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [checkScrollState, updateActiveIndex]);

  /* scroll by one slide */
  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = el.querySelector<HTMLElement>("[data-slide]")?.offsetWidth;
    if (!slideWidth) return;
    const gap = 16;
    const distance = (slideWidth + gap) * (direction === "left" ? -1 : 1);
    el.scrollBy({ left: distance, behavior: "smooth" });
  }, []);

  /* scroll to specific slide */
  const scrollToSlide = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = el.querySelector<HTMLElement>("[data-slide]")?.offsetWidth;
    if (!slideWidth) return;
    const gap = 16;
    el.scrollTo({ left: index * (slideWidth + gap), behavior: "smooth" });
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="scrollbar-none flex gap-4 overflow-x-auto scroll-smooth px-4 py-2 sm:px-0"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          /* slide width: mobile = 55vw, sm = 45vw, md = 33%, lg = 22% */
          ["--slide-width" as string]: "clamp(200px, 55vw, 260px)",
        }}
      >
        {videos.map((video, i) => (
          <div key={video.id} data-slide>
            <VideoCard video={video} isActive={i === activeIndex || Math.abs(i - activeIndex) <= 1} />
          </div>
        ))}
        {/* End spacer for last item snap */}
        <div className="w-px flex-shrink-0" aria-hidden />
      </div>

      {/* Fade edges to hint more content */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 sm:w-16",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent transition-opacity duration-300 sm:w-16",
          canScrollRight ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Navigation arrows (desktop) */}
      {videos.length > 2 && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-background hover:shadow-xl sm:flex",
              "h-10 w-10 lg:h-11 lg:w-11",
              canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            aria-label="Previous video"
          >
            <ChevronLeft className="h-5 w-5 text-foreground/70" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-background hover:shadow-xl sm:flex",
              "h-10 w-10 lg:h-11 lg:w-11",
              canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            aria-label="Next video"
          >
            <ChevronRight className="h-5 w-5 text-foreground/70" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {videos.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === activeIndex
                  ? "h-2.5 w-7 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
                  : "h-2 w-2 bg-foreground/15 hover:bg-foreground/30"
              )}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
