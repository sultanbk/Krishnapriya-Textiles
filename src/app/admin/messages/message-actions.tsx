"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { MailOpen, Mail, Trash2, Loader2 } from "lucide-react";

export function MessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleRead() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !isRead }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch {
      toast.error("Failed to update message");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Message deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggleRead}
        disabled={loading}
        title={isRead ? "Mark as unread" : "Mark as read"}
      >
        {isRead ? (
          <Mail className="h-4 w-4 text-muted-foreground" />
        ) : (
          <MailOpen className="h-4 w-4 text-primary" />
        )}
      </Button>
      <ConfirmDialog
        title="Delete this message?"
        description="This message will be permanently deleted."
        confirmText="Yes, Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={loading}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ConfirmDialog>
    </div>
  );
}
