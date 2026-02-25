"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./review-form";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null };
}

interface ReviewStats {
  total: number;
  averageRating: number;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  function handleReviewSubmitted() {
    setShowForm(false);
    fetchReviews();
  }

  if (loading) {
    return (
      <div className="mt-12 space-y-4 animate-pulse">
        <div className="h-7 w-48 rounded-lg bg-muted" />
        <div className="h-24 w-full rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl font-bold tracking-tight sm:text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Customer Reviews
          </h2>
          {stats.total > 0 && (
            <div className="mt-1.5 flex items-center gap-2">
              <StarRating rating={Math.round(stats.averageRating)} size="sm" />
              <span className="text-sm text-muted-foreground">
                {stats.averageRating} out of 5 ({stats.total}{" "}
                {stats.total === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>
        <Button
          variant={showForm ? "outline" : "default"}
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showForm && (
        <div className="mt-6">
          <ReviewForm
            productId={productId}
            productName={productName}
            onSuccess={handleReviewSubmitted}
          />
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border/50 bg-card p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {review.user.name || "Customer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="mt-6 rounded-xl border border-dashed border-border/60 bg-muted/20 py-12 text-center">
            <ThumbsUp className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p
              className="mt-3 text-sm font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No reviews yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Be the first to review this saree
            </p>
          </div>
        )
      )}
    </div>
  );
}
