"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { X, Upload, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UploadedImage {
  url: string;
  publicId: string;
  alt: string;
  position: number;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  folder?: string;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 8,
  folder = "products",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      // Validate file
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return null;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return null;
      }

      try {
        // Get signed upload params from our API
        const sigRes = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder }),
        });

        if (!sigRes.ok) {
          throw new Error("Failed to get upload signature");
        }

        const { signature, timestamp, apiKey, cloudName, folder: uploadFolder } =
          await sigRes.json();

        // Upload directly to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", uploadFolder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadRes.ok) {
          throw new Error("Upload to Cloudinary failed");
        }

        const data = await uploadRes.json();

        return {
          url: data.secure_url,
          publicId: data.public_id,
          alt: file.name.replace(/\.[^.]+$/, ""),
          position: images.length,
        };
      } catch (err: any) {
        toast.error(err.message || `Failed to upload ${file.name}`);
        return null;
      }
    },
    [images.length]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxImages - images.length;

      if (remaining <= 0) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      const filesToUpload = fileArray.slice(0, remaining);
      if (fileArray.length > remaining) {
        toast.warning(
          `Only uploading ${remaining} of ${fileArray.length} files (max ${maxImages})`
        );
      }

      setUploading(true);

      const results = await Promise.all(filesToUpload.map(uploadFile));
      const successful = results.filter(Boolean) as UploadedImage[];

      if (successful.length > 0) {
        const updated = [...images, ...successful].map((img, i) => ({
          ...img,
          position: i,
        }));
        onChange(updated);
        toast.success(
          `${successful.length} image${successful.length > 1 ? "s" : ""} uploaded`
        );
      }

      setUploading(false);
    },
    [images, maxImages, onChange, uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeImage = (index: number) => {
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, position: i }));
    onChange(updated);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated.map((img, i) => ({ ...img, position: i })));
  };

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground/60" />
            <p className="mt-2 text-sm font-medium">
              Drop images here or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WebP up to 10MB. Max {maxImages} images.
            </p>
          </>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.publicId || index}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dragIndex !== null) {
                  handleReorder(dragIndex, index);
                  setDragIndex(null);
                }
              }}
              className={`group relative aspect-[4/5] overflow-hidden rounded-lg border bg-muted ring-1 ring-border/50 transition-all hover:ring-primary/30 ${
                dragIndex === index ? "opacity-50" : ""
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 flex items-start justify-between bg-gradient-to-b from-black/40 via-transparent to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex cursor-grab items-center rounded bg-black/50 px-1 py-0.5 text-white">
                  <GripVertical className="h-3.5 w-3.5" />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Position badge */}
              {index === 0 && (
                <div className="absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-muted-foreground">
        {images.length} of {maxImages} images
        {images.length > 0 && " · Drag to reorder · First image is the main photo"}
      </p>
    </div>
  );
}
