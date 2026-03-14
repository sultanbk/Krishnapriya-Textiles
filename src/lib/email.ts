import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return _resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "Krishnapriya Textiles <noreply@krishnapriyatextiles.com>";
const SITE_NAME = "Krishnapriya Textiles";

// ─── Order Confirmation Email ───

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  orderNumber,
  items,
  subtotal,
  shipping,
  total,
  paymentMethod,
  shippingAddress,
}: {
  to: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}) {
  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  const addressLine = [
    shippingAddress.line1,
    shippingAddress.line2,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f4f0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #6b1420, #8b1a2a); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 1px;">${SITE_NAME}</h1>
      <p style="color: #f0d49b; margin: 8px 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Premium Silk Sarees</p>
    </div>
    
    <!-- Body -->
    <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
      <h2 style="color: #6b1420; margin: 0 0 8px;">Order Confirmed! ✨</h2>
      <p style="color: #666; margin: 0 0 24px; line-height: 1.6;">
        Hi ${customerName}, thank you for your order. We're preparing your beautiful saree(s) with care.
      </p>
      
      <div style="background: #f9f6f2; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #888;">Order Number</p>
        <p style="margin: 4px 0 0; font-size: 20px; font-weight: 700; color: #6b1420;">${orderNumber}</p>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f9f6f2;">
            <th style="padding: 12px; text-align: left; font-size: 13px; color: #888; font-weight: 600;">Item</th>
            <th style="padding: 12px; text-align: center; font-size: 13px; color: #888; font-weight: 600;">Qty</th>
            <th style="padding: 12px; text-align: right; font-size: 13px; color: #888; font-weight: 600;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="border-top: 2px solid #eee; padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Subtotal</span>
          <span style="color: #333;">₹${subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Shipping</span>
          <span style="color: ${shipping === 0 ? "#16a34a" : "#333"};">${shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 2px solid #6b1420;">
          <span style="font-weight: 700; font-size: 18px; color: #333;">Total</span>
          <span style="font-weight: 700; font-size: 18px; color: #6b1420;">₹${total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <!-- Payment & Shipping -->
      <div style="margin-top: 24px; display: grid; gap: 16px;">
        <div style="background: #f9f6f2; border-radius: 12px; padding: 16px;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #888;">Payment Method</p>
          <p style="margin: 0; font-weight: 600; color: #333;">${paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online (Razorpay)"}</p>
        </div>
        <div style="background: #f9f6f2; border-radius: 12px; padding: 16px;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #888;">Shipping To</p>
          <p style="margin: 0; font-weight: 600; color: #333;">${shippingAddress.fullName}</p>
          <p style="margin: 4px 0 0; font-size: 14px; color: #666;">${addressLine}</p>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}" style="display: inline-block; background: #6b1420; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Track Your Order →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
      <p>Thank you for shopping with ${SITE_NAME}!</p>
      <p>Questions? Reply to this email or WhatsApp us.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const data = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Order Confirmed — ${orderNumber} | ${SITE_NAME}`,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// ─── Shipping Notification Email ───

export async function sendShippingNotificationEmail({
  to,
  customerName,
  orderNumber,
  trackingUrl,
}: {
  to: string;
  customerName: string;
  orderNumber: string;
  trackingUrl?: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f4f0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #6b1420, #8b1a2a); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">${SITE_NAME}</h1>
    </div>
    <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
      <h2 style="color: #6b1420; margin: 0 0 8px;">Your Order Has Shipped! 🚚</h2>
      <p style="color: #666; line-height: 1.6;">
        Hi ${customerName}, great news! Your order <strong>${orderNumber}</strong> has been shipped and is on its way.
      </p>
      <p style="color: #666;">You can expect delivery within 5-7 business days.</p>
      ${
        trackingUrl
          ? `<div style="text-align: center; margin-top: 24px;">
              <a href="${trackingUrl}" style="display: inline-block; background: #6b1420; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">Track Your Package →</a>
            </div>`
          : ""
      }
    </div>
    <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
      <p>Thank you for shopping with ${SITE_NAME}!</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const data = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your Order ${orderNumber} Has Shipped! | ${SITE_NAME}`,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// ─── Welcome Email ───

export async function sendWelcomeEmail({
  to,
  customerName,
}: {
  to: string;
  customerName: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f4f0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #6b1420, #8b1a2a); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">${SITE_NAME}</h1>
      <p style="color: #f0d49b; margin: 8px 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Premium Silk Sarees</p>
    </div>
    <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
      <h2 style="color: #6b1420; margin: 0 0 8px;">Welcome to ${SITE_NAME}! 🎉</h2>
      <p style="color: #666; line-height: 1.6;">
        Hi ${customerName}, we're thrilled to have you as part of our family. Explore our curated collection of handpicked silk sarees from Karnataka.
      </p>
      <div style="background: #f9f6f2; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 14px; color: #888;">🎁 Special Welcome Offer</p>
        <p style="margin: 0; font-size: 24px; font-weight: 700; color: #6b1420;">Free Shipping</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: #666;">on orders above ₹1,500</p>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" style="display: inline-block; background: #6b1420; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Start Shopping →
        </a>
      </div>
    </div>
    <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
      <p>Have questions? WhatsApp us anytime!</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const data = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to ${SITE_NAME}! ✨`,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// ─── Abandoned Cart Email ───

export async function sendAbandonedCartEmail({
  to,
  customerName,
  items,
  cartTotal,
}: {
  to: string;
  customerName: string;
  items: { name: string; price: number; image?: string | null }[];
  cartTotal: number;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cartTotal);

  const itemRows = items
    .slice(0, 5)
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.image ? `<img src="${item.image}" alt="" width="60" height="60" style="border-radius:8px; object-fit:cover;" />` : ""}
            <div>
              <p style="margin:0; font-weight:600; color:#1a1a2e;">${item.name}</p>
              <p style="margin:4px 0 0; color:#6b1420; font-weight:600;">₹${item.price.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </td>
      </tr>`
    )
    .join("");

  const moreItems = items.length > 5 ? `<p style="color:#666; font-size:14px;">...and ${items.length - 5} more items</p>` : "";

  const html = `
    <div style="max-width:600px; margin:0 auto; font-family:'Segoe UI',Arial,sans-serif; background:#ffffff;">
      <div style="padding:30px; text-align:center; background:linear-gradient(135deg, #6b1420, #8a1a2d); border-radius:12px 12px 0 0;">
        <h1 style="margin:0; color:#fff; font-size:24px;">You left something behind! 🛒</h1>
      </div>
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333;">Hi ${customerName || "there"},</p>
        <p style="font-size:15px; color:#555; line-height:1.6;">
          We noticed you left some beautiful items in your cart. They're waiting for you!
        </p>
        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          ${itemRows}
        </table>
        ${moreItems}
        <div style="background:#f8f3f0; padding:16px; border-radius:8px; margin:20px 0; text-align:center;">
          <p style="margin:0; font-size:14px; color:#666;">Cart Total</p>
          <p style="margin:4px 0 0; font-size:24px; font-weight:700; color:#6b1420;">${formattedTotal}</p>
        </div>
        <div style="text-align:center; margin:24px 0;">
          <a href="${siteUrl}/cart" style="display:inline-block; padding:14px 32px; background:#6b1420; color:white; text-decoration:none; border-radius:8px; font-weight:600; font-size:16px;">
            Complete Your Purchase →
          </a>
        </div>
        <p style="font-size:13px; color:#999; text-align:center;">
          Items in your cart are subject to availability. Don't miss out!
        </p>
      </div>
      <div style="padding:20px; background:#f5f5f5; text-align:center; font-size:12px; color:#999; border-radius:0 0 12px 12px;">
        <p style="margin:0;">© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
      </div>
    </div>`;

  try {
    const data = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `You forgot something! Your cart is waiting 🛒`,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Abandoned cart email error:", error);
    return { success: false, error };
  }
}
