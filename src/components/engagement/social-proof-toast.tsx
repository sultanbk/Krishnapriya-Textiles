"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingBag } from "lucide-react";

const socialProofMessages = [
  { name: "Priya from Bangalore", product: "Mysore Silk Saree", timeAgo: "2 mins ago" },
  { name: "Lakshmi from Chennai", product: "Kanchipuram Silk Saree", timeAgo: "5 mins ago" },
  { name: "Sneha from Mumbai", product: "Banarasi Silk Saree", timeAgo: "8 mins ago" },
  { name: "Anitha from Hyderabad", product: "Cotton Handloom Saree", timeAgo: "12 mins ago" },
  { name: "Divya from Pune", product: "Tussar Silk Saree", timeAgo: "15 mins ago" },
  { name: "Kavya from Delhi", product: "Organza Silk Saree", timeAgo: "18 mins ago" },
  { name: "Meera from Kolkata", product: "Chiffon Saree", timeAgo: "22 mins ago" },
  { name: "Ranjitha from Mysore", product: "Pure Silk Saree", timeAgo: "25 mins ago" },
];

export function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const showToast = useCallback(() => {
    if (dismissed) return;
    setCurrentIndex((prev) => (prev + 1) % socialProofMessages.length);
    setVisible(true);
    // Hide after 4 seconds
    setTimeout(() => setVisible(false), 4000);
  }, [dismissed]);

  useEffect(() => {
    // Don't show on first load, wait 15 seconds
    const initialTimeout = setTimeout(() => {
      showToast();
    }, 15000);

    return () => clearTimeout(initialTimeout);
  }, [showToast]);

  useEffect(() => {
    if (dismissed) return;
    // Show every 30-50 seconds (random)
    const interval = setInterval(
      () => showToast(),
      30000 + Math.random() * 20000
    );
    return () => clearInterval(interval);
  }, [dismissed, showToast]);

  if (dismissed) return null;

  const msg = socialProofMessages[currentIndex];

  return (
    <div
      className={`fixed bottom-20 left-4 z-30 max-w-[280px] sm:max-w-xs lg:bottom-6 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="relative flex items-start gap-3 rounded-xl border bg-card p-3 shadow-lg ring-1 ring-border/50">
        <button
          onClick={() => { setDismissed(true); setVisible(false); }}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-sm ring-1 ring-border text-xs hover:bg-destructive hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          ×
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <ShoppingBag className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground leading-snug">
            {msg.name}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
            purchased <span className="font-medium text-foreground">{msg.product}</span>
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground/70">
            {msg.timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
}
