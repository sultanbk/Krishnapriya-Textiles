import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "Learn about our shipping and delivery policies. Free shipping on orders above ₹1,500. Delivery across India.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Shipping Charges
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Free shipping</strong> on all orders above ₹
                  {siteConfig.shipping.freeShippingThreshold}.
                </li>
                <li>
                  For orders below ₹{siteConfig.shipping.freeShippingThreshold},
                  a flat shipping charge of ₹
                  {siteConfig.shipping.defaultShippingCharge} is applied.
                </li>
                <li>
                  Cash on Delivery (COD) is available at no extra charge.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Delivery Time
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Karnataka:</strong> 2-4 business days
                </li>
                <li>
                  <strong>South India (other states):</strong> 3-5 business days
                </li>
                <li>
                  <strong>North/East/West India:</strong> 5-7 business days
                </li>
                <li>
                  <strong>Remote areas:</strong> 7-10 business days
                </li>
              </ul>
              <p className="mt-3">
                Note: Delivery times may be affected during festivals, sales
                events, or natural calamities. We will notify you of any delays
                via SMS or WhatsApp.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Order Processing
              </h2>
              <p>
                Orders are processed within 1-2 business days after order
                confirmation. You will receive an SMS/WhatsApp notification once
                your order is shipped, along with a tracking number.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Shipping Partners
              </h2>
              <p>
                We ship through trusted courier partners including Delhivery,
                DTDC and India Post to ensure safe and timely delivery of your
                sarees.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Packaging
              </h2>
              <p>
                All sarees are carefully packaged in protective covers to
                prevent any damage during transit. Silk sarees are wrapped in
                muslin cloth for extra protection. We use eco-friendly packaging
                wherever possible.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Tracking Your Order
              </h2>
              <p>
                Once your order is shipped, you will receive a tracking number
                via SMS and WhatsApp. You can also track your order from your
                account dashboard on our website.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Delivery Issues
              </h2>
              <p>
                If you face any issues with delivery — such as delayed delivery,
                damaged products, or wrong items — please contact us within 48
                hours of delivery at:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Phone: {siteConfig.phone}</li>
                <li>WhatsApp: {siteConfig.whatsapp}</li>
                <li>Email: {siteConfig.email}</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                We Currently Ship To
              </h2>
              <p>
                We deliver across all states and union territories of India. We
                do not ship internationally at this time. If you&apos;re an
                international customer, please contact us on WhatsApp and
                we&apos;ll do our best to help.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
