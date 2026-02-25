"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2 } from "lucide-react";
import { StarRatingInput } from "@/components/admin/star-rating-input";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

interface TestimonialData {
  id: string;
  customerName: string;
  location: string | null;
  content: string;
  rating: number;
  isActive: boolean;
}

export default function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState<TestimonialData | null>(null);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    async function fetchTestimonial() {
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`);
        if (!res.ok) throw new Error("Failed to fetch testimonial");
        const testimonial = await res.json();
        setData(testimonial);
        setRating(testimonial.rating || 5);
      } catch (error: any) {
        toast.error(error.message);
        router.push("/admin/testimonials");
      } finally {
        setFetching(false);
      }
    }
    fetchTestimonial();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const body = {
        customerName: formData.get("customerName") as string,
        location: formData.get("location") as string,
        content: formData.get("content") as string,
        rating,
        isActive: formData.get("isActive") === "on",
      };

      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update testimonial");
      }

      toast.success("Review updated successfully!");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete testimonial");
      toast.success("Review deleted");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  }

  if (fetching || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Customer Review</h1>
          <p className="text-sm text-muted-foreground">
            Update this customer&apos;s feedback
          </p>
        </div>
        <ConfirmDialog
          title="Delete this review?"
          description="This customer review will be permanently removed from the website. This cannot be undone."
          confirmText="Yes, Delete Review"
          onConfirm={handleDelete}
          loading={deleting}
        >
          <Button variant="destructive" size="sm" disabled={deleting}>
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </ConfirmDialog>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            name="customerName"
            required
            defaultValue={data.customerName}
          />
          <p className="text-xs text-muted-foreground">Name of the customer who gave this review</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">City / Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={data.location || ""}
          />
          <p className="text-xs text-muted-foreground">Where is this customer from?</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">What did the customer say? *</Label>
          <Textarea
            id="content"
            name="content"
            required
            rows={4}
            defaultValue={data.content}
          />
          <p className="text-xs text-muted-foreground">Write the customer&apos;s feedback in their own words</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rating (How happy was the customer?)</Label>
            <StarRatingInput value={rating} onChange={setRating} size="md" />
          </div>
          <div className="flex items-end gap-3 pb-1">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              defaultChecked={data.isActive}
              className="h-5 w-5"
            />
            <Label htmlFor="isActive">Show on website</Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="text-base px-8 py-5">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ✅ Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
