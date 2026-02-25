import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Indian Rupees
 */
export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

/**
 * Generate URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

/**
 * Generate SKU: KP-SILK-101
 */
export function generateSku(fabric: string, id: number): string {
  const fabricCode = fabric.replace("_", "-").toUpperCase();
  return `KP-${fabricCode}-${id.toString().padStart(3, "0")}`;
}

/**
 * Generate order number: KPT-20260224-0001
 */
export function generateOrderNumber(sequentialId: number): string {
  const date = new Date();
  const dateStr =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");
  return `KPT-${dateStr}-${sequentialId.toString().padStart(4, "0")}`;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(
  compareAtPrice: number,
  price: number
): number {
  if (compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format phone number: 9876543210 → +91 98765 43210
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "").slice(-10);
  return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
}

/**
 * Get WhatsApp link for product inquiry
 */
export function getWhatsAppLink(productName: string, productUrl: string): string {
  const message = encodeURIComponent(
    `Hi! I'm interested in "${productName}". ${productUrl}`
  );
  const phone = "919108455006";
  return `https://wa.me/${phone}?text=${message}`;
}

/**
 * Get estimated delivery date range
 */
export function getDeliveryEstimate(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const to = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return { from: formatDate(from), to: formatDate(to) };
}

/**
 * Generate a tiny Cloudinary blur placeholder URL (10px wide, blurred)
 * Works with Cloudinary URLs to create a low-quality image for blur-up loading
 */
export function getBlurPlaceholder(url: string): string {
  if (!url || !url.includes("cloudinary")) return "";
  // Insert Cloudinary transformation for tiny blur placeholder
  return url.replace(
    "/upload/",
    "/upload/w_10,q_10,e_blur:1000,f_webp/"
  );
}
