import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
      {/* Decorative background shapes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Brand header */}
        <div className="text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <h1
              className="font-heading text-3xl font-bold text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Krishnapriya Textiles
            </h1>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Premium Sarees from Karnataka
            </p>
          </Link>
          <div className="mx-auto mt-4 h-px w-16 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        {children}
      </div>
    </div>
  );
}
