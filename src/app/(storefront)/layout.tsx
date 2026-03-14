import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SocialProofToast } from "@/components/engagement/social-proof-toast";
import { getSession } from "@/lib/auth";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={!!session} />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <BottomNav />
      <SocialProofToast />
    </div>
  );
}
