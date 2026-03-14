"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InlineStockEditorProps {
  productId: string;
  initialStock: number;
}

export function InlineStockEditor({
  productId,
  initialStock,
}: InlineStockEditorProps) {
  const [stock, setStock] = useState(initialStock);
  const [saving, setSaving] = useState(false);
  const isDirty = stock !== initialStock;

  async function save() {
    if (!isDirty) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/inventory/quick-update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, stock }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      toast.success(`Stock updated to ${stock}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Update failed");
      setStock(initialStock);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setStock((s) => Math.max(0, s - 1))}
        disabled={saving}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        min={0}
        value={stock}
        onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
        className="h-7 w-16 text-center text-sm font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        disabled={saving}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setStock((s) => s + 1)}
        disabled={saving}
      >
        <Plus className="h-3 w-3" />
      </Button>
      {isDirty && (
        <Button
          variant="default"
          size="icon"
          className="h-7 w-7"
          onClick={save}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  );
}
