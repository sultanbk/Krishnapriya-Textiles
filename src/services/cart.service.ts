import { db } from "@/lib/db";
import { NotFoundError, InsufficientStockError } from "@/lib/errors";
import { siteConfig } from "@/config/site";
import type { CartSummary, CartItemDisplay } from "@/types";

/**
 * Get or create a cart for a user or session
 */
export async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) {
    throw new Error("Either userId or sessionId is required");
  }

  const where = userId ? { userId } : { sessionId };

  let cart = await db.cart.findFirst({
    where,
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { position: "asc" as const },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: "asc" as const },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

/**
 * Add a product to the cart
 */
export async function addToCart(
  productId: string,
  quantity: number,
  userId?: string,
  sessionId?: string
): Promise<void> {
  const product = await db.product.findUnique({
    where: { id: productId, isActive: true },
  });

  if (!product) throw new NotFoundError("Product");
  if (product.stock < quantity) throw new InsufficientStockError(product.name);

  const cart = await getOrCreateCart(userId, sessionId);

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new InsufficientStockError(product.name);
    }
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<void> {
  const cartItem = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { product: true },
  });

  if (!cartItem) throw new NotFoundError("Cart item");

  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: cartItemId } });
    return;
  }

  if (quantity > cartItem.product.stock) {
    throw new InsufficientStockError(cartItem.product.name);
  }

  await db.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string): Promise<void> {
  await db.cartItem.delete({ where: { id: cartItemId } });
}

/**
 * Get cart summary with calculated totals
 */
export async function getCartSummary(
  userId?: string,
  sessionId?: string
): Promise<CartSummary> {
  const cart = await getOrCreateCart(userId, sessionId);

  const items: CartItemDisplay[] = cart.items
    .filter((item) => item.product.isActive)
    .map((item) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      image: item.product.images[0]?.url,
      quantity: item.quantity,
      stock: item.product.stock,
    }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingCharge =
    subtotal >= siteConfig.shipping.freeShippingThreshold
      ? 0
      : siteConfig.shipping.defaultShippingCharge;

  const total = subtotal + shippingCharge;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    subtotal,
    shippingCharge,
    discount: 0,
    total,
    itemCount,
  };
}

/**
 * Merge guest cart into user cart after login
 */
export async function mergeGuestCart(
  userId: string,
  sessionId: string
): Promise<void> {
  const guestCart = await db.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) return;

  const userCart = await getOrCreateCart(userId);

  for (const guestItem of guestCart.items) {
    const existingItem = userCart.items.find(
      (item) => item.productId === guestItem.productId
    );

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + guestItem.quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: guestItem.quantity,
        },
      });
    }
  }

  // Delete guest cart
  await db.cart.delete({ where: { id: guestCart.id } });
}

/**
 * Clear all items from a cart
 */
export async function clearCart(userId: string): Promise<void> {
  const cart = await db.cart.findUnique({
    where: { userId },
  });

  if (cart) {
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
