"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
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
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image || "",
      quantity,
      stock: product.stock,
    });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    openCart();
    setTimeout(() => setAdded(false), 2000);
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

      {/* Add to cart button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleAdd}
        disabled={outOfStock || added}
      >
        {outOfStock ? (
          "Out of Stock"
        ) : added ? (
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" /> Added to Cart
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </span>
        )}
      </Button>
    </div>
  );
}
