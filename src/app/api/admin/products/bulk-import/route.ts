import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import ExcelJS from "exceljs";
import { Fabric, Occasion } from "@prisma/client";

const VALID_FABRICS = Object.values(Fabric);
const VALID_OCCASIONS = Object.values(Occasion);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(buffer) as any);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      return NextResponse.json({ error: "No worksheet found" }, { status: 400 });
    }

    // Get categories for name-to-id mapping
    const categories = await db.category.findMany({
      select: { id: true, name: true },
    });
    const categoryMap = new Map(
      categories.map((c) => [c.name.toLowerCase(), c.id])
    );

    // Get existing SKUs to avoid duplicates
    const existingSkus = new Set(
      (await db.product.findMany({ select: { sku: true } })).map((p) => p.sku)
    );

    const results: {
      row: number;
      status: "success" | "error";
      name: string;
      message: string;
    }[] = [];

    let successCount = 0;
    let errorCount = 0;

    // Read header row
    const headerRow = sheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber] = String(cell.value || "").toLowerCase().trim();
    });

    // Process each row (skip header)
    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);

      // Helper to get value by header name
      function getCell(headerName: string): string {
        const colIndex = headers.findIndex((h) => h === headerName.toLowerCase());
        if (colIndex === -1) return "";
        const val = row.getCell(colIndex).value;
        return val != null ? String(val).trim() : "";
      }

      function getNumberCell(headerName: string): number | undefined {
        const val = getCell(headerName);
        if (!val) return undefined;
        const num = parseFloat(val);
        return isNaN(num) ? undefined : num;
      }

      const name = getCell("name");
      if (!name) continue; // Skip empty rows

      try {
        const sku = getCell("sku");
        if (!sku) {
          results.push({
            row: rowNumber,
            status: "error",
            name,
            message: "SKU is required",
          });
          errorCount++;
          continue;
        }

        if (existingSkus.has(sku)) {
          results.push({
            row: rowNumber,
            status: "error",
            name,
            message: `SKU "${sku}" already exists`,
          });
          errorCount++;
          continue;
        }

        const description = getCell("description");
        if (!description || description.length < 10) {
          results.push({
            row: rowNumber,
            status: "error",
            name,
            message: "Description must be at least 10 characters",
          });
          errorCount++;
          continue;
        }

        const price = getNumberCell("price");
        if (!price || price < 1) {
          results.push({
            row: rowNumber,
            status: "error",
            name,
            message: "Price must be at least ₹1",
          });
          errorCount++;
          continue;
        }

        const fabricStr = getCell("fabric").toUpperCase().replace(/\s+/g, "_");
        if (!VALID_FABRICS.includes(fabricStr as Fabric)) {
          results.push({
            row: rowNumber,
            status: "error",
            name,
            message: `Invalid fabric "${getCell("fabric")}". Valid: ${VALID_FABRICS.join(", ")}`,
          });
          errorCount++;
          continue;
        }

        const occasionStr = getCell("occasion");
        const occasions = occasionStr
          .split(",")
          .map((o) => o.trim().toUpperCase().replace(/\s+/g, "_"))
          .filter((o) => VALID_OCCASIONS.includes(o as Occasion));
        if (occasions.length === 0) {
          results.push({
            row: rowNumber,
            status: "error",
            name,
            message: `No valid occasion provided. Valid: ${VALID_OCCASIONS.join(", ")}`,
          });
          errorCount++;
          continue;
        }

        const categoryName = getCell("category");
        const categoryId = categoryMap.get(categoryName.toLowerCase());
        if (!categoryId) {
          results.push({
            row: rowNumber,
            status: "error",
            name,
            message: `Category "${categoryName}" not found. Available: ${categories.map((c) => c.name).join(", ")}`,
          });
          errorCount++;
          continue;
        }

        const color = getCell("color");
        if (!color) {
          results.push({
            row: rowNumber,
            status: "error",
            name,
            message: "Color is required",
          });
          errorCount++;
          continue;
        }

        // Generate unique slug
        let slug = slugify(name);
        const existingSlug = await db.product.findUnique({
          where: { slug },
          select: { id: true },
        });
        if (existingSlug) {
          slug = `${slug}-${Date.now().toString(36)}`;
        }

        await db.product.create({
          data: {
            name,
            slug,
            sku,
            description,
            shortDescription: getCell("short description") || undefined,
            price,
            compareAtPrice: getNumberCell("compare at price") || undefined,
            costPrice: getNumberCell("cost price") || undefined,
            stock: getNumberCell("stock") ?? 0,
            lowStockThreshold: getNumberCell("low stock threshold") ?? 5,
            fabric: fabricStr as Fabric,
            occasion: occasions as Occasion[],
            categoryId,
            color,
            length: getCell("length") || undefined,
            width: getCell("width") || undefined,
            weight: getCell("weight") || undefined,
            blouseIncluded: getCell("blouse included").toLowerCase() === "yes",
            blouseLength: getCell("blouse length") || undefined,
            borderType: getCell("border type") || undefined,
            palluDetail: getCell("pallu detail") || undefined,
            washCare: getCell("wash care") || undefined,
            zariType: getCell("zari type") || undefined,
            isActive: getCell("active").toLowerCase() !== "no",
            isFeatured: getCell("featured").toLowerCase() === "yes",
            isNewArrival: getCell("new arrival").toLowerCase() === "yes",
            codAvailable: getCell("cod available").toLowerCase() !== "no",
          },
        });

        existingSkus.add(sku);
        successCount++;
        results.push({
          row: rowNumber,
          status: "success",
          name,
          message: "Product created successfully",
        });
      } catch (err: any) {
        errorCount++;
        results.push({
          row: rowNumber,
          status: "error",
          name,
          message: err.message || "Unknown error",
        });
      }
    }

    return NextResponse.json({
      total: successCount + errorCount,
      success: successCount,
      errors: errorCount,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process file" },
      { status: 500 }
    );
  }
}

// GET: Download template
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await db.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Krishnapriya Textiles";

  const sheet = workbook.addWorksheet("Products");

  sheet.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "SKU", key: "sku", width: 15 },
    { header: "Description", key: "description", width: 40 },
    { header: "Short Description", key: "shortDescription", width: 30 },
    { header: "Price", key: "price", width: 12 },
    { header: "Compare At Price", key: "compareAtPrice", width: 16 },
    { header: "Cost Price", key: "costPrice", width: 12 },
    { header: "Stock", key: "stock", width: 8 },
    { header: "Low Stock Threshold", key: "lowStockThreshold", width: 18 },
    { header: "Fabric", key: "fabric", width: 15 },
    { header: "Occasion", key: "occasion", width: 20 },
    { header: "Category", key: "category", width: 18 },
    { header: "Color", key: "color", width: 12 },
    { header: "Length", key: "length", width: 10 },
    { header: "Width", key: "width", width: 10 },
    { header: "Weight", key: "weight", width: 10 },
    { header: "Blouse Included", key: "blouseIncluded", width: 16 },
    { header: "Blouse Length", key: "blouseLength", width: 14 },
    { header: "Border Type", key: "borderType", width: 14 },
    { header: "Pallu Detail", key: "palluDetail", width: 14 },
    { header: "Wash Care", key: "washCare", width: 20 },
    { header: "Zari Type", key: "zariType", width: 12 },
    { header: "Active", key: "active", width: 8 },
    { header: "Featured", key: "featured", width: 10 },
    { header: "New Arrival", key: "newArrival", width: 12 },
    { header: "COD Available", key: "codAvailable", width: 14 },
  ];

  // Style header
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF8B0000" },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  // Add example row
  sheet.addRow({
    name: "Mysore Silk Saree - Royal Blue",
    sku: "KP-SILK-001",
    description: "Beautiful handwoven Mysore silk saree with golden zari border. Perfect for weddings and festive occasions.",
    shortDescription: "Handwoven Mysore silk with golden zari",
    price: 2500,
    compareAtPrice: 3500,
    costPrice: 1500,
    stock: 10,
    lowStockThreshold: 5,
    fabric: "MYSORE_SILK",
    occasion: "WEDDING, FESTIVE",
    category: categories[0]?.name || "Silk Sarees",
    color: "Royal Blue",
    length: "6.3 meters",
    width: "1.1 meters",
    weight: "500g",
    blouseIncluded: "Yes",
    blouseLength: "0.8 meters",
    borderType: "Temple Border",
    palluDetail: "Grand Pallu with Peacock motifs",
    washCare: "Dry clean only",
    zariType: "Pure Zari",
    active: "Yes",
    featured: "No",
    newArrival: "Yes",
    codAvailable: "Yes",
  });

  // Add reference sheet
  const refSheet = workbook.addWorksheet("Reference");
  refSheet.columns = [
    { header: "Field", key: "field", width: 20 },
    { header: "Valid Values", key: "values", width: 60 },
  ];
  refSheet.getRow(1).font = { bold: true };

  const fabricValues = VALID_FABRICS.join(", ");
  const occasionValues = VALID_OCCASIONS.join(", ");
  const categoryValues = categories.map((c) => c.name).join(", ");

  refSheet.addRows([
    { field: "Fabric", values: fabricValues },
    { field: "Occasion", values: `${occasionValues} (comma separated for multiple)` },
    { field: "Category", values: categoryValues },
    { field: "Blouse Included", values: "Yes / No" },
    { field: "Active", values: "Yes / No (default: Yes)" },
    { field: "Featured", values: "Yes / No (default: No)" },
    { field: "New Arrival", values: "Yes / No (default: No)" },
    { field: "COD Available", values: "Yes / No (default: Yes)" },
    { field: "Required Fields", values: "Name, SKU, Description, Price, Fabric, Occasion, Category, Color" },
  ]);

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer as any, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="product-import-template.xlsx"`,
    },
  });
}
