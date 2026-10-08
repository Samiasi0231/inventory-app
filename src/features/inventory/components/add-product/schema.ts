import { z } from "zod";

/**
 * One schema for the whole wizard, validated step by step via `trigger()`, so
 * the Review step can read every value without threading state between forms.
 */

export const basicInfoSchema = z.object({
  imageDataUrl: z.string().nullable().optional(),
  name: z.string().min(1, "Product name is required"),
  type: z.enum(["physical", "service"]),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, "Pick a category"),
  brandId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  primarySupplierId: z.string().min(1, "Pick a primary supplier"),
  additionalSupplierIds: z.array(z.object({ id: z.string() })).default([]),
});

export const pricingSchema = z.object({
  baseUnit: z.string().min(1, "Pick a base unit"),
  defaultSellingPrice: z.coerce.number().positive("Enter a selling price"),
  defaultCostPrice: z.coerce.number().positive("Enter a cost price"),
  unitConversions: z
    .array(
      z.object({
        unit: z.string().min(1, "Name the unit"),
        equals: z.coerce.number().positive("Must be more than zero"),
        baseUnit: z.string().min(1),
      }),
    )
    .default([]),
  quantityDiscounts: z
    .array(
      z.object({
        minQuantity: z.coerce.number().positive("Enter a quantity"),
        unit: z.string().min(1),
        discountType: z.enum(["percentage", "fixed"]),
        discount: z.coerce.number().nonnegative("Enter a discount"),
      }),
    )
    .default([]),
  taxSchemeId: z.string().optional(),
});

export const variantsSchema = z.object({
  hasVariants: z.boolean(),
  optionGroups: z
    .array(
      z.object({
        name: z.string().min(1, "Name the option"),
        /** Comma-separated in the UI, split on submit. */
        values: z.string().min(1, "Add at least one value"),
      }),
    )
    .default([]),
  variantOverrides: z
    .array(
      z.object({
        name: z.string(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        sellingPrice: z.coerce.number().nonnegative().optional(),
        costPrice: z.coerce.number().nonnegative().optional(),
      }),
    )
    .default([]),
});

export const inventoryConfigSchema = z.object({
  trackInventory: z.boolean(),
  reorderPoint: z.coerce.number().nonnegative("Enter a low stock alert level"),
  alertUnit: z.string().min(1, "Pick a unit"),
  openingStock: z
    .array(
      z.object({
        variantName: z.string(),
        branchId: z.string().min(1, "Pick a location"),
        quantity: z.coerce.number().nonnegative("Enter a quantity"),
      }),
    )
    .default([]),
  trackBatches: z.boolean(),
  batches: z
    .array(
      z.object({
        variantName: z.string(),
        branchId: z.string(),
        batchNumber: z.string().optional(),
        quantity: z.coerce.number().nonnegative().optional(),
        expiryDate: z.string().optional(),
      }),
    )
    .default([]),
});

export const addProductSchema = basicInfoSchema
  .merge(pricingSchema)
  .merge(variantsSchema)
  .merge(inventoryConfigSchema);

export type AddProductValues = z.input<typeof addProductSchema>;

/** Field names validated before each "Next", in wizard order. */
export const STEP_FIELDS: (keyof AddProductValues)[][] = [
  [
    "name",
    "type",
    "sku",
    "categoryId",
    "description",
    "primarySupplierId",
  ],
  ["baseUnit", "defaultSellingPrice", "defaultCostPrice", "unitConversions", "quantityDiscounts"],
  ["hasVariants", "optionGroups"],
  ["trackInventory", "reorderPoint", "alertUnit", "openingStock"],
  [],
];

export const WIZARD_STEPS = [
  { id: "basic", label: "Basic Info" },
  { id: "pricing", label: "Pricing & Units" },
  { id: "variants", label: "Variants" },
  { id: "inventory", label: "Inventory" },
  { id: "review", label: "Review" },
];

export const ADD_PRODUCT_DEFAULTS: AddProductValues = {
  imageDataUrl: null,
  name: "",
  type: "physical",
  sku: "",
  barcode: "",
  categoryId: "",
  brandId: "",
  description: "",
  primarySupplierId: "",
  additionalSupplierIds: [],

  baseUnit: "Piece",
  defaultSellingPrice: 0,
  defaultCostPrice: 0,
  unitConversions: [],
  quantityDiscounts: [],
  taxSchemeId: "",

  hasVariants: false,
  optionGroups: [],
  variantOverrides: [],

  trackInventory: true,
  reorderPoint: 10,
  alertUnit: "Piece",
  openingStock: [],
  trackBatches: false,
  batches: [],
};

/**
 * Cartesian product of the option groups, e.g. Size[Small,Large] × Flavour[Milk]
 * becomes ["Small / Milk", "Large / Milk"].
 */
export function buildVariantNames(groups: { name: string; values: string }[]): string[] {
  const parsed = groups
    .map((group) =>
      group.values
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    )
    .filter((values) => values.length > 0);

  if (parsed.length === 0) return [];

  return parsed.reduce<string[]>(
    (combinations, values) =>
      combinations.flatMap((combination) =>
        values.map((value) => (combination ? `${combination} / ${value}` : value)),
      ),
    [""],
  );
}
