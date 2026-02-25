import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { generateOrderNumber } from "@/lib/utils";
import { NotFoundError, InsufficientStockError, ValidationError } from "@/lib/errors";
import { clearCart } from "./cart.service";
import { createOrderNotification } from "@/actions/notifications";
import type { OrderStatus, PaymentMethod, Prisma } from "@prisma/client";
import type { ShippingAddress } from "@/types";

/**
 * Create a new order from cart
 */
export async function createOrder(
  userId: string,
  addressId: string,
  paymentMethod: PaymentMethod,
  couponCode?: string,
  customerNote?: string
) {
  // Get user's cart with items
  const cart = await db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { take: 1, orderBy: { position: "asc" } } },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new ValidationError("Cart is empty");
  }

  // Get shipping address
  const address = await db.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) throw new NotFoundError("Address");

  // Validate stock for all items
  for (const item of cart.items) {
    if (!item.product.isActive) {
      throw new ValidationError(`"${item.product.name}" is no longer available`);
    }
    if (item.product.stock < item.quantity) {
      throw new InsufficientStockError(item.product.name);
    }
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems: Prisma.OrderItemCreateManyOrderInput[] = cart.items.map((item) => {
    const price = Number(item.product.price);
    subtotal += price * item.quantity;
    return {
      productId: item.product.id,
      productName: item.product.name,
      productSku: item.product.sku,
      productImage: item.product.images[0]?.url,
      price,
      quantity: item.quantity,
    };
  });

  // Apply coupon if provided
  let discount = 0;
  let couponId: string | undefined;
  if (couponCode) {
    const couponResult = await applyCoupon(couponCode, subtotal, userId);
    discount = couponResult.discount;
    couponId = couponResult.couponId;
  }

  const shippingCharge = subtotal >= 1500 ? 0 : 99;
  const totalAmount = subtotal - discount + shippingCharge;

  // Generate order number
  const orderCount = await db.order.count();
  const orderNumber = generateOrderNumber(orderCount + 1);

  // Snapshot address
  const shippingAddress: ShippingAddress = {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 || undefined,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  };

  // Create order in a transaction
  const order = await db.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        shippingAddress: shippingAddress as unknown as Prisma.InputJsonValue,
        paymentMethod,
        subtotal,
        shippingCharge,
        discount,
        totalAmount,
        couponId,
        couponCode,
        customerNote,
        status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
        items: {
          createMany: { data: orderItems },
        },
      },
      include: { items: true },
    });

    // Decrement stock & create inventory logs
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } },
      });

      await tx.inventoryLog.create({
        data: {
          productId: item.product.id,
          change: -item.quantity,
          reason: `Order ${orderNumber}`,
          newStock: item.product.stock - item.quantity,
        },
      });
    }

    // Increment coupon usage
    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return newOrder;
  });

  // Clear user's cart
  await clearCart(userId);

  // If prepaid, create Razorpay order
  let razorpayOrderId: string | undefined;
  if (paymentMethod === "PREPAID") {
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Razorpay uses paise
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    razorpayOrderId = rzpOrder.id;

    await db.order.update({
      where: { id: order.id },
      data: { razorpayOrderId },
    });
  }

  return {
    order,
    razorpayOrderId,
  };
}

/**
 * Apply coupon and return discount amount
 */
async function applyCoupon(
  code: string,
  subtotal: number,
  userId: string
): Promise<{ discount: number; couponId: string }> {
  const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    throw new ValidationError("Invalid coupon code");
  }

  const now = new Date();
  if (coupon.validUntil && coupon.validUntil < now) {
    throw new ValidationError("Coupon has expired");
  }
  if (coupon.validFrom > now) {
    throw new ValidationError("Coupon is not yet active");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ValidationError("Coupon usage limit reached");
  }

  // Check per-user usage
  const userUsage = await db.order.count({
    where: { userId, couponId: coupon.id, status: { not: "CANCELLED" } },
  });
  if (userUsage >= coupon.perUserLimit) {
    throw new ValidationError("You have already used this coupon");
  }

  if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
    throw new ValidationError(
      `Minimum order amount of ₹${coupon.minOrderAmount} required`
    );
  }

  let discount: number;
  if (coupon.discountType === "PERCENTAGE") {
    discount = (subtotal * Number(coupon.discountValue)) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, Number(coupon.maxDiscount));
    }
  } else {
    discount = Number(coupon.discountValue);
  }

  discount = Math.min(discount, subtotal); // Discount can't exceed subtotal

  return { discount: Math.round(discount), couponId: coupon.id };
}

/**
 * Update order status (admin)
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  adminNote?: string
): Promise<void> {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order");

  const updateData: Prisma.OrderUpdateInput = {
    status,
    adminNote,
  };

  if (trackingNumber) updateData.trackingNumber = trackingNumber;

  switch (status) {
    case "SHIPPED":
      updateData.shippedAt = new Date();
      break;
    case "DELIVERED":
      updateData.deliveredAt = new Date();
      if (order.paymentMethod === "COD") {
        updateData.paymentStatus = "PAID";
        updateData.paidAt = new Date();
      }
      break;
    case "CANCELLED":
      updateData.cancelledAt = new Date();
      // Restore stock
      const items = await db.orderItem.findMany({
        where: { orderId },
      });
      for (const item of items) {
        await db.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
        const product = await db.product.findUnique({
          where: { id: item.productId },
        });
        await db.inventoryLog.create({
          data: {
            productId: item.productId,
            change: item.quantity,
            reason: `Order ${order.orderNumber} cancelled`,
            newStock: (product?.stock || 0),
          },
        });
      }
      break;
  }

  await db.order.update({
    where: { id: orderId },
    data: updateData,
  });

  // Auto-create notification for the user
  try {
    await createOrderNotification(order.userId, order.orderNumber, orderId, status);
  } catch {
    // Don't fail the status update if notification fails
    console.error("Failed to create order notification");
  }
}

/**
 * Get orders for a user
 */
export async function getUserOrders(userId: string, page = 1, pageSize = 10) {
  const [orders, total] = await Promise.all([
    db.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.order.count({ where: { userId } }),
  ]);

  return {
    items: orders,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
}
