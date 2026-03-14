import { Metadata } from "next";
import Link from "next/link";
import { Bell, Package, ChevronRight } from "lucide-react";
import { getUserNotifications } from "@/actions/notifications";
import type { NotificationItem } from "@/actions/notifications";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MarkAllReadButton } from "./mark-all-read-button";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/notifications");

  const { items: notifications, unreadCount } = await getUserNotifications(1, 50);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Notifications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
            <div className="mt-2 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary/60 to-transparent" />
          </div>
          {unreadCount > 0 && <MarkAllReadButton />}
        </div>

        {/* Notification list */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bell className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="mt-4 text-lg font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
              No notifications
            </p>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              When your order status changes, you&apos;ll see notifications here.
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-xl">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border transition-colors ${
                  !notification.isRead
                    ? "border-primary/20 bg-primary/5 shadow-sm"
                    : "border-border/50 bg-card"
                }`}
              >
                {notification.link ? (
                  <Link
                    href={notification.link}
                    className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors rounded-xl"
                  >
                    <NotificationIcon isRead={notification.isRead} />
                    <NotificationBody notification={notification} />
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" />
                  </Link>
                ) : (
                  <div className="flex items-start gap-4 p-4">
                    <NotificationIcon isRead={notification.isRead} />
                    <NotificationBody notification={notification} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationIcon({ isRead }: { isRead: boolean }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
        isRead ? "bg-muted" : "bg-primary/10"
      }`}
    >
      <Package className={`h-5 w-5 ${isRead ? "text-muted-foreground" : "text-primary"}`} />
    </div>
  );
}

function NotificationBody({ notification }: { notification: NotificationItem }) {
  const d = new Date(notification.createdAt);
  const timeStr = d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-w-0 flex-1">
      <p className={`text-sm leading-tight ${!notification.isRead ? "font-semibold" : ""}`}>
        {notification.title}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
      <p className="mt-1.5 text-xs text-muted-foreground/70">{timeStr}</p>
    </div>
  );
}
