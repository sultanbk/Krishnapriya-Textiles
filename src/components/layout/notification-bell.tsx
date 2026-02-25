"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from "@/actions/notifications";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Fetch notifications on open
  useEffect(() => {
    if (open) {
      startTransition(async () => {
        const result = await getUserNotifications(1, 10);
        setNotifications(result.items);
        setUnreadCount(result.unreadCount);
      });
    }
  }, [open]);

  // Periodic unread count check
  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      try {
        const result = await getUserNotifications(1, 1);
        if (mounted) setUnreadCount(result.unreadCount);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60_000); // every 60s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-primary/5"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 sm:w-96"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[360px] overflow-y-auto">
          {isPending ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "border-b last:border-0 transition-colors",
                  !notification.isRead && "bg-primary/5"
                )}
              >
                {notification.link ? (
                  <Link
                    href={notification.link}
                    onClick={() => {
                      if (!notification.isRead) handleMarkRead(notification.id);
                      setOpen(false);
                    }}
                    className="block px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <NotificationContent
                      notification={notification}
                      formatTime={formatTime}
                    />
                  </Link>
                ) : (
                  <div
                    className="px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      if (!notification.isRead) handleMarkRead(notification.id);
                    }}
                  >
                    <NotificationContent
                      notification={notification}
                      formatTime={formatTime}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              className="w-full text-xs h-8"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href="/notifications">View All Notifications</Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function NotificationContent({
  notification,
  formatTime,
}: {
  notification: NotificationItem;
  formatTime: (date: Date) => string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
        <Package className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm leading-tight", !notification.isRead && "font-semibold")}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground/70">
          {formatTime(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  );
}
