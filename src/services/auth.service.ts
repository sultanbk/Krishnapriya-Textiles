import { db } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { createToken, setSessionCookie } from "@/lib/auth";
import { RateLimitError, ValidationError } from "@/lib/errors";
import type { SessionUser } from "@/types";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 3;
const MAX_OTP_REQUESTS_PER_10_MIN = 3;

/**
 * Generate a 6-digit OTP
 */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Request OTP for a phone number
 */
export async function requestOtp(phone: string): Promise<{ success: boolean; message: string }> {
  // Rate limit check
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentOtps = await db.otp.count({
    where: {
      phone,
      createdAt: { gt: tenMinutesAgo },
    },
  });

  if (recentOtps >= MAX_OTP_REQUESTS_PER_10_MIN) {
    throw new RateLimitError("Too many OTP requests. Please wait and try again.");
  }

  const otp = generateOtp();
  const hashedOtp = await hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Store hashed OTP
  await db.otp.create({
    data: {
      phone,
      hash: hashedOtp,
      expiresAt,
    },
  });

  // In development, log the OTP
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
  } else {
    // Send OTP via MSG91
    await sendOtpViaSms(phone, otp);
  }

  return { success: true, message: "OTP sent successfully" };
}

/**
 * Verify OTP and create/login user
 */
export async function verifyOtp(
  phone: string,
  otp: string,
  rememberMe = false
): Promise<{ success: boolean; token: string; user: SessionUser; isNewUser: boolean }> {
  // Find the most recent unused OTP for this phone
  const otpRecord = await db.otp.findFirst({
    where: {
      phone,
      verified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    throw new ValidationError("OTP expired or not found. Please request a new one.");
  }

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    throw new ValidationError("Too many failed attempts. Please request a new OTP.");
  }

  // Verify OTP hash
  const isValid = await compare(otp, otpRecord.hash);

  if (!isValid) {
    // Increment attempts
    await db.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });
    throw new ValidationError("Invalid OTP. Please try again.");
  }

  // Mark OTP as verified
  await db.otp.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  });

  // Upsert user (create if first-time login)
  const user = await db.user.upsert({
    where: { phone },
    create: { phone },
    update: {},
  });

  // Check if user is new (has no name set yet)
  const isNewUser = !user.name;

  // Generate JWT
  const sessionUser: SessionUser = {
    userId: user.id,
    phone: user.phone,
    role: user.role,
  };

  const token = await createToken(sessionUser, rememberMe);
  await setSessionCookie(token, rememberMe);

  return { success: true, token, user: sessionUser, isNewUser };
}

/**
 * Send OTP via MSG91 API
 */
async function sendOtpViaSms(phone: string, otp: string): Promise<void> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    console.warn("MSG91 credentials not configured. OTP not sent.");
    return;
  }

  try {
    const response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: authKey,
      },
      body: JSON.stringify({
        template_id: templateId,
        recipients: [
          {
            mobiles: `91${phone}`,
            otp,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("MSG91 OTP send failed:", await response.text());
    }
  } catch (error) {
    console.error("MSG91 OTP send error:", error);
  }
}
