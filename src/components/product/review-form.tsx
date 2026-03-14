"use client";

import { useState, useRef } from "react";
import { Star, Loader2, Camera, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSuccess: () => void;
}

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ReviewForm({ productId, productName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photos.length;
    const validFiles = files.slice(0, remaining).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select image files only");
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Each photo must be under 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setPhotos((prev) => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadPhotos(): Promise<string[]> {
    if (photos.length === 0) return [];

    const urls: string[] = [];
    for (const photo of photos) {
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "kpt_reviews");
      formData.append("folder", "reviews");

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) {
          urls.push(data.secure_url);
        }
      } catch {
        console.error("Photo upload failed");
      }
    }

    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload photos first
      const photoUrls = await uploadPhotos();

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim() || undefined,
          photos: photoUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success(data.message || "Review submitted!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border/50 bg-muted/20 p-5 sm:p-6"
    >
      <h3
        className="text-base font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Review: {productName}
      </h3>

      {/* Star rating input */}
      <div className="mt-4">
        <p className="mb-2 text-sm text-muted-foreground">Your rating</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="rounded-sm p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Star
                  className={`h-7 w-7 transition-colors ${
                    starValue <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30"
                  }`}
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            {rating}/5
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="mt-4">
        <Textarea
          placeholder="Share your experience with this saree... (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
          className="resize-none rounded-lg"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {comment.length}/1000
        </p>
      </div>

      {/* Photo upload */}
      <div className="mt-4">
        <p className="mb-2 text-sm text-muted-foreground">
          Add photos <span className="text-xs">(up to {MAX_PHOTOS}, optional)</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {/* Photo previews */}
          {photoPreviews.map((preview, index) => (
            <div
              key={index}
              className="group relative h-20 w-20 overflow-hidden rounded-lg border bg-muted"
            >
              <Image
                src={preview}
                alt={`Review photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Upload button */}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border/60 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <Camera className="h-5 w-5" />
              <span className="text-[10px] font-medium">Add Photo</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoSelect}
          className="hidden"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-xl"
        size="sm"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Review
      </Button>
    </form>
  );
}
