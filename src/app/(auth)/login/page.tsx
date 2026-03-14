"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Phone, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { z } from "zod";
import { requestOtpAction } from "@/actions/auth";
import { loginSchema } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type PhoneForm = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const [loading, setLoading] = useState(false);

  const form = useForm<PhoneForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema) as any,
    defaultValues: { phone: "" },
  });

  async function onSubmit(data: PhoneForm) {
    setLoading(true);
    try {
      const result = await requestOtpAction(data.phone);
      if (result.success) {
        toast.success("OTP sent to your phone!");
        const params = new URLSearchParams({ phone: data.phone });
        if (callbackUrl) params.set("callbackUrl", callbackUrl);
        router.push(`/verify-otp?${params.toString()}`);
      } else {
        toast.error(result.error || "Failed to send OTP");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
          Secure Login
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-blue-600" />
          OTP Based
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          No Password
        </span>
      </div>

      {/* Login card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/20">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your mobile number to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-0 top-0 flex h-full items-center rounded-l-md border-r bg-muted/50 px-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          +91
                        </span>
                      </div>
                      <Input
                        {...field}
                        placeholder="Enter 10-digit number"
                        className="h-12 pl-16 text-base tracking-wider"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        autoFocus
                        autoComplete="tel-national"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-12 w-full rounded-xl text-base font-semibold gap-2 transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Get OTP
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/80">
          We&apos;ll send a 6-digit verification code to this number.
          <br />
          New users will be registered automatically.
        </p>
      </div>

      {/* Footer links */}
      <div className="text-center text-[11px] text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-primary transition-colors">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-primary transition-colors">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
