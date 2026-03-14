"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, ArchiveRestore } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ProductArchiveButtonProps {
  productId: string;
  isActive: boolean;
  productName: string;
}

export function ProductArchiveButton({
  productId,
  isActive,
  productName,
}: ProductArchiveButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/toggle-active`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      toast.success(
        isActive
          ? `"${productName}" archived (hidden from store)`
          : `"${productName}" restored (visible on store)`
      );
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenuItem
      onClick={handleToggle}
      disabled={loading}
      className={isActive ? "text-destructive" : "text-green-600"}
    >
      {isActive ? (
        <>
          <Archive className="mr-2 h-4 w-4" /> Archive
        </>
      ) : (
        <>
          <ArchiveRestore className="mr-2 h-4 w-4" /> Restore
        </>
      )}
    </DropdownMenuItem>
  );
}
