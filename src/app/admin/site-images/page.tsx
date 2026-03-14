"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SingleImageUpload } from "@/components/admin/single-image-upload";

interface ImageSlot {
  key: string;
  label: string;
  description: string;
  hint: string;
  aspectRatio: string;
  folder: string;
}

const IMAGE_SLOTS: ImageSlot[] = [
  {
    key: "hero-visual",
    label: "Hero Visual",
    description: "Right-side image on the static hero banner (desktop only, shown when no banners are added)",
    hint: "Recommended: 720 × 900 px (4:5 portrait)",
    aspectRatio: "aspect-[4/5]",
    folder: "site",
  },
  {
    key: "about-hero",
    label: "About Page Hero",
    description: "Large hero image on the About Us page",
    hint: "Recommended: 1200 × 600 px (2:1 landscape)",
    aspectRatio: "aspect-[2/1]",
    folder: "site",
  },
  {
    key: "about-story",
    label: "About Page — Our Story",
    description: "Image in the Our Story section on the About page",
    hint: "Recommended: 800 × 600 px (4:3 landscape)",
    aspectRatio: "aspect-[4/3]",
    folder: "site",
  },
  {
    key: "about-store",
    label: "About Page — Store Photo",
    description: "Photo of your physical store or team",
    hint: "Recommended: 800 × 600 px (4:3 landscape)",
    aspectRatio: "aspect-[4/3]",
    folder: "site",
  },
  {
    key: "og-image",
    label: "Social Share Image",
    description: "Image shown when your site is shared on WhatsApp, Facebook, Instagram etc.",
    hint: "Recommended: 1200 × 630 px (1.91:1)",
    aspectRatio: "aspect-[1200/630]",
    folder: "site",
  },
  {
    key: "logo",
    label: "Site Logo",
    description: "Logo displayed in the header (light background)",
    hint: "Recommended: 400 × 100 px (PNG with transparent background)",
    aspectRatio: "aspect-[4/1]",
    folder: "site",
  },
  {
    key: "logo-dark",
    label: "Site Logo (Footer/Dark)",
    description: "Logo variant for the footer or dark backgrounds",
    hint: "Recommended: 400 × 100 px (PNG with transparent background)",
    aspectRatio: "aspect-[4/1]",
    folder: "site",
  },
];

export default function AdminSiteImagesPage() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/site-images");
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch {
        toast.error("Failed to load images");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Site images saved!");
    } catch {
      toast.error("Failed to save images");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Site Images</h1>
          <p className="text-sm text-muted-foreground">
            Manage all key images across the website from one place
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save All
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {IMAGE_SLOTS.map((slot) => (
          <Card key={slot.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{slot.label}</CardTitle>
              <CardDescription>{slot.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <SingleImageUpload
                value={images[slot.key] || ""}
                onChange={(url) =>
                  setImages((prev) => ({ ...prev, [slot.key]: url }))
                }
                folder={slot.folder}
                label={`Upload ${slot.label}`}
                hint={slot.hint}
                aspectRatio={slot.aspectRatio}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
