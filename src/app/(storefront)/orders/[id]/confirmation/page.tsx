import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
      <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
      </div>

      <h1 className="mt-6 font-heading text-3xl font-bold">Order Placed!</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Thank you for your order. We&apos;ll send you updates on WhatsApp and SMS.
      </p>

      <Card className="mt-8 w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <Package className="h-10 w-10 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono font-semibold">{id.slice(0, 8).toUpperCase()}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated delivery: 5-7 business days
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href={`/orders/${id}`}>
            View Order Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Need help?{" "}
        <a
          href={`https://wa.me/91${siteConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Chat on WhatsApp
        </a>
      </p>
    </div>
  );
}
