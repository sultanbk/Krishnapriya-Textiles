import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { accountNav } from "@/config/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl font-bold sm:text-3xl">My Account</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome back, Customer!
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <nav className="space-y-1">
            {accountNav.map((item: { href: string; title: string }) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
