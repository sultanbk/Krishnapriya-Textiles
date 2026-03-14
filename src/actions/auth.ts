"use server";

import { requestOtp as requestOtpService, verifyOtp as verifyOtpService } from "@/services/auth.service";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { loginSchema, verifyOtpSchema, completeProfileSchema } from "@/validators/auth";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionResponse, SessionUser } from "@/types";

export async function requestOtpAction(
  phoneOrFormData: string | FormData
): Promise<ActionResponse<{ message: string }>> {
  try {
    const phone = typeof phoneOrFormData === "string" ? phoneOrFormData : (phoneOrFormData.get("phone") as string);
    const parsed = loginSchema.safeParse({ phone });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    // Rate limit: 5 OTP requests per 10 minutes per phone
    const { limited } = rateLimit(`otp:${parsed.data.phone}`, { limit: 5, windowSec: 600 });
    if (limited) {
      return { success: false, error: "Too many OTP requests. Please wait a few minutes." };
    }

    const result = await requestOtpService(parsed.data.phone);
    return { success: true, data: { message: result.message } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send OTP";
    return { success: false, error: message };
  }
}

export async function verifyOtpAction(
  phoneOrFormData: string | FormData,
  otpCode?: string,
  rememberMe?: boolean
): Promise<ActionResponse<{ user: SessionUser; isNewUser: boolean }>> {
  try {
    let phone: string;
    let otp: string;
    let remember = rememberMe ?? false;
    if (typeof phoneOrFormData === "string") {
      phone = phoneOrFormData;
      otp = otpCode || "";
    } else {
      phone = phoneOrFormData.get("phone") as string;
      otp = phoneOrFormData.get("otp") as string;
      remember = phoneOrFormData.get("rememberMe") === "true";
    }
    const parsed = verifyOtpSchema.safeParse({ phone, otp });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const result = await verifyOtpService(parsed.data.phone, parsed.data.otp, remember);
    return { success: true, data: { user: result.user, isNewUser: result.isNewUser } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "OTP verification failed";
    return { success: false, error: message };
  }
}

export async function logoutAction(_formData?: FormData): Promise<ActionResponse> {
  try {
    await clearSessionCookie();
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Logout failed" };
  }
}

export async function completeProfileAction(
  name: string,
  email?: string | null
): Promise<ActionResponse> {
  try {
    // Normalize empty/null email to undefined
    const cleanEmail = email?.trim() || undefined;
    const parsed = completeProfileSchema.safeParse({ name, email: cleanEmail });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    await db.user.update({
      where: { id: session.userId },
      data: {
        name: parsed.data.name,
        ...(parsed.data.email ? { email: parsed.data.email } : {}),
      },
    });

    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, error: message };
  }
}
