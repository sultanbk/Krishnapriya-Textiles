"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import { z } from "zod";
import { requestOtpAction } from "@/actions/auth";
import { loginSchema } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<PhoneForm>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: { phone: "" },
  });

  async function onSubmit(data: PhoneForm) {
    setLoading(true);
    try {
      const result = await requestOtpAction(data.phone);
      if (result.success) {
        toast.success("OTP sent successfully!");
        router.push(`/verify-otp?phone=${data.phone}`);
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
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-xl">Welcome</CardTitle>
        <CardDescription>
          Enter your phone number to login or create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        +91
                      </span>
                      <Input
                        {...field}
                        placeholder="9108455006"
                        className="pl-12"
                        type="tel"
                        maxLength={10}
                        autoFocus
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending OTP...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Send OTP
                </span>
              )}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </CardContent>
    </Card>
  );
}
