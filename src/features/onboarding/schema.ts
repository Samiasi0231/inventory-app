import { z } from "zod";
import { isValidPhoneForCountry } from "./phone";

export const businessDetailsSchema = z
  .object({
    businessName: z.string().trim().min(2, "Enter your business name"),
    staffSize: z.string().min(1, "Select staff size"),
    country: z.string().min(1, "Select a country"),
    address: z.string().trim().min(3, "Enter your business address"),
    city: z.string().min(1, "Select a city or region"),
    postalCode: z.string().trim().optional(),
    currency: z.string().min(1, "Select a base currency"),
    taxId: z.string().trim().optional(),
    phone: z.string().trim().optional(),
  })
  // Optional, but when filled it must be a real number for the selected country.
  .refine((data) => !data.phone || isValidPhoneForCountry(data.phone, data.country), {
    message: "Enter a valid phone number for the selected country",
    path: ["phone"],
  });

export type BusinessDetailsValues = z.infer<typeof businessDetailsSchema>;