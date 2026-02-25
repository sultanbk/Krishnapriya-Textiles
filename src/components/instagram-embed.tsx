"use client";

import { useRef, useState, useEffect } from "react";

interface InstagramEmbedProps {
  url: string;
  title?: string;
}

function getEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    return `https://www.instagram.com${path}/embed/`;
  } catch {
    return url;
  }
}

export function InstagramEmbed({ url, title }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Load/unload iframe based on visibility
        // Use a threshold so the video plays only when mostly in view
        setIsVisible(entry.isIntersecting);
      },
      {
        // Start loading a bit before it enters viewport
        rootMargin: "100px 0px",
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const embedUrl = getEmbedUrl(url);

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[9/16] w-full sm:aspect-[4/5]">
        {isVisible ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            title={title || "Instagram Video"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <svg
              className="h-12 w-12 text-muted-foreground/30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>
        )}
      </div>
      {title && (
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
      )}
    </div>
  );
}
