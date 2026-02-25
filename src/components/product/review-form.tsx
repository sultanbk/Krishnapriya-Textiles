"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSuccess: () => void;
}

export function ReviewForm({ productId, productName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment: comment.trim() || undefined }),
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
