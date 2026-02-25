import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production-32chars!"
);

const COOKIE_NAME = "kpt-session";

// Routes that require authentication
const protectedRoutes = ["/account", "/orders", "/addresses", "/checkout", "/notifications"];
// Routes that require admin role
const adminRoutes = ["/admin"];
// Routes that should redirect to home if already logged in
const authRoutes = ["/login", "/verify-otp"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let user: { userId: string; phone: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload as unknown as { userId: string; phone: string; role: string };
    } catch {
      // Invalid token — clear it
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // Check if accessing auth pages while logged in
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check protected routes
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/orders/:path*",
    "/addresses/:path*",
    "/checkout/:path*",
    "/notifications/:path*",
    "/admin/:path*",
    "/login",
    "/verify-otp",
  ],
};
