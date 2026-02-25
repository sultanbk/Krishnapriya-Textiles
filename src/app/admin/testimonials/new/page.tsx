"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { StarRatingInput } from "@/components/admin/star-rating-input";

export default function NewTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        customerName: formData.get("customerName") as string,
        location: formData.get("location") as string,
        content: formData.get("content") as string,
        rating,
        isActive: formData.get("isActive") === "on",
      };

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create testimonial");
      }

      toast.success("Testimonial added successfully!");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Customer Review</h1>
        <p className="text-sm text-muted-foreground">
          Add what a happy customer said about your sarees
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            name="customerName"
            required
            placeholder="e.g., Lakshmi Devi"
          />
          <p className="text-xs text-muted-foreground">Name of the customer who gave this review</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">City / Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Bangalore, Karnataka"
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
            placeholder="e.g., Beautiful silk saree! The quality is amazing and the color is exactly as shown..."
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
              defaultChecked={true}
              className="h-5 w-5"
            />
            <Label htmlFor="isActive">Show on website</Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="text-base px-8 py-5">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ✅ Add Review
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
