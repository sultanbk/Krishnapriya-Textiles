"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Truck, StickyNote, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderDetailsFormProps {
  orderId: string;
  initialTrackingNumber: string | null;
  initialAdminNote: string | null;
  customerPhone: string | null;
  orderNumber: string;
}

export function OrderDetailsForm({
  orderId,
  initialTrackingNumber,
  initialAdminNote,
  customerPhone,
  orderNumber,
}: OrderDetailsFormProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || "");
  const [adminNote, setAdminNote] = useState(initialAdminNote || "");
  const [savingTracking, setSavingTracking] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  async function saveField(field: "trackingNumber" | "adminNote") {
    const isSaving = field === "trackingNumber" ? setSavingTracking : setSavingNote;
    isSaving(true);
    try {
      const body =
        field === "trackingNumber"
          ? { trackingNumber }
          : { adminNote };

      const res = await fetch(`/api/admin/orders/${orderId}/details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(
        field === "trackingNumber"
          ? "Tracking number saved"
          : "Admin note saved"
      );
    } catch {
      toast.error("Failed to save");
    } finally {
      isSaving(false);
    }
  }

  function sendWhatsApp() {
    if (!customerPhone) {
      toast.error("Customer phone number not available");
      return;
    }
    const phone = customerPhone.replace(/\D/g, "");
    const countryPhone = phone.startsWith("91") ? phone : `91${phone}`;
    const message = trackingNumber
      ? `Hi! Your order *${orderNumber}* has been shipped. 🚚\n\nTracking Number: *${trackingNumber}*\n\nThank you for shopping with Krishnapriya Textiles! 🙏`
      : `Hi! Your order *${orderNumber}* is being processed. We'll share tracking details soon.\n\nThank you for shopping with Krishnapriya Textiles! 🙏`;

    window.open(
      `https://wa.me/${countryPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <div className="space-y-4">
      {/* Tracking Number */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Truck className="h-4 w-4" />
            Tracking Number
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter tracking number / AWB"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Button
              size="sm"
              onClick={() => saveField("trackingNumber")}
              disabled={savingTracking}
            >
              <Save className="mr-1 h-3.5 w-3.5" />
              {savingTracking ? "Saving..." : "Save"}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-green-700 border-green-300 hover:bg-green-50"
            onClick={sendWhatsApp}
          >
            <MessageCircle className="mr-1 h-3.5 w-3.5" />
            Notify Customer via WhatsApp
          </Button>
        </CardContent>
      </Card>

      {/* Admin Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <StickyNote className="h-4 w-4" />
            Admin Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Internal notes about this order..."
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => saveField("adminNote")}
            disabled={savingNote}
          >
            <Save className="mr-1 h-3.5 w-3.5" />
            {savingNote ? "Saving..." : "Save Note"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
