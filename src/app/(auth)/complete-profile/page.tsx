"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { UserCircle, ArrowRight, Mail, User } from "lucide-react";
import { completeProfileAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Please enter your name (at least 2 characters)");
      return;
    }

    setLoading(true);
    try {
      const result = await completeProfileAction(name.trim(), email.trim());
      if (result.success) {
        toast.success("Welcome to Krishnapriya Textiles!");
        router.push(callbackUrl);
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Profile card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/20">
            <UserCircle className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
            Almost There!
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Complete your profile to start shopping
          </p>
        </div>

        {/* Steps indicator */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              ✓
            </div>
            <span className="text-xs font-medium text-primary">Phone</span>
          </div>
          <div className="h-px w-6 bg-primary" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              ✓
            </div>
            <span className="text-xs font-medium text-primary">OTP</span>
          </div>
          <div className="h-px w-6 bg-primary" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
              3
            </div>
            <span className="text-xs font-bold text-primary">Profile</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="h-12 pl-10 text-base"
                autoFocus
                required
                minLength={2}
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (optional — for order updates)
              </span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-12 pl-10 text-base"
              />
            </div>
          </div>

          <Button
            className="h-12 w-full rounded-xl text-base font-semibold gap-2"
            type="submit"
            disabled={loading || name.trim().length < 2}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <CompleteProfileContent />
    </Suspense>
  );
}
