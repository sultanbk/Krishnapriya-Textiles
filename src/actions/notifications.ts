"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { ActionResponse } from "@/types";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
}

/**
 * Get notifications for the current user
 */
export async function getUserNotifications(
  page = 1,
  pageSize = 20
): Promise<{ items: NotificationItem[]; unreadCount: number; total: number }> {
  const session = await getSession();
  if (!session) {
    return { items: [], unreadCount: 0, total: 0 };
  }

  const [items, unreadCount, total] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.notification.count({
      where: { userId: session.userId, isRead: false },
    }),
    db.notification.count({
      where: { userId: session.userId },
    }),
  ]);

  return {
    items: items as NotificationItem[],
    unreadCount,
    total,
  };
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const session = await getSession();
  if (!session) return 0;

  return db.notification.count({
    where: { userId: session.userId, isRead: false },
  });
}

/**
 * Mark a single notification as read
 */
export async function markNotificationRead(
  notificationId: string
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Not logged in" };

    await db.notification.update({
      where: { id: notificationId, userId: session.userId },
      data: { isRead: true },
    });

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to mark notification as read" };
  }
}

/**
 * Mark all notifications as read for the current user
 */
export async function markAllNotificationsRead(): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Not logged in" };

    await db.notification.updateMany({
      where: { userId: session.userId, isRead: false },
      data: { isRead: true },
    });

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to mark all as read" };
  }
}

/**
 * Create an order status notification (called internally by updateOrderStatus)
 */
export async function createOrderNotification(
  userId: string,
  orderNumber: string,
  orderId: string,
  status: string
): Promise<void> {
  const statusMessages: Record<string, { title: string; message: string }> = {
    CONFIRMED: {
      title: "Order Confirmed! ✅",
      message: `Your order #${orderNumber} has been confirmed and is being prepared.`,
    },
    PROCESSING: {
      title: "Order Processing 🧵",
      message: `Your order #${orderNumber} is now being prepared with care.`,
    },
    PACKED: {
      title: "Order Packed 📦",
      message: `Your order #${orderNumber} has been packed and is ready to ship!`,
    },
    SHIPPED: {
      title: "Order Shipped! 🚚",
      message: `Your order #${orderNumber} is on its way to you.`,
    },
    DELIVERED: {
      title: "Order Delivered! 🎉",
      message: `Your order #${orderNumber} has been delivered. Enjoy your beautiful saree!`,
    },
    CANCELLED: {
      title: "Order Cancelled",
      message: `Your order #${orderNumber} has been cancelled. Refund will be processed if applicable.`,
    },
    REFUNDED: {
      title: "Refund Processed 💰",
      message: `Refund for order #${orderNumber} has been initiated.`,
    },
  };

  const info = statusMessages[status];
  if (!info) return;

  await db.notification.create({
    data: {
      userId,
      title: info.title,
      message: info.message,
      type: "ORDER_STATUS",
      link: `/orders/${orderId}`,
    },
  });
}
