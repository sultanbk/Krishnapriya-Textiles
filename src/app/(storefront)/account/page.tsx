import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, MapPin, User, LogOut, Shield, Clock } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/account");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true, phone: true, email: true },
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            My Account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile, orders, and addresses
          </p>
          <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary/60 to-transparent" />
        </div>

        {/* Profile card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {user?.name && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</p>
                  <p className="mt-0.5 font-medium">{user.name}</p>
                </div>
              )}
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</p>
                <p className="mt-0.5 font-medium">+91 {user?.phone || session.phone}</p>
              </div>
              {user?.email && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                  <p className="mt-0.5 font-medium">{user.email}</p>
                </div>
              )}
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-medium">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  {session.role === "ADMIN" ? "Administrator" : "Customer"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/orders" className="group">
            <Card className="transition-all hover:shadow-md hover:border-primary/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold group-hover:text-primary transition-colors">
                    My Orders
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Track and manage your orders
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/addresses" className="group">
            <Card className="transition-all hover:shadow-md hover:border-primary/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold group-hover:text-primary transition-colors">
                    Addresses
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Manage shipping addresses
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Session info + Logout */}
        <Card>
          <CardContent className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Session active &middot; Signed in via OTP</span>
            </div>
            <form action="/api/auth/logout" method="POST">
              <Button variant="outline" type="submit" size="sm" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
