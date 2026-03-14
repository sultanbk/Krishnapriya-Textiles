import { SignJWT } from "jose";
import type { Page, BrowserContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Read the JWT secret from .env.local (same secret the Next.js middleware uses).
 * Falls back to the hardcoded default if .env.local is not found.
 */
function getJwtSecret(): Uint8Array {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    const envContent = fs.readFileSync(envPath, "utf-8");
    const match = envContent.match(/^JWT_SECRET="?([^"\n]+)"?/m);
    if (match?.[1]) {
      return new TextEncoder().encode(match[1]);
    }
  } catch {
    // .env.local not found, use fallback
  }
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-change-in-production-32chars!"
  );
}

const JWT_SECRET = getJwtSecret();

const COOKIE_NAME = "kpt-session";
const BASE_URL = "http://localhost:3000";

interface SessionPayload {
  userId: string;
  phone: string;
  role: "USER" | "ADMIN";
}

async function createTestToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Inject a valid user session cookie into the browser context.
 * This bypasses the OTP login flow entirely.
 */
export async function loginAsUser(context: BrowserContext): Promise<void> {
  const token = await createTestToken({
    userId: "test-user-id",
    phone: "9999999999",
    role: "USER",
  });

  await context.addCookies([
    {
      name: COOKIE_NAME,
      value: token,
      url: BASE_URL,
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

/**
 * Inject a valid admin session cookie into the browser context.
 * This bypasses the OTP login flow entirely.
 */
export async function loginAsAdmin(context: BrowserContext): Promise<void> {
  const token = await createTestToken({
    userId: "test-admin-id",
    phone: "8888888888",
    role: "ADMIN",
  });

  await context.addCookies([
    {
      name: COOKIE_NAME,
      value: token,
      url: BASE_URL,
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

/**
 * Helper to login and then navigate to a page.
 */
export async function loginAndGoto(
  page: Page,
  url: string,
  role: "USER" | "ADMIN" = "USER"
): Promise<void> {
  const login = role === "ADMIN" ? loginAsAdmin : loginAsUser;
  await login(page.context());
  await page.goto(url);
}
