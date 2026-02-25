"use server";

import { requestOtp as requestOtpService, verifyOtp as verifyOtpService } from "@/services/auth.service";
import { clearSessionCookie } from "@/lib/auth";
import { loginSchema, verifyOtpSchema } from "@/validators/auth";
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

    const result = await requestOtpService(parsed.data.phone);
    return { success: true, data: { message: result.message } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send OTP";
    return { success: false, error: message };
  }
}

export async function verifyOtpAction(
  phoneOrFormData: string | FormData,
  otpCode?: string
): Promise<ActionResponse<{ user: SessionUser }>> {
  try {
    let phone: string;
    let otp: string;
    if (typeof phoneOrFormData === "string") {
      phone = phoneOrFormData;
      otp = otpCode || "";
    } else {
      phone = phoneOrFormData.get("phone") as string;
      otp = phoneOrFormData.get("otp") as string;
    }
    const parsed = verifyOtpSchema.safeParse({ phone, otp });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const result = await verifyOtpService(parsed.data.phone, parsed.data.otp);
    return { success: true, data: { user: result.user } };
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
