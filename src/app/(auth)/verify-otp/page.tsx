"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import { verifyOtpAction, requestOtpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cart-store";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [rememberMe, setRememberMe] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) {
      router.replace("/login");
    }
  }, [phone, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = useCallback(
    async (otpCode: string) => {
      setLoading(true);
      try {
        const result = await verifyOtpAction(phone, otpCode, rememberMe);
        if (result.success) {
          // Sync cart items to server after login
          const cartItems = useCartStore.getState().items;
          if (cartItems.length > 0) {
            try {
              await fetch("/api/cart/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                  })),
                }),
              });
            } catch {
              // Cart sync failure shouldn't block login
              console.error("Cart sync failed");
            }
          }

          if (result.data.isNewUser) {
            toast.success("OTP verified! Please complete your profile.");
            const profileParams = new URLSearchParams();
            if (callbackUrl && callbackUrl !== "/")
              profileParams.set("callbackUrl", callbackUrl);
            router.push(
              `/complete-profile${profileParams.toString() ? `?${profileParams.toString()}` : ""}`
            );
          } else {
            toast.success("Welcome back!");
            router.push(callbackUrl);
          }
          router.refresh();
        } else {
          toast.error(result.error || "Invalid OTP");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [phone, rememberMe, callbackUrl, router]
  );

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newOtp.every((d) => d) && value) {
      handleVerify(newOtp.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      handleVerify(pasted);
    }
  }

  async function handleResend() {
    try {
      const result = await requestOtpAction(phone);
      if (result.success) {
        toast.success("New OTP sent!");
        setResendTimer(30);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(result.error || "Failed to resend OTP");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  // Mask phone: 91084***06
  const maskedPhone = phone.length === 10
    ? `${phone.slice(0, 3)}****${phone.slice(7)}`
    : phone;

  return (
    <div className="w-full space-y-6">
      {/* OTP Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/20">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
            Verify Your Number
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-foreground">+91 {maskedPhone}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="space-y-5">
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`h-13 w-11 sm:h-14 sm:w-13 text-center text-xl font-bold rounded-xl transition-all duration-200 ${
                  digit
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border"
                }`}
                autoFocus={index === 0}
                disabled={loading}
              />
            ))}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-center gap-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label
              htmlFor="remember-me"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Keep me signed in for 30 days
            </Label>
          </div>

          <Button
            className="h-12 w-full rounded-xl text-base font-semibold gap-2"
            disabled={loading || otp.some((d) => !d)}
            onClick={() => handleVerify(otp.join(""))}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Verify & Continue
              </>
            )}
          </Button>
        </div>

        {/* Resend + Change number */}
        <div className="mt-5 space-y-2 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-muted-foreground">
              Resend code in{" "}
              <span className="font-semibold text-foreground tabular-nums">
                0:{String(resendTimer).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium gap-1.5"
              onClick={handleResend}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Resend OTP
            </Button>
          )}

          <div>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Use a different number
            </Button>
          </div>
        </div>
      </div>

      {/* Dev mode helper */}
      {process.env.NODE_ENV === "development" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
          <strong>Dev Mode:</strong> Check your terminal for the OTP
        </div>
      )}
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
