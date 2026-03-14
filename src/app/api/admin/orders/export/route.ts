import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import ExcelJS from "exceljs";

import type { Prisma, OrderStatus } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "xlsx";
  const status = searchParams.get("status") || undefined;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status as unknown as OrderStatus;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z");
  }

  const orders = await db.order.findMany({
    where,
    include: {
      user: { select: { name: true, phone: true, email: true } },
      items: {
        select: {
          productName: true,
          productSku: true,
          price: true,
          quantity: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (format === "csv") {
    // Generate CSV
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "Items",
      "Subtotal",
      "Shipping",
      "Discount",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Coupon Code",
      "Tracking Number",
    ];

    const rows = orders.map((order) => {
      const items = order.items
        .map((i) => `${i.productName} x${i.quantity}`)
        .join("; ");
      return [
        order.orderNumber,
        new Date(order.createdAt).toLocaleDateString("en-IN"),
        order.user?.name || "",
        order.user?.phone || "",
        order.user?.email || "",
        items,
        order.subtotal.toNumber(),
        order.shippingCharge.toNumber(),
        order.discount.toNumber(),
        order.totalAmount.toNumber(),
        order.paymentMethod,
        order.paymentStatus,
        order.status,
        order.couponCode || "",
        order.trackingNumber || "",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell);
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      ),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  // Generate Excel
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Krishnapriya Textiles";
  workbook.created = new Date();

  // Orders sheet
  const sheet = workbook.addWorksheet("Orders");

  sheet.columns = [
    { header: "Order Number", key: "orderNumber", width: 22 },
    { header: "Date", key: "date", width: 14 },
    { header: "Customer", key: "customer", width: 20 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Items", key: "items", width: 40 },
    { header: "Subtotal (₹)", key: "subtotal", width: 14 },
    { header: "Shipping (₹)", key: "shipping", width: 14 },
    { header: "Discount (₹)", key: "discount", width: 14 },
    { header: "Total (₹)", key: "total", width: 14 },
    { header: "Payment", key: "payment", width: 12 },
    { header: "Pay Status", key: "payStatus", width: 12 },
    { header: "Status", key: "status", width: 14 },
    { header: "Coupon", key: "coupon", width: 14 },
    { header: "Tracking#", key: "tracking", width: 18 },
    { header: "City", key: "city", width: 16 },
    { header: "State", key: "state", width: 16 },
    { header: "Pincode", key: "pincode", width: 10 },
  ];

  // Style header row
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF8B0000" },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  orders.forEach((order) => {
    const address = order.shippingAddress as Record<string, string> | null;
    const items = order.items
      .map((i) => `${i.productName} (${i.productSku}) x${i.quantity} @ ₹${i.price.toNumber()}`)
      .join("\n");

    sheet.addRow({
      orderNumber: order.orderNumber,
      date: new Date(order.createdAt).toLocaleDateString("en-IN"),
      customer: order.user?.name || "—",
      phone: order.user?.phone || "",
      items,
      subtotal: order.subtotal.toNumber(),
      shipping: order.shippingCharge.toNumber(),
      discount: order.discount.toNumber(),
      total: order.totalAmount.toNumber(),
      payment: order.paymentMethod === "COD" ? "COD" : "Online",
      payStatus: order.paymentStatus,
      status: order.status,
      coupon: order.couponCode || "",
      tracking: order.trackingNumber || "",
      city: address?.city || "",
      state: address?.state || "",
      pincode: address?.pincode || "",
    });
  });

  // Summary sheet
  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 25 },
    { header: "Value", key: "value", width: 20 },
  ];
  summarySheet.getRow(1).font = { bold: true };

  const totalAmount = orders.reduce((s, o) => s + o.totalAmount.toNumber(), 0);
  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
  const paidAmount = paidOrders.reduce((s, o) => s + o.totalAmount.toNumber(), 0);

  summarySheet.addRows([
    { metric: "Total Orders Exported", value: orders.length },
    { metric: "Total Amount", value: `₹${totalAmount.toLocaleString("en-IN")}` },
    { metric: "Paid Orders", value: paidOrders.length },
    { metric: "Paid Amount", value: `₹${paidAmount.toLocaleString("en-IN")}` },
    { metric: "COD Orders", value: orders.filter((o) => o.paymentMethod === "COD").length },
    { metric: "Online Orders", value: orders.filter((o) => o.paymentMethod === "PREPAID").length },
    { metric: "Export Date", value: new Date().toLocaleDateString("en-IN") },
  ]);

  const excelBuffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(new Uint8Array(excelBuffer as unknown as ArrayBuffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.xlsx"`,
    },
  });
}
