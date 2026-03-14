"use client";

import { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";

// Styles for the invoice
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#8B0000",
    paddingBottom: 15,
  },
  storeName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#8B0000",
  },
  storeTagline: {
    fontSize: 9,
    color: "#666",
    marginTop: 2,
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    color: "#333",
  },
  invoiceDetails: {
    textAlign: "right",
    fontSize: 9,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#8B0000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: "#999",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 10,
    marginBottom: 4,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#8B0000",
    padding: 8,
    color: "#fff",
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    padding: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  colItem: { flex: 3 },
  colSku: { flex: 1.5 },
  colQty: { flex: 0.8, textAlign: "right" },
  colPrice: { flex: 1.2, textAlign: "right" },
  colTotal: { flex: 1.2, textAlign: "right" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 3,
  },
  summaryLabel: {
    width: 120,
    textAlign: "right",
    paddingRight: 15,
    color: "#666",
  },
  summaryValue: {
    width: 100,
    textAlign: "right",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 6,
    borderTopWidth: 2,
    borderTopColor: "#8B0000",
    marginTop: 4,
  },
  totalLabel: {
    width: 120,
    textAlign: "right",
    paddingRight: 15,
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  totalValue: {
    width: 100,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: "#8B0000",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
  },
  badge: {
    backgroundColor: "#e8e8e8",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    alignSelf: "flex-start",
  },
});

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

interface InvoiceData {
  orderNumber: string;
  date: string;
  customer: { name: string; phone: string; email: string };
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  } | null;
  items: {
    name: string;
    sku: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  subtotal: number;
  shippingCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  couponCode: string | null;
}

function InvoiceDocument({ data }: { data: InvoiceData }) {
  const invoiceDate = new Date(data.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.storeName}>Krishnapriya Textiles</Text>
            <Text style={styles.storeTagline}>
              Premium Silk Sarees from Karnataka
            </Text>
            <Text style={{ fontSize: 8, color: "#666", marginTop: 4 }}>
              Shidling Complex, Opp Bus Stand, Hubli Road, Shirahatti - 582120
            </Text>
            <Text style={{ fontSize: 8, color: "#666" }}>
              Phone: +91 91084 55006 | Email: info@krishnapriyatextiles.com
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceDetails}>
              #{data.orderNumber}
            </Text>
            <Text style={styles.invoiceDetails}>Date: {invoiceDate}</Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    data.paymentStatus === "PAID" ? "#dcfce7" : "#fef9c3",
                  marginTop: 4,
                  alignSelf: "flex-end",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 8,
                  color:
                    data.paymentStatus === "PAID" ? "#166534" : "#854d0e",
                }}
              >
                {data.paymentStatus === "PAID" ? "PAID" : "PENDING"}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer & Shipping */}
        <View style={[styles.section, styles.row]}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.value}>{data.customer.name}</Text>
            <Text style={styles.value}>{data.customer.phone}</Text>
            {data.customer.email ? (
              <Text style={styles.value}>{data.customer.email}</Text>
            ) : null}
          </View>
          {data.shippingAddress && (
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Ship To</Text>
              <Text style={styles.value}>
                {data.shippingAddress.fullName}
              </Text>
              <Text style={styles.value}>
                {data.shippingAddress.addressLine1}
              </Text>
              {data.shippingAddress.addressLine2 ? (
                <Text style={styles.value}>
                  {data.shippingAddress.addressLine2}
                </Text>
              ) : null}
              <Text style={styles.value}>
                {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
                {data.shippingAddress.pincode}
              </Text>
              <Text style={styles.value}>
                +91 {data.shippingAddress.phone}
              </Text>
            </View>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colItem]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.colSku]}>SKU</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>Price</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
          </View>
          {data.items.map((item, index) => (
            <View
              key={index}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <Text style={styles.colItem}>{item.name}</Text>
              <Text style={[styles.colSku, { fontSize: 8, color: "#666" }]}>
                {item.sku}
              </Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatINR(item.price)}</Text>
              <Text style={[styles.colTotal, { fontFamily: "Helvetica-Bold" }]}>
                {formatINR(item.total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={{ marginTop: 15 }}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {formatINR(data.subtotal)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {data.shippingCharge === 0
                ? "FREE"
                : formatINR(data.shippingCharge)}
            </Text>
          </View>
          {data.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Discount{data.couponCode ? ` (${data.couponCode})` : ""}
              </Text>
              <Text style={[styles.summaryValue, { color: "#16a34a" }]}>
                -{formatINR(data.discount)}
              </Text>
            </View>
          )}
          <View style={styles.summaryTotal}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              {formatINR(data.totalAmount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>
              {data.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for shopping with Krishnapriya Textiles!</Text>
          <Text style={{ marginTop: 2 }}>
            This is a computer-generated invoice and does not require a
            signature.
          </Text>
          <Text style={{ marginTop: 2 }}>
            For queries: +91 91084 55006 | info@krishnapriyatextiles.com |
            WhatsApp: +91 91084 55006
          </Text>
        </View>
      </Page>
    </Document>
  );
}

interface DownloadInvoiceButtonProps {
  orderId: string;
  orderNumber: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function DownloadInvoiceButton({
  orderId,
  orderNumber,
  variant = "outline",
  size = "sm",
}: DownloadInvoiceButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`);
      if (!res.ok) throw new Error("Failed to fetch invoice data");

      const data: InvoiceData = await res.json();
      const blob = await pdf(<InvoiceDocument data={data} />).toBlob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={loading}
    >
      <FileText className="mr-2 h-4 w-4" />
      {loading ? "Generating..." : "Invoice PDF"}
    </Button>
  );
}
