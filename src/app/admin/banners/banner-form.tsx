"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

interface BannerFormProps {
  banner?: {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    mobileImage: string | null;
    link: string | null;
    isActive: boolean;
    position: number;
  };
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [desktopImage, setDesktopImage] = useState(banner?.image || "");
  const [mobileImage, setMobileImage] = useState(banner?.mobileImage || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!desktopImage) {
      toast.error("Please upload a desktop banner image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get("title") as string,
        subtitle: formData.get("subtitle") as string,
        image: desktopImage,
        mobileImage: mobileImage || null,
        link: formData.get("link") as string,
        position: parseInt(formData.get("position") as string) || 0,
        isActive: formData.get("isActive") === "on",
      };

      const url = banner
        ? `/api/admin/banners/${banner.id}`
        : "/api/admin/banners";
      const method = banner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save banner");
      }

      toast.success(banner ? "Banner updated" : "Banner created");
      router.push("/admin/banners");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!banner) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Banner deleted");
      router.push("/admin/banners");
      router.refresh();
    } catch {
      toast.error("Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={banner?.title || ""}
          required
          placeholder="Banner title (displayed on the banner)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Textarea
          id="subtitle"
          name="subtitle"
          defaultValue={banner?.subtitle || ""}
          placeholder="Optional subtitle text"
          rows={2}
        />
      </div>

      {/* Desktop Image Upload */}
      <div className="space-y-2">
        <Label>Desktop Banner Image *</Label>
        <SingleImageUpload
          value={desktopImage}
          onChange={setDesktopImage}
          folder="banners"
          label="Upload Desktop Banner"
          hint="Recommended: 1920 × 600 px (wide landscape)"
          aspectRatio="aspect-[32/10]"
        />
      </div>

      {/* Mobile Image Upload */}
      <div className="space-y-2">
        <Label>Mobile Banner Image (Optional)</Label>
        <SingleImageUpload
          value={mobileImage}
          onChange={setMobileImage}
          folder="banners"
          label="Upload Mobile Banner"
          hint="Recommended: 768 × 600 px (nearly square)"
          aspectRatio="aspect-[4/3]"
        />
        <p className="text-xs text-muted-foreground">
          If not provided, the desktop image will be used on mobile
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (Optional)</Label>
        <Input
          id="link"
          name="link"
          defaultValue={banner?.link || ""}
          placeholder="/products?fabric=SILK"
        />
        <p className="text-xs text-muted-foreground">
          Where clicking the banner takes the user
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Sort Position</Label>
          <Input
            id="position"
            name="position"
            type="number"
            defaultValue={banner?.position ?? 0}
            min={0}
          />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={banner?.isActive ?? true}
            className="h-4 w-4"
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {banner ? "Update Banner" : "Create Banner"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        {banner && (
          <ConfirmDialog
            title="Delete this banner?"
            description="This banner will be permanently removed from your website."
            confirmText="Yes, Delete"
            variant="destructive"
            onConfirm={handleDelete}
            loading={deleting}
          >
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              className="ml-auto"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </ConfirmDialog>
        )}
      </div>
    </form>
  );
}
