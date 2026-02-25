import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for using Krishnapriya Textiles website and purchasing products.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <p>
              Welcome to {siteConfig.name}. By accessing and using our website,
              you agree to be bound by the following terms and conditions.
              Please read them carefully before making a purchase.
            </p>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                1. General
              </h2>
              <p>
                These Terms & Conditions govern your use of the{" "}
                {siteConfig.name} website and the purchase of products from our
                store. By placing an order, you confirm that you are at least 18
                years of age and legally capable of entering into a binding
                contract.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                2. Products & Pricing
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  All product images are representative. Due to screen settings
                  and lighting, actual colors may vary slightly from what is
                  displayed.
                </li>
                <li>
                  Prices are listed in Indian Rupees (₹) and are inclusive of
                  all applicable taxes (GST).
                </li>
                <li>
                  We reserve the right to modify prices without prior notice.
                  However, any order confirmed at a particular price will be
                  honored.
                </li>
                <li>
                  Product availability is subject to stock. In case of
                  out-of-stock situations after order placement, we will
                  notify you and offer a full refund.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                3. Orders & Payment
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Orders are confirmed once payment is received (for online
                  payments) or upon shipment (for COD orders).
                </li>
                <li>
                  We accept online payments via Razorpay (UPI, debit/credit
                  cards, net banking) and Cash on Delivery.
                </li>
                <li>
                  We reserve the right to cancel orders that appear fraudulent
                  or violate our policies.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                4. Shipping & Delivery
              </h2>
              <p>
                Please refer to our{" "}
                <a href="/shipping-policy" className="text-primary hover:underline">
                  Shipping & Delivery Policy
                </a>{" "}
                for detailed information on shipping charges, delivery times,
                and related matters.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                5. Returns & Refunds
              </h2>
              <p>
                Please refer to our{" "}
                <a href="/refund-policy" className="text-primary hover:underline">
                  Return & Refund Policy
                </a>{" "}
                for detailed information on returns, exchanges, and refunds.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                6. Account & Authentication
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  You can create an account using your mobile phone number.
                  Authentication is via OTP (One-Time Password) sent via SMS.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your OTPs and account access.
                </li>
                <li>
                  You must provide accurate information when creating your
                  account and placing orders.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                7. Intellectual Property
              </h2>
              <p>
                All content on this website — including text, images, logos,
                and designs — is the property of {siteConfig.name} and is
                protected by Indian copyright and intellectual property laws.
                Unauthorized use, reproduction, or distribution is prohibited.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                8. Limitation of Liability
              </h2>
              <p>
                {siteConfig.name} shall not be liable for any indirect,
                incidental, or consequential damages arising from the use of
                our website or products. Our maximum liability for any claim
                shall not exceed the amount paid for the specific product in
                question.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                9. Governing Law
              </h2>
              <p>
                These Terms & Conditions are governed by the laws of India. Any
                disputes shall be subject to the exclusive jurisdiction of
                courts in Karnataka, India.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                10. Contact
              </h2>
              <p>
                For any questions regarding these Terms & Conditions, please
                contact us:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Phone: {siteConfig.phone}</li>
                <li>Email: {siteConfig.email}</li>
                <li>WhatsApp: {siteConfig.whatsapp}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
