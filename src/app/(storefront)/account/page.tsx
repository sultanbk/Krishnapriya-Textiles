import Link from "next/link";
import { Package, MapPin, User, LogOut } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";

export default async function AccountPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">+91 {session?.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/orders" className="group">
          <Card className="transition-shadow hover:shadow-md">
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
          <Card className="transition-shadow hover:shadow-md">
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

      {/* Logout */}
      <form action={logoutAction as any}>
        <Button variant="outline" type="submit" className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </form>
    </div>
  );
}
