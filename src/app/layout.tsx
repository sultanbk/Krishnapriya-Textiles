import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { PWARegister } from "@/components/pwa/pwa-register";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Krishnapriya Textiles — Premium Silk Sarees from Karnataka",
    template: "%s | Krishnapriya Textiles",
  },
  description:
    "Shop authentic silk sarees from Karnataka. Mysore Silk, Kanchipuram, Banarasi & more. Free shipping above ₹1500. COD available.",
  keywords: [
    "silk sarees",
    "Karnataka sarees",
    "Mysore silk",
    "Kanchipuram sarees",
    "buy sarees online",
    "Indian sarees",
    "wedding sarees",
    "Krishnapriya Textiles",
    "handloom sarees",
    "Banarasi sarees",
    "silk saree online shopping",
    "saree online India",
  ],
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KPT Sarees",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Krishnapriya Textiles",
    title: "Krishnapriya Textiles — Premium Silk Sarees from Karnataka",
    description: "Shop authentic silk sarees from Karnataka. Mysore Silk, Kanchipuram, Banarasi & more. Free shipping above ₹1500.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishnapriya Textiles — Premium Silk Sarees",
    description: "Shop authentic silk sarees from Karnataka. Free shipping above ₹1500.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#6b1420",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <GoogleAnalytics />
        <OrganizationJsonLd />
        <Providers>{children}</Providers>
        <AnalyticsTracker />
        <PWARegister />
      </body>
    </html>
  );
}
