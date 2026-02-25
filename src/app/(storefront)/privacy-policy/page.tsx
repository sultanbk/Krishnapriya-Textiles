import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy of Krishnapriya Textiles. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <p>
              At {siteConfig.name}, we are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website and make
              purchases.
            </p>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Information We Collect
              </h2>
              <p>We collect information that you provide directly to us:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Personal Information:</strong> Name, phone number,
                  email address (optional)
                </li>
                <li>
                  <strong>Shipping Address:</strong> Full address including
                  pincode for order delivery
                </li>
                <li>
                  <strong>Payment Information:</strong> Processed securely
                  through Razorpay. We do not store card details.
                </li>
                <li>
                  <strong>Order Information:</strong> Items purchased, order
                  history, and preferences
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                How We Use Your Information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>To process and deliver your orders</li>
                <li>To send order updates via SMS and WhatsApp</li>
                <li>To provide customer support</li>
                <li>To send promotional offers (with your consent)</li>
                <li>To improve our website and services</li>
                <li>To prevent fraud and ensure security</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Information Sharing
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information with:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Shipping Partners:</strong> To deliver your orders
                  (name, phone, address)
                </li>
                <li>
                  <strong>Payment Gateway (Razorpay):</strong> To process
                  payments securely
                </li>
                <li>
                  <strong>SMS Service (MSG91):</strong> To send OTPs and order
                  notifications
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Data Security
              </h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. All data is transmitted over SSL-encrypted
                connections. Passwords and OTPs are hashed. Payment processing
                is handled by PCI-DSS compliant payment gateway (Razorpay).
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Cookies
              </h2>
              <p>
                We use essential cookies for authentication and cart
                functionality. We do not use third-party tracking cookies. Your
                session information is stored securely in HTTP-only cookies.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Your Rights
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Access your personal information</li>
                <li>Update or correct your data</li>
                <li>Request deletion of your account</li>
                <li>Opt out of promotional messages</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{" "}
                {siteConfig.email} or call {siteConfig.phone}.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Any
                changes will be posted on this page with an updated date. We
                encourage you to review this page periodically.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please contact
                us:
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
