import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "Return and Refund Policy for Krishnapriya Textiles. Easy 7-day returns on most sarees with hassle-free refund process.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold">
            Return & Refund Policy
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
              At {siteConfig.name}, we want you to be completely satisfied with
              your purchase. If you are not happy with a product, you can
              return it under the following conditions.
            </p>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Return Eligibility
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Returns are accepted within <strong>7 days</strong> of
                  delivery.
                </li>
                <li>
                  The saree must be{" "}
                  <strong>unused, unwashed, and in its original packaging</strong>{" "}
                  with all tags intact.
                </li>
                <li>
                  Products that have been altered, stitched, or damaged by the
                  customer are not eligible for return.
                </li>
                <li>
                  Sale items and items marked as &quot;non-returnable&quot; cannot be
                  returned.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                How to Initiate a Return
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>
                  Contact us within 7 days of delivery via WhatsApp ({siteConfig.whatsapp}) or phone ({siteConfig.phone}).
                </li>
                <li>
                  Share your order number and reason for return along with
                  photos of the product.
                </li>
                <li>
                  Our team will review your request within 24 hours and
                  provide return instructions.
                </li>
                <li>
                  Pack the saree securely and ship it to the address provided
                  by our team.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Return Shipping
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  If the return is due to a defect, wrong product, or damage
                  during shipping, <strong>we will cover the return shipping cost</strong>.
                </li>
                <li>
                  For returns due to change of mind or personal preference,
                  the customer bears the return shipping cost.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Exchange Policy
              </h2>
              <p>
                We offer exchanges subject to product availability. You can
                exchange for a different color, size, or product of equal or
                higher value. For exchanges with higher-value products, the
                price difference must be paid. Contact us to initiate an
                exchange.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Refund Process
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Refunds are initiated within <strong>3-5 business days</strong>{" "}
                  after we receive and inspect the returned product.
                </li>
                <li>
                  <strong>Online Payment Refunds:</strong> Refunded to the
                  original payment method (bank account, UPI, or card) within
                  5-7 business days.
                </li>
                <li>
                  <strong>COD Order Refunds:</strong> Refunded via bank
                  transfer (NEFT/IMPS). Please share your bank details when
                  initiating the return.
                </li>
                <li>
                  Shipping charges (if any) paid on the original order are
                  non-refundable.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Cancellation
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Orders can be cancelled <strong>before shipment</strong> at
                  no charge.
                </li>
                <li>
                  To cancel, contact us immediately via WhatsApp or phone with
                  your order number.
                </li>
                <li>
                  Cancelled orders with online payments will be refunded
                  within 3-5 business days.
                </li>
                <li>
                  Orders that have already been shipped cannot be cancelled
                  but can be returned after delivery.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Damaged or Defective Products
              </h2>
              <p>
                If you receive a damaged or defective saree, please contact us
                within 48 hours of delivery with photos of the damage. We will
                arrange a free pickup and send a replacement or full refund.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Contact for Returns
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Phone: {siteConfig.phone}</li>
                <li>WhatsApp: {siteConfig.whatsapp}</li>
                <li>Email: {siteConfig.email}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
