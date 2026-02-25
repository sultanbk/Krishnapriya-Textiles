import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { PWARegister } from "@/components/pwa/pwa-register";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KPT Sarees",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Krishnapriya Textiles",
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
      <body className={`${inter.variable} ${cormorant.variable} ${playfair.variable} antialiased`}>
        <OrganizationJsonLd />
        <Providers>{children}</Providers>
        <PWARegister />
      </body>
    </html>
  );
}
