"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

interface WhatsAppAlertButtonProps {
  products: { name: string; sku: string; stock: number }[];
}

export function WhatsAppAlertButton({ products }: WhatsAppAlertButtonProps) {
  function handleAlert() {
    const outOfStock = products.filter((p) => p.stock === 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
    const warning = products.filter((p) => p.stock > 5);

    let message = `🚨 *Low Stock Alert — Krishnapriya Textiles*\n\n`;
    message += `Date: ${new Date().toLocaleDateString("en-IN")}\n\n`;

    if (outOfStock.length > 0) {
      message += `❌ *OUT OF STOCK (${outOfStock.length}):*\n`;
      outOfStock.forEach((p) => {
        message += `• ${p.name} (${p.sku}) — 0 left\n`;
      });
      message += `\n`;
    }

    if (lowStock.length > 0) {
      message += `⚠️ *LOW STOCK ≤5 (${lowStock.length}):*\n`;
      lowStock.forEach((p) => {
        message += `• ${p.name} (${p.sku}) — ${p.stock} left\n`;
      });
      message += `\n`;
    }

    if (warning.length > 0) {
      message += `📦 *NEED ATTENTION ≤10 (${warning.length}):*\n`;
      warning.forEach((p) => {
        message += `• ${p.name} (${p.sku}) — ${p.stock} left\n`;
      });
      message += `\n`;
    }

    message += `Total products needing restock: ${products.length}\n`;
    message += `\nPlease reorder these items soon. 🙏`;

    const phone = `91${siteConfig.whatsapp}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleAlert}
      className="border-green-300 text-green-700 hover:bg-green-50"
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Send WhatsApp Alert
    </Button>
  );
}
