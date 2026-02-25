import { z } from "zod";
import { Fabric, Occasion } from "@prisma/client";

const fabricValues = Object.values(Fabric) as [string, ...string[]];
const occasionValues = Object.values(Occasion) as [string, ...string[]];

export const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().max(300).optional(),
  sku: z.string().min(1, "SKU is required").max(50),
  price: z.coerce.number().min(1, "Price must be at least ₹1"),
  compareAtPrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  fabric: z.enum(fabricValues as [Fabric, ...Fabric[]]),
  occasion: z.array(z.enum(occasionValues as [Occasion, ...Occasion[]])).min(1, "Select at least one occasion"),
  categoryId: z.string().cuid("Invalid category"),
  color: z.string().min(1, "Color is required"),
  length: z.string().optional(),
  width: z.string().optional(),
  weight: z.string().optional(),
  blouseIncluded: z.boolean().default(false),
  blouseLength: z.string().optional(),
  borderType: z.string().optional(),
  palluDetail: z.string().optional(),
  washCare: z.string().optional(),
  zariType: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  codAvailable: z.boolean().default(true),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  category: z.string().optional(),
  fabric: z.array(z.string()).optional(),
  occasion: z.array(z.string()).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "popular"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
