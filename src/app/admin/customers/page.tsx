import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  ShoppingBag,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface AdminCustomersPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const perPage = 20;
  const search = params.search;

  const where: any = { role: "USER" };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [customers, total] = await Promise.all([
    db.user.findMany({
      where,
      include: {
        _count: { select: { orders: true } },
        orders: {
          select: { totalAmount: true },
          where: { paymentStatus: "PAID" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">
          {total.toLocaleString("en-IN")} registered customers
        </p>
      </div>

      {/* Search */}
      <Card className="p-3 sm:p-4">
        <form className="flex gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search by name, phone, email..."
              defaultValue={search}
              className="pl-9 h-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="h-9 px-3">
            Search
          </Button>
        </form>
      </Card>

      {/* Customers list */}
      <Card className="overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1.2fr_0.6fr_0.8fr_0.8fr] gap-4 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium text-muted-foreground">
          <span>Name</span>
          <span>Phone</span>
          <span>Email</span>
          <span>Orders</span>
          <span>Total Spent</span>
          <span>Joined</span>
        </div>

        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Users className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No customers found</p>
            <p className="text-xs">Try adjusting your search</p>
          </div>
        ) : (
          <div className="divide-y">
            {customers.map((customer) => {
              const totalSpent = customer.orders.reduce(
                (sum, o) => sum + o.totalAmount.toNumber(),
                0
              );
              const initials = customer.name
                ? customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "?";
              return (
                <Link
                  key={customer.id}
                  href={`/admin/customers/${customer.id}`}
                  className="group block transition-colors hover:bg-muted/40"
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[1.5fr_1fr_1.2fr_0.6fr_0.8fr_0.8fr] gap-4 items-center px-5 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {initials}
                      </div>
                      <span className="truncate text-sm font-medium">
                        {customer.name || "—"}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{customer.phone}</span>
                    <span className="truncate text-sm text-muted-foreground">
                      {customer.email || "—"}
                    </span>
                    <Badge
                      variant="secondary"
                      className="w-fit border-0 text-[10px] font-medium"
                    >
                      {customer._count.orders}
                    </Badge>
                    <span className="text-sm font-semibold tabular-nums">
                      {totalSpent > 0 ? formatPrice(totalSpent) : "—"}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(customer.createdAt)}
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="flex items-center gap-3 px-4 py-3 md:hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{customer.name || "—"}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                        {customer.email && (
                          <>
                            <span>·</span>
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{customer.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold tabular-nums">
                        {totalSpent > 0 ? formatPrice(totalSpent) : "—"}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        <ShoppingBag className="h-3 w-3" />
                        {customer._count.orders}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground tabular-nums">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                <Link href={`/admin/customers?page=${page - 1}${search ? `&search=${search}` : ""}`}>
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Link>
              </Button>
            )}
            <span className="text-xs text-muted-foreground tabular-nums">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                <Link href={`/admin/customers?page=${page + 1}${search ? `&search=${search}` : ""}`}>
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
