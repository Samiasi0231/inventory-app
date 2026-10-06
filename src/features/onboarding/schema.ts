import { z } from "zod";
 
export const businessDetailsSchema = z.object({
  businessName: z.string().trim().min(2, "Enter your business name"),
  staffRange: z.string().min(1, "Select number of staff"),
  country: z.string().min(1, "Select a country"),
  address: z.string().trim().min(3, "Enter your business address"),
  city: z.string().min(1, "Select a city or region"),
  postalCode: z.string().trim().optional(),
  currency: z.string().min(1, "Select a base currency"),
  taxId: z.string().trim().optional(),
});
 
export type BusinessDetailsValues = z.infer<typeof businessDetailsSchema>;