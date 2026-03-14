"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

interface StickyAddToCartProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
    image?: string;
  };
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const outOfStock = product.stock <= 0;

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 500px (past the main add-to-cart button)
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleAdd() {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image || "",
      quantity: 1,
      stock: product.stock,
    });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div
      className={`fixed bottom-14 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-lg transition-all duration-300 lg:bottom-0 lg:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2.5">
        {/* Price info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {product.name}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart */}
        <Button
          size="lg"
          className="h-11 shrink-0 gap-2 rounded-xl px-6 font-semibold"
          onClick={handleAdd}
          disabled={outOfStock || added}
        >
          {outOfStock ? (
            "Out of Stock"
          ) : added ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
