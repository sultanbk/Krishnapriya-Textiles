"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getBlurPlaceholder } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, ZoomIn, Expand } from "lucide-react";

interface ImageGalleryProps {
  images: { id: string; url: string; alt: string | null }[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, handlePrev, handleNext]);

  // Touch swipe on main image and lightbox
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) handleNext();
        else handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
        No Image Available
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {/* Thumbnails — vertical strip on desktop, horizontal row on mobile */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] pb-1 sm:pb-0">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200",
                  selectedIndex === index
                    ? "border-primary shadow-md shadow-primary/20 scale-[1.03]"
                    : "border-transparent hover:border-muted-foreground/40 opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${productName} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                  placeholder={getBlurPlaceholder(image.url) ? "blur" : "empty"}
                  blurDataURL={getBlurPlaceholder(image.url) || undefined}
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image with hover zoom + swipe */}
        <div
          ref={imageContainerRef}
          className="relative aspect-[3/4] flex-1 overflow-hidden rounded-2xl bg-muted cursor-zoom-in group select-none"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={images[selectedIndex].url}
            alt={images[selectedIndex].alt || productName}
            fill
            className={cn(
              "object-cover transition-transform duration-200 ease-out",
              isZooming && "scale-[2.2]"
            )}
            style={
              isZooming
                ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                : undefined
            }
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            placeholder={getBlurPlaceholder(images[selectedIndex].url) ? "blur" : "empty"}
            blurDataURL={getBlurPlaceholder(images[selectedIndex].url) || undefined}
          />

          {/* Prev / Next arrows on main image (desktop hover, always on mobile) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Expand to fullscreen button */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
            className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-all sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/70"
            aria-label="View fullscreen"
          >
            <Expand className="h-3.5 w-3.5" />
          </button>

          {/* Zoom hint (desktop only) */}
          <div className="absolute bottom-3 left-3 hidden sm:flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
            <ZoomIn className="h-3.5 w-3.5" />
            Hover to zoom · Click to expand
          </div>

          {/* Dot indicators (mobile) */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "block rounded-full transition-all duration-200",
                    i === selectedIndex
                      ? "h-2 w-5 bg-white"
                      : "h-2 w-2 bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Fullscreen view */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw] w-full aspect-[3/4]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].alt || productName}
              fill
              className="object-contain"
              sizes="90vw"
              quality={90}
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Image counter + dots */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      i === selectedIndex
                        ? "h-2 w-5 bg-white"
                        : "h-2 w-2 bg-white/40 hover:bg-white/70"
                    )}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
              <span className="rounded-full bg-white/10 px-4 py-1 text-sm text-white">
                {selectedIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
