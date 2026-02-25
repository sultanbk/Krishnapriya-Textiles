import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { title: "All Sarees", href: "/products" },
  { title: "Silk Sarees", href: "/products?fabric=SILK" },
  { title: "Cotton Sarees", href: "/products?fabric=COTTON" },
  { title: "Wedding Collection", href: "/products?occasion=WEDDING" },
  { title: "New Arrivals", href: "/products?sort=newest" },
];

const customerLinks = [
  { title: "My Account", href: "/account" },
  { title: "My Orders", href: "/orders" },
  { title: "Saree Guide", href: "/saree-guide" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
  { title: "Shipping & Returns", href: "/shipping-policy" },
];

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/40">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <h3
                className="text-2xl font-bold text-primary tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {siteConfig.name}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">
                Premium Silk Sarees from Karnataka
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Handpicked sarees from master weavers across India. From pure Mysore silk to everyday cotton &mdash; find your perfect drape.
            </p>
            {/* Social links */}
            <div className="flex gap-3 pt-1">
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-sm"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-sm"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-sm"
                  aria-label="YouTube"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  <span className="transition-transform group-hover:translate-x-0.5">{link.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Customer Service
            </h3>
            <nav className="flex flex-col gap-2.5">
              {customerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  <span className="transition-transform group-hover:translate-x-0.5">{link.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Get In Touch
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="leading-relaxed">{siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} - {siteConfig.address.pincode}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-primary transition-colors">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors break-all">
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">|</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-border">|</span>
            <Link href="/refund-policy" className="hover:text-primary transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
