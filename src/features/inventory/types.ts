import type { ID, ISODateString, ListParams } from "@/types/shared";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

/**
 * A product as it appears in the Inventory list, with stock for the active
 * branch. `categoryName` is denormalised for list rendering.
 */
export interface InventoryItem {
  id: ID;
  /** e.g. "I-001". */
  itemCode: string;
  productId: ID;
  name: string;
  categoryId: ID;
  categoryName: string;
  /** Stock at the branch this was fetched for, not across all branches. */
  totalStock: number;
  /** Stock at or below this level counts as low. */
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  baseUnit: string;
  /** The branch `totalStock` refers to. */
  branchId: ID;
  archived: boolean;
  updatedAt: ISODateString;
}

/** Derived from the stock level rather than stored. */
export function getStockStatus(item: Pick<InventoryItem, "totalStock" | "reorderPoint">): StockStatus {
  if (item.totalStock <= 0) return "out_of_stock";
  if (item.totalStock <= item.reorderPoint) return "low_stock";
  return "in_stock";
}

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

/** Deltas are percentages against the previous period. */
export interface InventorySummary {
  stockValue: number;
  stockValueDelta: number;
  potentialSalesValue: number;
  potentialSalesValueDelta: number;
  profitToBeMade: number;
  profitToBeMadeDelta: number;
  itemsRequiringAttention: number;
  itemsRequiringAttentionDelta: number;
}

export interface InventoryListParams extends ListParams {
  branchId?: ID;
  status?: StockStatus | "all";
  categoryId?: ID | "all";
  archived?: boolean;
}

/* -- Stock movement payloads ----------------------------------------------- */

export interface StockMovementLine {
  productId: ID;
  variantId?: ID | null;
  batchCode?: string | null;
  unit: string;
  quantity: number;
}

export interface TransferStockPayload {
  fromBranchId: ID;
  toBranchId: ID;
  date: ISODateString;
  createdBy: string;
  lines: StockMovementLine[];
  notes?: string;
}

export type AdjustmentReason =
  | "damaged"
  | "expired"
  | "theft"
  | "stock_count"
  | "returned"
  | "other";

export const ADJUSTMENT_REASONS: { value: AdjustmentReason; label: string }[] = [
  { value: "stock_count", label: "Stock count correction" },
  { value: "damaged", label: "Damaged" },
  { value: "expired", label: "Expired" },
  { value: "theft", label: "Theft or loss" },
  { value: "returned", label: "Customer return" },
  { value: "other", label: "Other" },
];

export type AdjustmentDirection = "increase" | "decrease";

export interface AdjustStockPayload {
  branchId: ID;
  productId: ID;
  direction: AdjustmentDirection;
  quantity: number;
  unit: string;
  reason: AdjustmentReason;
  date: ISODateString;
  notes?: string;
}

export interface ReorderStockPayload {
  branchId: ID;
  productId: ID;
  supplierId: ID;
  quantity: number;
  unit: string;
  expectedCostPrice: number;
  expectedDeliveryDate?: ISODateString;
  notes?: string;
}

/* -- Add Product wizard ---------------------------------------------------- */

export interface UnitConversion {
  /** Larger unit being defined, e.g. "Carton". */
  unit: string;
  /** How many base units it contains. */
  equals: number;
  baseUnit: string;
}

export interface QuantityDiscount {
  minQuantity: number;
  unit: string;
  discountType: "percentage" | "fixed";
  discount: number;
}

export interface ProductVariantDraft {
  name: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  openingStock: number;
}

export interface CreateProductPayload {
  name: string;
  type: "physical" | "service";
  sku: string;
  barcode?: string;
  categoryId: ID;
  brandId?: ID | null;
  imageDataUrl?: string | null;
  baseUnit: string;
  defaultSellingPrice: number;
  defaultCostPrice: number;
  unitConversions: UnitConversion[];
  quantityDiscounts: QuantityDiscount[];
  taxSchemeId?: ID | null;
  branchId: ID;
  openingStock: number;
  reorderPoint: number;
  trackBatches: boolean;
  variants: ProductVariantDraft[];
}
