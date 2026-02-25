"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  addToCart as addToCartService,
  removeFromCart as removeFromCartService,
  updateCartItemQuantity,
  getCartSummary as getCartSummaryService,
} from "@/services/cart.service";
import type { ActionResponse, CartSummary } from "@/types";

export async function addToCartAction(
  productId: string,
  quantity: number = 1
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    await addToCartService(productId, quantity, session?.userId);
    revalidatePath("/cart");
    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add to cart";
    return { success: false, error: message };
  }
}

export async function removeFromCartAction(
  cartItemId: string
): Promise<ActionResponse> {
  try {
    await removeFromCartService(cartItemId);
    revalidatePath("/cart");
    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove item";
    return { success: false, error: message };
  }
}

export async function updateQuantityAction(
  cartItemId: string,
  quantity: number
): Promise<ActionResponse> {
  try {
    await updateCartItemQuantity(cartItemId, quantity);
    revalidatePath("/cart");
    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update quantity";
    return { success: false, error: message };
  }
}

export async function getCartAction(): Promise<ActionResponse<CartSummary>> {
  try {
    const session = await getSession();
    const summary = await getCartSummaryService(session?.userId);
    return { success: true, data: summary };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load cart";
    return { success: false, error: message };
  }
}
