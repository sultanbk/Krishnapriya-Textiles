import { z } from "zod";
import { DiscountType } from "@prisma/client";

const discountTypeValues = Object.values(DiscountType) as [string, ...string[]];

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(20)
    .transform((v) => v.toUpperCase()),
  description: z.string().max(200).optional(),
  discountType: z.enum(discountTypeValues as [DiscountType, ...DiscountType[]]),
  discountValue: z.coerce.number().min(1, "Discount value required"),
  minOrderAmount: z.coerce.number().optional(),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().int().optional(),
  perUserLimit: z.coerce.number().int().default(1),
  validFrom: z.coerce.date().default(() => new Date()),
  validUntil: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;
