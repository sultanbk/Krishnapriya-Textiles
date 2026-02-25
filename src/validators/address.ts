import { z } from "zod";

export const addressSchema = z.object({
  label: z.enum(["Home", "Work", "Other"]).default("Home"),
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit number required"),
  line1: z.string().min(5, "Address line 1 is required").max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
