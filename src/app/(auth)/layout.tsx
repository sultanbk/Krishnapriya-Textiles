import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/">
            <h1 className="font-heading text-3xl font-bold text-primary">
              Krishnapriya Textiles
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Premium Sarees from Karnataka
            </p>
          </Link>
          <div className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </div>
        {children}
      </div>
    </div>
  );
}
