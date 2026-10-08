import type { Brand, Category, Supplier, TaxScheme, Unit } from "@/types/shared";
import type { InventoryItem } from "./types";

/* -- Reference data -------------------------------------------------------- */

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat_food", name: "Food and Beverages" },
  { id: "cat_snacks", name: "Snacks & Confectionery" },
  { id: "cat_household", name: "Household" },
  { id: "cat_personal", name: "Personal Care" },
  { id: "cat_drinks", name: "Drinks" },
];

export const MOCK_BRANDS: Brand[] = [
  { id: "brand_nestle", name: "Nestle" },
  { id: "brand_dangote", name: "Dangote" },
  { id: "brand_honeywell", name: "Honeywell" },
  { id: "brand_unilever", name: "Unilever" },
  { id: "brand_none", name: "Unbranded" },
];

export const MOCK_UNITS: Unit[] = [
  { id: "unit_piece", name: "Piece", abbreviation: "pcs" },
  { id: "unit_carton", name: "Carton", abbreviation: "ctn" },
  { id: "unit_roll", name: "Roll", abbreviation: "roll" },
  { id: "unit_bag", name: "Bag", abbreviation: "bag" },
  { id: "unit_bottle", name: "Bottle", abbreviation: "btl" },
];

export const MOCK_TAX_SCHEMES: TaxScheme[] = [
  { id: "tax_vat", name: "Standard VAT (7.5%)", rate: 7.5 },
  { id: "tax_zero", name: "Zero rated (0%)", rate: 0 },
  { id: "tax_exempt", name: "Exempt", rate: 0 },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: "sup_mega", name: "Mega Distributors Ltd" },
  { id: "sup_rivers", name: "Rivers Wholesale" },
  { id: "sup_lagos", name: "Lagos Trade Partners" },
  { id: "sup_kano", name: "Kano Supply Co." },
];

/* -- Inventory items ------------------------------------------------------- */

interface SeedRow {
  name: string;
  totalStock: number;
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  categoryId: string;
}

const SEED_ROWS: SeedRow[] = [
  { name: "Pet Coke", totalStock: 200, reorderPoint: 250, costPrice: 55_000, sellingPrice: 60_000, categoryId: "cat_food" },
  { name: "Premium Rice (50kg)", totalStock: 300, reorderPoint: 80, costPrice: 70_000, sellingPrice: 72_000, categoryId: "cat_food" },
  { name: "Ayoola Palm oil (1L)", totalStock: 400, reorderPoint: 100, costPrice: 10_000, sellingPrice: 15_000, categoryId: "cat_food" },
  { name: "Golden Penny Spaghetti (500g)", totalStock: 10, reorderPoint: 5, costPrice: 70_000, sellingPrice: 75_000, categoryId: "cat_food" },
  { name: "Dangote Sugar (50kg)", totalStock: 200, reorderPoint: 60, costPrice: 80_000, sellingPrice: 81_500, categoryId: "cat_food" },
  { name: "Indomie (40pk)", totalStock: 200, reorderPoint: 60, costPrice: 2_000_000, sellingPrice: 2_550_000, categoryId: "cat_food" },
  { name: "Bournvita (900g)", totalStock: 200, reorderPoint: 60, costPrice: 70_000, sellingPrice: 75_000, categoryId: "cat_drinks" },
  { name: "Peak Milk Powder (400g)", totalStock: 200, reorderPoint: 60, costPrice: 80_000, sellingPrice: 82_000, categoryId: "cat_food" },
  { name: "Milo Energy Drink (500g)", totalStock: 200, reorderPoint: 60, costPrice: 60_000, sellingPrice: 62_000, categoryId: "cat_drinks" },
  { name: "Honeywell Flour (50kg)", totalStock: 200, reorderPoint: 60, costPrice: 60_000, sellingPrice: 61_000, categoryId: "cat_food" },
  { name: "Titus Sardine (50pk)", totalStock: 200, reorderPoint: 220, costPrice: 70_000, sellingPrice: 71_000, categoryId: "cat_food" },
  { name: "Devon King's Oil (5L)", totalStock: 200, reorderPoint: 220, costPrice: 65_000, sellingPrice: 70_000, categoryId: "cat_food" },
  { name: "Maggi Chicken Cubes (100pk)", totalStock: 200, reorderPoint: 220, costPrice: 2_000_000, sellingPrice: 2_100_000, categoryId: "cat_food" },
  { name: "Quaker Oats (1kg)", totalStock: 200, reorderPoint: 220, costPrice: 500_000, sellingPrice: 550_000, categoryId: "cat_food" },
  { name: "Lipton Yellow Label (100pk)", totalStock: 200, reorderPoint: 60, costPrice: 50_000, sellingPrice: 55_000, categoryId: "cat_drinks" },
];

/** Pads the list out to 125 entries. */
const FILLER_NAMES = [
  "Cowbell Milk (12pk)",
  "Nasco Cornflakes (500g)",
  "Power Oil (3L)",
  "Knorr Cubes (50pk)",
  "Eva Water (75cl)",
  "Gino Tomato Paste (70g)",
  "Semovita (10kg)",
  "Royal Stallion Rice (25kg)",
  "Hollandia Yoghurt (1L)",
  "Pure Bliss Biscuit (60pk)",
  "Close Up Toothpaste (140g)",
  "Omo Detergent (900g)",
  "Harpic Cleaner (500ml)",
  "Dettol Soap (6pk)",
  "Morning Fresh (750ml)",
  "Peak Evaporated Milk (24pk)",
  "Chivita Juice (1L)",
  "Golden Morn (900g)",
  "Nutri Milk (1L)",
  "Ariel Detergent (1kg)",
];

const BRANCH_IDS = ["br_ph", "br_lagos", "br_abuja", "br_kano"];

/**
 * A product exists once in the catalog and holds stock at each branch.
 * `inventoryService` resolves this to the branch-scoped `InventoryItem`.
 */
export interface InventoryRecord extends Omit<InventoryItem, "totalStock" | "branchId"> {
  stockByBranch: Record<string, number>;
}

function buildItem(index: number): InventoryRecord {
  const seed = SEED_ROWS[index];
  const categoryIds = MOCK_CATEGORIES.map((category) => category.id);

  const row: SeedRow = seed ?? {
    name: FILLER_NAMES[(index - SEED_ROWS.length) % FILLER_NAMES.length],
    totalStock: [0, 15, 48, 120, 260, 340, 75][index % 7],
    reorderPoint: [20, 20, 50, 50, 100, 100, 80][index % 7],
    costPrice: 15_000 + (index % 12) * 7_500,
    sellingPrice: 18_000 + (index % 12) * 8_200,
    categoryId: categoryIds[index % categoryIds.length],
  };

  const category = MOCK_CATEGORIES.find((entry) => entry.id === row.categoryId) ?? MOCK_CATEGORIES[0];
  const itemNumber = String(index + 1).padStart(3, "0");

  const stockByBranch: Record<string, number> = {};
  BRANCH_IDS.forEach((branchId, branchIndex) => {
    stockByBranch[branchId] =
      branchIndex === 0
        ? row.totalStock
        : Math.round(row.totalStock * [1, 0.6, 0.35, 0.15][branchIndex]);
  });

  return {
    id: `inv_${itemNumber}`,
    itemCode: `I-${itemNumber}`,
    productId: `prd_${itemNumber}`,
    name: row.name,
    categoryId: category.id,
    categoryName: category.name,
    stockByBranch,
    reorderPoint: row.reorderPoint,
    costPrice: row.costPrice,
    sellingPrice: row.sellingPrice,
    baseUnit: "Piece",
    archived: index >= 118,
    updatedAt: new Date(2026, 8, 1 + (index % 28), 9, 30).toISOString(),
  };
}

export const MOCK_INVENTORY_RECORDS: InventoryRecord[] = Array.from({ length: 125 }, (_, index) =>
  buildItem(index),
);
