"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createOrder, updateOrderStatus } from "@/services/order.service";
import { verifyPaymentSignature } from "@/services/payment.service";
import { checkoutSchema, verifyPaymentSchema, updateOrderStatusSchema } from "@/validators/order";
import { UnauthorizedError } from "@/lib/errors";
import type { ActionResponse } from "@/types";

export async function createOrderAction(
  input: FormData | { addressId: string; paymentMethod: string; couponCode?: string; customerNote?: string }
): Promise<ActionResponse<{ orderId: string; razorpayOrderId?: string; orderNumber: string }>> {
  try {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    let data: Record<string, unknown>;
    if (input instanceof FormData) {
      data = {
        addressId: input.get("addressId") as string,
        paymentMethod: input.get("paymentMethod") as string,
        couponCode: (input.get("couponCode") as string) || undefined,
        customerNote: (input.get("customerNote") as string) || undefined,
      };
    } else {
      data = input;
    }

    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const result = await createOrder(
      session.userId,
      parsed.data.addressId,
      parsed.data.paymentMethod,
      parsed.data.couponCode,
      parsed.data.customerNote
    );

    revalidatePath("/cart");
    revalidatePath("/orders");

    return {
      success: true,
      data: {
        orderId: result.order.id,
        razorpayOrderId: result.razorpayOrderId,
        orderNumber: result.order.orderNumber,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to place order";
    return { success: false, error: message };
  }
}

export async function verifyPaymentAction(
  data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
): Promise<ActionResponse<{ orderId: string }>> {
  try {
    const parsed = verifyPaymentSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid payment data" };
    }

    const result = await verifyPaymentSignature(
      parsed.data.razorpayOrderId,
      parsed.data.razorpayPaymentId,
      parsed.data.razorpaySignature
    );

    revalidatePath("/orders");
    return { success: true, data: { orderId: result.orderId } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment verification failed";
    return { success: false, error: message };
  }
}

export async function updateOrderStatusAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") throw new UnauthorizedError();

    const data = {
      orderId: formData.get("orderId") as string,
      status: formData.get("status") as string,
      trackingNumber: formData.get("trackingNumber") as string | undefined,
      adminNote: formData.get("adminNote") as string | undefined,
    };

    const parsed = updateOrderStatusSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await updateOrderStatus(
      parsed.data.orderId,
      parsed.data.status,
      parsed.data.trackingNumber,
      parsed.data.adminNote
    );

    revalidatePath("/admin/orders");
    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return { success: false, error: message };
  }
}
