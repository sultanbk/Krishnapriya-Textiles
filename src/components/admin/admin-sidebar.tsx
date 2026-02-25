"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/config/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  phone: string;
}

export function AdminSidebar({ phone }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <Link href="/admin" className="font-heading text-xl font-bold text-primary">
          KPT Admin
        </Link>
        <p className="text-[10px] text-muted-foreground mt-0.5">Krishnapriya Textiles</p>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {adminNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon && (
                  <item.icon className={cn("h-4 w-4", active ? "text-primary-foreground" : "")} />
                )}
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <div className="text-sm text-muted-foreground mb-2">{phone}</div>
        <form action="/api/auth/logout" method="POST">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
