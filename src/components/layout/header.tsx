"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, ShoppingBag, User, Search, Phone, ChevronDown, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { siteConfig } from "@/config/site";
import { storefrontNav } from "@/config/navigation";
import { Separator } from "@/components/ui/separator";
import { SearchDialog } from "@/components/layout/search-dialog";
import { NotificationBell } from "@/components/layout/notification-bell";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement / Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between px-4 py-1.5 text-xs tracking-wide">
          <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Phone className="h-3 w-3" />
            <span className="hidden sm:inline">{siteConfig.phone}</span>
          </a>
          <p className="font-medium uppercase tracking-widest text-[10px] sm:text-xs">
            Free Shipping on orders above ₹{siteConfig.shipping.freeShippingThreshold}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hidden sm:block hover:opacity-80 transition-opacity text-xs"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>

      {/* Main header */}
      <div
        className={`border-b bg-background/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-none"
        } supports-[backdrop-filter]:bg-background/80`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-[72px]">
          {/* Left: Mobile menu + Desktop nav */}
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                {/* Mobile nav header */}
                <div className="border-b bg-primary/5 px-5 py-5">
                  <SheetTitle className="text-2xl font-bold tracking-tight text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                    {siteConfig.name}
                  </SheetTitle>
                  <p className="mt-0.5 text-xs tracking-wider text-muted-foreground uppercase">
                    Premium Silk Sarees
                  </p>
                </div>
                {/* Mobile nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                  {storefrontNav.map((item) => (
                    <div key={item.href} className="mb-0.5">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      {item.children && (
                        <div className="ml-3 border-l-2 border-primary/10 pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                </nav>
                {/* Mobile nav footer */}
                <div className="border-t bg-muted/30 px-5 py-4">
                  <a
                    href={`https://wa.me/91${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {storefrontNav.map((item) => (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors hover:text-primary"
                  >
                    {item.title}
                    {item.children && (
                      <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  {item.children && (
                    <div className="invisible absolute left-0 top-full z-50 min-w-[220px] translate-y-1 rounded-xl border bg-popover p-1.5 shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-primary/5 hover:text-primary"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0">
            <div className="text-center">
              <span className="text-xl font-bold tracking-tight text-primary sm:text-2xl lg:text-[26px]" style={{ fontFamily: "var(--font-heading)" }}>
                {siteConfig.name}
              </span>
              <p className="hidden lg:block text-[9px] uppercase tracking-[0.35em] text-muted-foreground -mt-0.5">
                Premium Silk Sarees
              </p>
            </div>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-primary/5"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-[18px] w-[18px]" />
              <span className="sr-only">Search</span>
            </Button>

            <div className="hidden sm:block">
              <NotificationBell />
            </div>

            <Link href="/account" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5">
                <User className="h-[18px] w-[18px]" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

            <Link href="/wishlist" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-primary/5">
                <Heart className="h-[18px] w-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-background">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full hover:bg-primary/5"
              onClick={openCart}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
