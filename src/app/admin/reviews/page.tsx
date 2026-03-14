"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Star,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  photos: string[];
  isVisible: boolean;
  createdAt: string;
  user: { name: string | null; phone: string };
  product: {
    name: string;
    slug: string;
    images: { url: string }[];
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const perPage = 20;

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        filter,
      });
      const res = await fetch(`/api/admin/reviews?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setTotal(data.total);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleToggle(id: string, isVisible: boolean) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !isVisible }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setReviews((rv) =>
        rv.map((r) => (r.id === id ? { ...r, isVisible: !isVisible } : r))
      );
      toast.success(isVisible ? "Review hidden from website" : "Review visible on website");
    } catch {
      toast.error("Failed to update review");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Review deleted");
      setReviews((rv) => rv.filter((r) => r.id !== id));
      setTotal((t) => t - 1);
    } catch {
      toast.error("Failed to delete review");
    }
  }

  const totalPages = Math.ceil(total / perPage);

  function StarRating({ rating }: { rating: number }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          {total} total reviews — Moderate and manage customer reviews
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        {(["all", "visible", "hidden"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2.5 text-xs rounded-full"
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
          >
            {f === "all" ? "All" : f === "visible" ? "Visible" : "Hidden"}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 font-medium">No reviews found</p>
            <p className="text-sm text-muted-foreground">
              Customer reviews will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Product image */}
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded bg-muted">
                      {review.product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.product.images[0].url}
                          alt={review.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StarRating rating={review.rating} />
                        <Badge variant={review.isVisible ? "default" : "secondary"}>
                          {review.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        {review.user.name || review.user.phone}
                        <span className="ml-2 text-xs text-muted-foreground font-normal">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </p>
                      <Link
                        href={`/products/${review.product.slug}`}
                        target="_blank"
                        className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {review.product.name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      {review.comment && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                      {review.photos.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {review.photos.map((photo, i) => (
                            <a
                              key={i}
                              href={photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo}
                                alt={`Review photo ${i + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggle(review.id, review.isVisible)}
                      title={review.isVisible ? "Hide from website" : "Show on website"}
                    >
                      {review.isVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <ConfirmDialog
                      title="Delete this review?"
                      description="This review will be permanently deleted."
                      confirmText="Yes, Delete"
                      variant="destructive"
                      onConfirm={() => handleDelete(review.id)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
