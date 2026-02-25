"use client";

import { Heart } from "lucide-react";
import { useWishlistStore, type WishlistItem } from "@/stores/wishlist-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WishlistButtonProps {
  product: Omit<WishlistItem, "addedAt">;
  className?: string;
  /** "icon" = just heart icon (for cards), "button" = full button with text */
  variant?: "icon" | "button";
}

export function WishlistButton({
  product,
  className,
  variant = "icon",
}: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (wishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist ❤️");
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
          wishlisted
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-border/60 bg-background text-muted-foreground hover:border-red-200 hover:text-red-500",
          className
        )}
      >
        <Heart
          className={cn("h-4 w-4", wishlisted && "fill-current")}
        />
        {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      data-wishlisted={wishlisted || undefined}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110",
        wishlisted
          ? "text-red-500"
          : "text-muted-foreground hover:text-red-500",
        className
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn("h-4 w-4", wishlisted && "fill-current")}
      />
    </button>
  );
}
