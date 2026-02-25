"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getBlurPlaceholder } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

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
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px]">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                  selectedIndex === index
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/30"
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

        {/* Main image with hover zoom */}
        <div
          ref={imageContainerRef}
          className="relative aspect-[3/4] flex-1 overflow-hidden rounded-xl bg-muted cursor-zoom-in group"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
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
          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-0 pointer-events-none">
            <ZoomIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hover to zoom</span>
            <span className="sm:hidden">Tap to expand</span>
          </div>
          {/* Mobile tap to expand hint */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white sm:hidden pointer-events-none">
            <ZoomIn className="h-3.5 w-3.5" />
            Tap to expand
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen view */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
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
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw] aspect-[3/4]"
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
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
