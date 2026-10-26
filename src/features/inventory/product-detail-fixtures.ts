import type { AddProductValues } from "./components/add-product/schema";
import { MOCK_BRANDS, MOCK_SUPPLIERS, type InventoryRecord } from "./mock-data";

/** Demo catalog metadata; never used as a fallback for user-created products. */
export function buildProductDetailFixture(record: InventoryRecord, branchId: string): AddProductValues {
  const index = Number(record.id.replace("inv_", "")) - 1;
  const code = record.name.replace(/[^a-zA-Z ]/g, "").split(" ").filter(Boolean).map(word => word[0]).join("").slice(0, 3).toUpperCase();
  const sku = `${code}-${String(index + 1).padStart(3, "0")}`;
  const brandId = /nestle|milo|maggi|golden morn|bournvita|peak/i.test(record.name) ? "brand_nestle"
    : /dangote/i.test(record.name) ? "brand_dangote"
    : /honeywell/i.test(record.name) ? "brand_honeywell"
    : /knorr|omo|lipton|close up/i.test(record.name) ? "brand_unilever" : "brand_none";
  const food = ["cat_food", "cat_snacks", "cat_drinks"].includes(record.categoryId);
  const hasVariants = index % 3 === 1;
  const variantNames = hasVariants ? ["Standard", "Family"] : ["Default"];
  const totalStock = record.stockByBranch[branchId] ?? 0;
  const quantities = hasVariants ? [Math.ceil(totalStock * 0.65), totalStock - Math.ceil(totalStock * 0.65)] : [totalStock];
  const brand = MOCK_BRANDS.find(entry => entry.id === brandId)?.name;
  return {
    name: record.name, type: "physical", sku,
    barcode: `6001${String(index + 1).padStart(9, "0")}`,
    categoryId: record.categoryId, brandId,
    description: `${record.name} supplied in sealed retail packaging. ${brandId === "brand_none" ? "" : `Part of the ${brand} range. `}${food ? "Store in a cool, dry place away from direct sunlight. Check the batch expiry date before sale." : "Keep sealed until use and store away from heat and moisture."}`,
    imageDataUrl: null,
    primarySupplierId: MOCK_SUPPLIERS[index % MOCK_SUPPLIERS.length].id,
    additionalSupplierIds: [{ id: MOCK_SUPPLIERS[(index + 1) % MOCK_SUPPLIERS.length].id }],
    baseUnit: record.baseUnit,
    defaultSellingPrice: record.sellingPrice, defaultCostPrice: record.costPrice,
    unitConversions: [{ unit: "Box", equals: 12, baseUnit: record.baseUnit }, { unit: "Carton", equals: 24, baseUnit: record.baseUnit }],
    quantityDiscounts: [{ minQuantity: 4, unit: "Carton", discountType: "percentage", discount: 10 }],
    taxSchemeId: "tax_vat", hasVariants,
    optionGroups: hasVariants ? [{ name: "Pack", values: variantNames.join(", ") }] : [],
    variantOverrides: hasVariants ? variantNames.map((name, i) => ({ name, sku: `${sku}-${i + 1}`, barcode: `6002${String(index * 2 + i + 1).padStart(9, "0")}`, sellingPrice: record.sellingPrice, costPrice: record.costPrice })) : [],
    trackInventory: true, reorderPoint: record.reorderPoint, alertUnit: record.baseUnit,
    openingStock: variantNames.map((variantName, i) => ({ variantName, branchId, quantity: quantities[i] })),
    trackBatches: food,
    batches: food ? variantNames.map((variantName, i) => ({ variantName, branchId, batchNumber: `${code}-B-${String(index + 1).padStart(3, "0")}-${i + 1}`, quantity: quantities[i], expiryDate: `2027-${String(3 + index % 7).padStart(2, "0")}-${String(12 + i * 6).padStart(2, "0")}` })) : [],
  };
}
