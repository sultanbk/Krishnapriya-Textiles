"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Minus, Plus, Check, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image?: string;
  };
  showBuyNow?: boolean;
}

export function AddToCartButton({ product, showBuyNow = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();

  const outOfStock = product.stock <= 0;

  const cartItem = {
    id: product.id,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.image || "",
    quantity,
    stock: product.stock,
  };

  function handleAdd() {
    addItem(cartItem);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(cartItem);
    router.push("/checkout");
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || outOfStock}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock || outOfStock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        {!outOfStock && (
          <span className="text-xs text-muted-foreground">
            ({product.stock} available)
          </span>
        )}
      </div>

      {/* Add to cart + Buy Now buttons */}
      <div className={showBuyNow ? "grid grid-cols-2 gap-2.5" : "flex"}>
        <Button
          className={showBuyNow ? "" : "w-full"}
          size="lg"
          onClick={handleAdd}
          disabled={outOfStock || added}
        >
          {outOfStock ? (
            "Out of Stock"
          ) : added ? (
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Added
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </span>
          )}
        </Button>

        {showBuyNow && !outOfStock && (
          <Button
            size="lg"
            variant="secondary"
            className="font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
            onClick={handleBuyNow}
          >
            <Zap className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
        )}
      </div>
    </div>
  );
}
