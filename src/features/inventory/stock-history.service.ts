import type { ID, ISODateString, ListParams, Paginated } from "@/types/shared";
import { MOCK_INVENTORY_RECORDS } from "./mock-data";

export type StockMovementType = "purchase" | "sale" | "refund" | "adjustment";

export const STOCK_MOVEMENT_LABELS: Record<StockMovementType, string> = {
  purchase: "Purchase",
  sale: "Sale",
  refund: "Refund",
  adjustment: "Adjustment",
};

export interface StockMovement {
  id: ID;
  /** Source document, e.g. "PO-132" or "S-101". */
  reference: string;
  occurredAt: ISODateString;
  itemName: string;
  type: StockMovementType;
  /** Signed change in stock: negative when stock leaves. */
  quantity: number;
  staff: string;
  notes: string;
  branchId: ID;
}

export interface StockMovementListParams extends ListParams {
  branchId?: ID;
  type?: StockMovementType | "all";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BRANCH_IDS = ["br_ph", "br_lagos", "br_abuja", "br_kano"];
const STAFF = ["Admin", "Sales", "Inventory Manager", "Branch Manager"];
const TYPES: StockMovementType[] = [
  "purchase",
  "sale",
  "refund",
  "adjustment",
  "refund",
  "sale",
];

const NOTES: Record<StockMovementType, string[]> = {
  purchase: ["", "Restock from supplier"],
  sale: ["", ""],
  refund: ["", "Refunded 5 units of peak milk powder", ""],
  adjustment: [
    "5 tins of milk expired",
    "Damaged during offloading",
    "Stock count correction",
  ],
};

function buildMovement(index: number): StockMovement {
  const type = TYPES[index % TYPES.length];
  const item =
    MOCK_INVENTORY_RECORDS[(index * 3) % MOCK_INVENTORY_RECORDS.length];
  const magnitude = [200, 150, 50, 50, 25, 10][index % 6];
  const quantity =
    type === "sale" || type === "adjustment" ? -magnitude : magnitude;

  const prefix = type === "purchase" ? "PO" : type === "sale" ? "S" : "Ref";
  const number =
    type === "purchase"
      ? 132 - (index % 40)
      : type === "sale"
        ? 101 - (index % 40)
        : 200 - (index % 40);

  // Newest first: each movement is a little older than the one before it.
  const when = new Date();
  when.setHours(10, 42, 0, 0);
  when.setHours(when.getHours() - index * 5);

  const notes = NOTES[type];

  return {
    id: `mov_${index + 1}`,
    reference: `${prefix}-${number}`,
    occurredAt: when.toISOString(),
    itemName: item.name,
    type,
    quantity,
    staff:
      type === "sale"
        ? "Sales"
        : type === "purchase"
          ? "Admin"
          : STAFF[(index % 2) + 2],
    notes: notes[index % notes.length],
    branchId: index < 40 ? "br_ph" : BRANCH_IDS[index % BRANCH_IDS.length],
  };
}

const movements: StockMovement[] = Array.from({ length: 90 }, (_, index) =>
  buildMovement(index),
);

/**
 * Mock for the stock history API: lets the UI run without a backend, simulating
 * network latency and the branch-scoping the real endpoint will do.
 */
export const stockHistoryService = {
  async listMovements(
    params: StockMovementListParams = {},
  ): Promise<Paginated<StockMovement>> {
    await sleep(500);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 15;

    const filtered = movements.filter((movement) => {
      if (params.branchId && movement.branchId !== params.branchId)
        return false;
      if (params.type && params.type !== "all" && movement.type !== params.type)
        return false;
      if (params.search) {
        const needle = params.search.trim().toLowerCase();
        const haystack =
          `${movement.reference} ${movement.itemName} ${movement.staff}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      total: filtered.length,
    };
  },
};
