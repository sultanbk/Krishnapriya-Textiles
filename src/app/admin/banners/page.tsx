import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, ExternalLink, ImageIcon } from "lucide-react";

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Banners</h1>
          <p className="text-sm text-muted-foreground">
            Manage homepage banners and promotions
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/banners/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Banner
          </Link>
        </Button>
      </div>

      {banners.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ImageIcon className="mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm font-medium">No banners created yet</p>
          <p className="text-xs">Add a banner to promote products on your homepage</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner.id} className="group overflow-hidden transition-all hover:shadow-md">
              <div className="relative aspect-[2/1] overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <Badge
                  variant="secondary"
                  className={`absolute top-2 right-2 border-0 text-[10px] font-medium ${
                    banner.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {banner.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{banner.title}</p>
                  {banner.subtitle && (
                    <p className="truncate text-xs text-muted-foreground">{banner.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>Position: {banner.position}</span>
                    {banner.link && (
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{banner.link}</span>
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
                  <Link href={`/admin/banners/${banner.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
