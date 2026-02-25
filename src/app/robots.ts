import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/verify-otp", "/checkout", "/account", "/orders", "/addresses"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
