import { z } from "zod";
import { OrderStatus, PaymentMethod } from "@prisma/client";

const orderStatusValues = Object.values(OrderStatus) as [string, ...string[]];
const paymentMethodValues = Object.values(PaymentMethod) as [string, ...string[]];

export const checkoutSchema = z.object({
  addressId: z.string().cuid("Select a delivery address"),
  paymentMethod: z.enum(paymentMethodValues as [PaymentMethod, ...PaymentMethod[]]),
  couponCode: z.string().optional(),
  customerNote: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum(orderStatusValues as [OrderStatus, ...OrderStatus[]]),
  trackingNumber: z.string().optional(),
  adminNote: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
