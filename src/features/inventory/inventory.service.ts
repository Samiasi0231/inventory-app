import type { Brand, Category, ID, Paginated, Supplier, TaxScheme, Unit } from "@/types/shared";
import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_INVENTORY_RECORDS,
  MOCK_SUPPLIERS,
  MOCK_TAX_SCHEMES,
  MOCK_UNITS,
  type InventoryRecord,
} from "./mock-data";
import {
  getStockStatus,
  type AdjustStockPayload,
  type CreateProductPayload,
  type InventoryItem,
  type InventoryListParams,
  type InventorySummary,
  type ReorderStockPayload,
  type TransferStockPayload,
} from "./types";

/**
 * Mock for the Inventory API: lets the UI run without a backend, simulating
 * network latency and the branch-scoping the real endpoints will do.
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_BRANCH_ID = "br_ph";

/** In-memory store so stock movements persist for the session. */
let records: InventoryRecord[] = MOCK_INVENTORY_RECORDS.map((record) => ({
  ...record,
  stockByBranch: { ...record.stockByBranch },
}));

/** Flattens a catalog record to the branch-scoped row the UI renders. */
function toItem(record: InventoryRecord, branchId: string): InventoryItem {
  const { stockByBranch, ...rest } = record;
  return { ...rest, branchId, totalStock: stockByBranch[branchId] ?? 0 };
}

function matchesFilters(item: InventoryItem, params: InventoryListParams) {
  if (item.archived !== Boolean(params.archived)) return false;
  if (params.categoryId && params.categoryId !== "all" && item.categoryId !== params.categoryId) {
    return false;
  }
  if (params.status && params.status !== "all" && getStockStatus(item) !== params.status) {
    return false;
  }
  if (params.search) {
    const needle = params.search.trim().toLowerCase();
    const haystack = `${item.name} ${item.itemCode} ${item.categoryName}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

function sortItems(list: InventoryItem[], params: InventoryListParams) {
  const { sortBy, sortDirection = "asc" } = params;
  if (!sortBy) return list;

  const factor = sortDirection === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    const left = a[sortBy as keyof InventoryItem];
    const right = b[sortBy as keyof InventoryItem];
    if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
    return String(left).localeCompare(String(right)) * factor;
  });
}

export const inventoryService = {
  async listItems(params: InventoryListParams = {}): Promise<Paginated<InventoryItem>> {
    await sleep(500);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 15;
    const branchId = params.branchId ?? DEFAULT_BRANCH_ID;

    const filtered = sortItems(
      records.map((record) => toItem(record, branchId)).filter((item) => matchesFilters(item, params)),
      params,
    );
    const start = (page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      total: filtered.length,
    };
  },

  async getItem(id: ID, branchId = DEFAULT_BRANCH_ID): Promise<InventoryItem | null> {
    await sleep(300);
    const record = records.find((entry) => entry.id === id);
    return record ? toItem(record, branchId) : null;
  },

  /** Summary figures, scoped to the branch being viewed. */
  async getSummary(params: { branchId?: ID } = {}): Promise<InventorySummary> {
    await sleep(400);

    const branchId = params.branchId ?? DEFAULT_BRANCH_ID;
    const scoped = records
      .filter((record) => !record.archived)
      .map((record) => toItem(record, branchId));

    const stockValue = scoped.reduce((sum, item) => sum + item.costPrice * item.totalStock, 0);
    const potentialSalesValue = scoped.reduce(
      (sum, item) => sum + item.sellingPrice * item.totalStock,
      0,
    );
    const itemsRequiringAttention = scoped.filter(
      (item) => getStockStatus(item) !== "in_stock",
    ).length;

    return {
      stockValue,
      stockValueDelta: 5.2,
      potentialSalesValue,
      potentialSalesValueDelta: 5.2,
      profitToBeMade: potentialSalesValue - stockValue,
      profitToBeMadeDelta: 6.2,
      itemsRequiringAttention,
      itemsRequiringAttentionDelta: -5.2,
    };
  },

  async transferStock(payload: TransferStockPayload): Promise<{ reference: string }> {
    await sleep(800);

    records = records.map((record) => {
      const line = payload.lines.find((entry) => entry.productId === record.productId);
      if (!line) return record;

      const from = record.stockByBranch[payload.fromBranchId] ?? 0;
      const to = record.stockByBranch[payload.toBranchId] ?? 0;

      return {
        ...record,
        stockByBranch: {
          ...record.stockByBranch,
          [payload.fromBranchId]: Math.max(0, from - line.quantity),
          [payload.toBranchId]: to + line.quantity,
        },
      };
    });

    return { reference: `TRF-${Date.now().toString().slice(-6)}` };
  },

  async adjustStock(payload: AdjustStockPayload): Promise<{ reference: string }> {
    await sleep(800);

    records = records.map((record) => {
      if (record.productId !== payload.productId) return record;
      const current = record.stockByBranch[payload.branchId] ?? 0;
      const delta = payload.direction === "increase" ? payload.quantity : -payload.quantity;

      return {
        ...record,
        stockByBranch: {
          ...record.stockByBranch,
          [payload.branchId]: Math.max(0, current + delta),
        },
      };
    });

    return { reference: `ADJ-${Date.now().toString().slice(-6)}` };
  },

  /** Records the reorder intent; it does not create the purchase order. */
  async reorderStock(_payload: ReorderStockPayload): Promise<{ reference: string }> {
    await sleep(800);
    return { reference: `PO-${Date.now().toString().slice(-6)}` };
  },

  async archiveItem(id: ID): Promise<void> {
    await sleep(600);
    records = records.map((record) =>
      record.id === id ? { ...record, archived: true } : record,
    );
  },

  async restoreItem(id: ID): Promise<void> {
    await sleep(600);
    records = records.map((record) =>
      record.id === id ? { ...record, archived: false } : record,
    );
  },

  async createProduct(payload: CreateProductPayload): Promise<{ id: ID }> {
    await sleep(1000);

    const index = records.length;
    const itemNumber = String(index + 1).padStart(3, "0");
    const category = MOCK_CATEGORIES.find((entry) => entry.id === payload.categoryId);

    const created: InventoryRecord = {
      id: `inv_${itemNumber}`,
      itemCode: `I-${itemNumber}`,
      productId: `prd_${itemNumber}`,
      name: payload.name,
      categoryId: payload.categoryId,
      categoryName: category?.name ?? "Uncategorised",
      stockByBranch: { [payload.branchId]: payload.openingStock },
      reorderPoint: payload.reorderPoint,
      costPrice: payload.defaultCostPrice,
      sellingPrice: payload.defaultSellingPrice,
      baseUnit: payload.baseUnit,
      archived: false,
      updatedAt: new Date().toISOString(),
    };

    records = [created, ...records];
    return { id: created.id };
  },
};

/** Reference data the Inventory screens read but do not own. */
export const referenceService = {
  async getCategories(): Promise<Category[]> {
    await sleep(200);
    return MOCK_CATEGORIES;
  },
  async getBrands(): Promise<Brand[]> {
    await sleep(200);
    return MOCK_BRANDS;
  },
  async getUnits(): Promise<Unit[]> {
    await sleep(200);
    return MOCK_UNITS;
  },
  async getTaxSchemes(): Promise<TaxScheme[]> {
    await sleep(200);
    return MOCK_TAX_SCHEMES;
  },
  async getSuppliers(): Promise<Supplier[]> {
    await sleep(200);
    return MOCK_SUPPLIERS;
  },
};
