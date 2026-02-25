"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ORDER_STATUSES = [
  { value: "PENDING", label: "⏳ Pending — New order, not yet checked" },
  { value: "CONFIRMED", label: "✅ Confirmed — You accepted the order" },
  { value: "PROCESSING", label: "🧵 Processing — Being packed" },
  { value: "SHIPPED", label: "🚚 Shipped — Sent for delivery" },
  { value: "OUT_FOR_DELIVERY", label: "📦 Out for Delivery" },
  { value: "DELIVERED", label: "🎉 Delivered — Customer received it" },
  { value: "CANCELLED", label: "❌ Cancelled" },
  { value: "RETURNED", label: "🔄 Returned" },
];

const STATUS_SHORT_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleUpdate() {
    if (status === currentStatus) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update");
      }
      toast.success(`Order status changed to "${STATUS_SHORT_LABELS[status] || status}"!`);
      setShowConfirm(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={() => setShowConfirm(true)}
          disabled={loading || status === currentStatus}
        >
          {loading ? "Updating..." : "Update Status"}
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Order Status?</AlertDialogTitle>
            <AlertDialogDescription>
              You are changing the order status from{" "}
              <strong>{STATUS_SHORT_LABELS[currentStatus] || currentStatus}</strong> to{" "}
              <strong>{STATUS_SHORT_LABELS[status] || status}</strong>.
              <br />
              <br />
              Make sure you have done the required work before updating.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>No, Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Yes, Update Status"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
