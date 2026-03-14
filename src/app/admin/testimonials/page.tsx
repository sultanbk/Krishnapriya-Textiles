import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Star, Edit, MessageSquare, MapPin } from "lucide-react";

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer testimonials displayed on the website
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <MessageSquare className="mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm font-medium">No testimonials yet</p>
          <p className="text-xs">Add customer testimonials to build trust</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="group relative overflow-hidden p-4 transition-all hover:shadow-md">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i <= t.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200 dark:text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <Badge
                  variant="secondary"
                  className={`border-0 text-[10px] font-medium ${
                    t.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {t.isActive ? "Active" : "Hidden"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{t.customerName}</p>
                  {t.location && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {t.location}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  asChild
                >
                  <Link href={`/admin/testimonials/${t.id}`}>
                    <Edit className="h-3.5 w-3.5" />
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
