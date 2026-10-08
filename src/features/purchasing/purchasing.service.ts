import type { ID, ISODateString, Paginated } from "@/types/shared";
import { MOCK_SUPPLIERS } from "@/features/inventory/mock-data";
import {
  getPurchaseBalance,
  type PurchaseListParams,
  type PurchaseOrder,
  type PurchaseOrderLine,
  type PurchaseOrderStatus,
  type PurchaseSummary,
} from "./types";

/**
 * Mock for the Purchasing API: lets the UI run without a backend, simulating
 * network latency and the branch-scoping the real endpoints will do.
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_BRANCH_ID = "br_ph";
const BRANCH_IDS = ["br_ph", "br_lagos", "br_abuja", "br_kano"];

const STATUS_CYCLE: PurchaseOrderStatus[] = [
  "pending_approval",
  "received",
  "completed",
  "received",
  "partially_received",
  "completed",
  "completed",
  "cancelled",
];

const AMOUNTS = [55_000, 70_000, 10_000, 70_000, 80_000, 2_000_000, 70_000, 80_000, 60_000, 500_000];

const VARIANTS = [
  "Small / Milk",
  "Small / Dark",
  "Medium / Milk",
  "Medium / Dark",
  "Large / Milk",
  "Large / Dark",
];

function buildLines(index: number, received: boolean): PurchaseOrderLine[] {
  return VARIANTS.map((variant, position) => {
    const ordered = [20, 15, 30, 25, 10, 8][position];
    return {
      productId: `prd_choc_${position}`,
      productName: "Chocolate",
      variant,
      ordered,
      received: received ? ordered : 0,
      unit: "Piece",
      batchNumber: `CHC-B-${String(position + 1).padStart(3, "0")}`,
      expiryDate: new Date(2027, position * 2, 12).toISOString(),
      unitCost: 4_000 + position * 250 + (index % 3) * 100,
    };
  });
}

function buildOrder(index: number): PurchaseOrder {
  const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
  const totalAmount = AMOUNTS[index % AMOUNTS.length];
  const supplier = MOCK_SUPPLIERS[index % MOCK_SUPPLIERS.length];
  const items = 20;

  const fulfilled =
    status === "pending_approval" || status === "cancelled"
      ? status === "pending_approval"
        ? 10
        : 0
      : status === "partially_received"
        ? 12
        : items;

  const amountPaid =
    status === "cancelled"
      ? 0
      : status === "pending_approval"
        ? 0
        : status === "partially_received"
          ? Math.round(totalAmount / 2)
          : totalAmount;

  return {
    id: `po_${index + 1}`,
    purchaseId: `P-${String(index + 1).padStart(3, "0")}`,
    supplierId: supplier.id,
    supplierName: supplier.name,
    items,
    totalAmount,
    amountPaid,
    date: new Date(2026, 9, 4).toISOString(),
    fulfilled,
    status,
    branchId: index < 40 ? "br_ph" : BRANCH_IDS[index % BRANCH_IDS.length],
    lines: buildLines(index, status !== "pending_approval" && status !== "cancelled"),
  };
}

let orders: PurchaseOrder[] = Array.from({ length: 125 }, (_, index) => buildOrder(index));
let nextSequence = orders.length + 1;

function matchesFilters(order: PurchaseOrder, params: PurchaseListParams) {
  if (params.branchId && order.branchId !== params.branchId) return false;
  if (params.status && params.status !== "all" && order.status !== params.status) return false;
  if (params.search) {
    const needle = params.search.trim().toLowerCase();
    if (!`${order.purchaseId} ${order.supplierName}`.toLowerCase().includes(needle)) return false;
  }
  return true;
}

function sortOrders(list: PurchaseOrder[], params: PurchaseListParams) {
  const { sortBy, sortDirection = "asc" } = params;
  if (!sortBy) return list;

  const factor = sortDirection === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    const left = a[sortBy as keyof PurchaseOrder];
    const right = b[sortBy as keyof PurchaseOrder];
    if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
    return String(left).localeCompare(String(right)) * factor;
  });
}

export interface ReceiveLinePayload {
  productId: ID;
  variant: string;
  received: number;
  batchNumber: string;
  expiryDate?: string;
}

export interface ReturnLinePayload {
  productId: ID;
  variant: string;
  returnQty: number;
  batchNumber: string;
  reason: string;
}

export interface CreatePurchaseOrderPayload {
  orderDate: string;
  createdBy: string;
  branchId: ID;
  supplierId: ID;
  supplierReference?: string;
  expectedDelivery: string;
  deliveryMethod: string;
  notes?: string;
  lines: { productName: string; variant: string; quantity: number; unit: string; unitCost: number }[];
}

export const purchasingService = {
  async listOrders(params: PurchaseListParams = {}): Promise<Paginated<PurchaseOrder>> {
    await sleep(500);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 15;
    const filtered = sortOrders(orders.filter((order) => matchesFilters(order, params)), params);
    const start = (page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      total: filtered.length,
    };
  },

  async getOrder(id: ID): Promise<PurchaseOrder | null> {
    await sleep(300);
    return orders.find((order) => order.id === id) ?? null;
  },

  /** Summary figures, scoped to the branch being viewed. */
  async getSummary(params: { branchId?: ID } = {}): Promise<PurchaseSummary> {
    await sleep(400);

    const branchId = params.branchId ?? DEFAULT_BRANCH_ID;
    const scoped = orders.filter((order) => order.branchId === branchId);
    const active = scoped.filter((order) => order.status !== "cancelled");

    return {
      totalOrders: active.reduce((sum, order) => sum + order.totalAmount, 0),
      totalOrdersDelta: 4.2,
      pendingOrders: scoped.filter((order) => order.status === "pending_approval").length,
      pendingOrdersDelta: 4.2,
      completedOrders: scoped.filter((order) => order.status === "completed").length,
      completedOrdersDelta: 4.2,
      outstandingPayments: active.reduce((sum, order) => sum + getPurchaseBalance(order), 0),
      outstandingPaymentsDelta: -5.2,
    };
  },

  async recordPayment(id: ID, amount: number): Promise<void> {
    await sleep(700);
    orders = orders.map((order) =>
      order.id === id
        ? { ...order, amountPaid: Math.min(order.totalAmount, order.amountPaid + amount) }
        : order,
    );
  },

  async receiveGoods(id: ID, lines: ReceiveLinePayload[]): Promise<void> {
    await sleep(800);

    orders = orders.map((order) => {
      if (order.id !== id) return order;

      const nextLines = order.lines.map((line) => {
        const update = lines.find(
          (entry) => entry.productId === line.productId && entry.variant === line.variant,
        );
        if (!update) return line;
        return {
          ...line,
          received: Math.min(line.ordered, line.received + update.received),
          batchNumber: update.batchNumber || line.batchNumber,
          expiryDate: update.expiryDate ? new Date(update.expiryDate).toISOString() : line.expiryDate,
        };
      });

      const ordered = nextLines.reduce((sum, line) => sum + line.ordered, 0);
      const received = nextLines.reduce((sum, line) => sum + line.received, 0);

      return {
        ...order,
        lines: nextLines,
        fulfilled: Math.round((received / ordered) * order.items),
        status: received >= ordered ? "received" : "partially_received",
      };
    });
  },

  async returnProducts(_id: ID, _lines: ReturnLinePayload[]): Promise<{ reference: string }> {
    await sleep(800);
    return { reference: `RET-${Date.now().toString().slice(-6)}` };
  },

  async recordSupplierInvoice(_id: ID, _payload: Record<string, unknown>): Promise<{ reference: string }> {
    await sleep(800);
    return { reference: `SINV-${Date.now().toString().slice(-6)}` };
  },

  async cancelOrder(id: ID): Promise<void> {
    await sleep(700);
    orders = orders.map((order) =>
      order.id === id ? { ...order, status: "cancelled" as PurchaseOrderStatus } : order,
    );
  },

  async createOrder(payload: CreatePurchaseOrderPayload): Promise<{ id: ID; purchaseId: string }> {
    await sleep(900);

    const sequence = nextSequence++;
    const supplier = MOCK_SUPPLIERS.find((entry) => entry.id === payload.supplierId);
    const totalAmount = payload.lines.reduce(
      (sum, line) => sum + line.quantity * line.unitCost,
      0,
    );
    const items = payload.lines.reduce((sum, line) => sum + line.quantity, 0);
    const date: ISODateString = new Date(payload.orderDate).toISOString();

    const created: PurchaseOrder = {
      id: `po_${sequence}`,
      purchaseId: `P-${String(sequence).padStart(3, "0")}`,
      supplierId: payload.supplierId,
      supplierName: supplier?.name ?? "Unknown supplier",
      items,
      totalAmount,
      amountPaid: 0,
      date,
      fulfilled: 0,
      status: "pending_approval",
      branchId: payload.branchId,
      lines: payload.lines.map((line, position) => ({
        productId: `prd_new_${position}`,
        productName: line.productName,
        variant: line.variant,
        ordered: line.quantity,
        received: 0,
        unit: line.unit,
        batchNumber: "",
        unitCost: line.unitCost,
      })),
    };

    orders = [created, ...orders];
    return { id: created.id, purchaseId: created.purchaseId };
  },
};
