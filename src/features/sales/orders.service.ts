import type { ID, Paginated } from "@/types/shared";
import { MOCK_CUSTOMERS } from "./mock-data";
import {
  getOrderBalance,
  getOrderPaymentStatus,
  type OrderPayment,
  type OrderReturn,
  type OrderStatus,
  type SalesOrder,
  type SalesOrderLine,
  type SalesOrderListParams,
  type SalesOrderSummary,
} from "./order-types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_BRANCH_ID = "br_ph";
const BRANCH_IDS = ["br_ph", "br_lagos", "br_abuja", "br_kano"];

const STATUS_CYCLE: OrderStatus[] = [
  "pending",
  "fulfilled",
  "completed",
  "confirmed",
  "partially_received",
  "cancelled",
  "completed",
  "confirmed",
];

const AMOUNTS = [55_000, 70_000, 10_000, 80_000, 2_000_000, 60_000, 61_000, 65_000, 500_000, 50_000];

const LINE_CATALOG = [
  { productName: "Chocolate", variant: "Large / Milk", unit: "Carton", batchNumber: "CH-LG-004" },
  { productName: "Coca-Cola", variant: "Original", unit: "Carton" },
  { productName: "Peak Milk Powder", variant: "900g", unit: "Carton", batchNumber: "PM-900-011" },
  { productName: "Tin Tomato", variant: "400g", unit: "Carton" },
];

function buildLines(index: number, total: number, status: OrderStatus): SalesOrderLine[] {
  const first = LINE_CATALOG[index % LINE_CATALOG.length];
  const second = LINE_CATALOG[(index + 1) % LINE_CATALOG.length];

  const firstQty = 4;
  const secondQty = 10;
  const firstShare = Math.round((total * 0.7) / firstQty);
  const secondShare = (total - firstShare * firstQty) / secondQty;

  const fullySent = status === "fulfilled" || status === "completed";
  const partly = status === "partially_received";

  return [
    {
      productId: `prd_${index}_1`,
      ...first,
      quantity: firstQty,
      sent: fullySent ? firstQty : partly ? Math.floor(firstQty / 2) : 0,
      unitCost: firstShare,
      expiryDate: new Date(2027, 5, 30).toISOString(),
    },
    {
      productId: `prd_${index}_2`,
      ...second,
      quantity: secondQty,
      sent: fullySent ? secondQty : 0,
      unitCost: secondShare,
    },
  ];
}

function buildOrder(index: number): SalesOrder {
  const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
  const total = AMOUNTS[index % AMOUNTS.length];
  const customer = MOCK_CUSTOMERS[index % MOCK_CUSTOMERS.length];

  const amountPaid =
    status === "pending" || status === "cancelled"
      ? 0
      : status === "partially_received"
        ? Math.round(total / 2)
        : total;

  const ordered = new Date(2026, 8, 1 + (index % 28));
  const due = new Date(ordered);
  due.setDate(due.getDate() + 60);

  return {
    id: `so_${index + 1}`,
    orderId: `SO-2026-${String(index + 1).padStart(4, "0")}`,
    customerId: customer.id,
    customerName: customer.name,
    orderDate: ordered.toISOString(),
    dueDate: due.toISOString(),
    total,
    amountPaid,
    status,
    branchId: index < 29 ? "br_ph" : BRANCH_IDS[1 + index % 3],
    deliveryMethod: "GIG delivery", deliveryCost: 0, discount: 0, vat: 0,
    invoiceNumber: status === "completed" || status === "fulfilled" ? `INV-2026-${String(index + 1).padStart(4, "0")}` : undefined,
    payments: amountPaid > 0 ? [{ id: `PAY-${String(index * 2 + 1).padStart(3, "0")}`, date: "2026-09-21T10:42:00Z", method: "Bank Transfer", reference: `TRF-123456789${index}`, amount: Math.round(amountPaid * 0.6), receivedBy: "Sales Staff" }, { id: `PAY-${String(index * 2 + 2).padStart(3, "0")}`, date: "2026-09-30T10:42:00Z", method: "Bank Transfer", reference: `TRF-123456790${index}`, amount: amountPaid - Math.round(amountPaid * 0.6), receivedBy: "Sales Staff" }] : [],
    returns: status === "completed" || status === "fulfilled" ? [
      { id: `RET-${String(index * 3 + 1).padStart(3, "0")}`, date: "2026-09-22T10:42:00Z", items: 2, reason: "Damaged Goods", amount: Math.round(total * 0.1), status: "Completed", recordedBy: "Sales Staff" },
      { id: `RET-${String(index * 3 + 2).padStart(3, "0")}`, date: "2026-09-24T10:42:00Z", items: 1, reason: "Expired Products", amount: Math.round(total * 0.05), status: "Approved", recordedBy: "Sales Staff" },
      { id: `RET-${String(index * 3 + 3).padStart(3, "0")}`, date: "2026-09-25T10:42:00Z", items: 1, reason: "Expired Products", amount: Math.round(total * 0.05), status: "Rejected", recordedBy: "Sales Staff" },
    ] : [],
    lines: buildLines(index, total, status),
    sourcePurchaseId: index % 3 === 0 ? `PO-${String(124 - (index % 12)).padStart(5, "0")}` : undefined,
  };
}

let orders: SalesOrder[] = Array.from({ length: 96 }, (_, index) => buildOrder(index));
let nextPayment = 193;
let nextReturn = 289;

function matchesFilters(order: SalesOrder, params: SalesOrderListParams) {
  if (params.branchId && order.branchId !== params.branchId) return false;
  if (params.status && params.status !== "all" && order.status !== params.status) return false;
  if (params.payment && params.payment !== "all" && getOrderPaymentStatus(order) !== params.payment) return false;
  if (params.search) {
    const needle = params.search.trim().toLowerCase();
    if (!`${order.orderId} ${order.customerName}`.toLowerCase().includes(needle)) return false;
  }
  return true;
}

function sortOrders(list: SalesOrder[], params: SalesOrderListParams) {
  const { sortBy, sortDirection = "asc" } = params;
  if (!sortBy) return list;

  const factor = sortDirection === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    if (sortBy === "balance") return (getOrderBalance(a) - getOrderBalance(b)) * factor;
    const left = a[sortBy as keyof SalesOrder];
    const right = b[sortBy as keyof SalesOrder];
    if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
    return String(left).localeCompare(String(right)) * factor;
  });
}

export const ordersService = {
  async acceptOrder(id: ID): Promise<void> {
    await sleep(400);
    orders = orders.map(order => order.id === id && order.status === "pending" ? { ...order, status: "confirmed" } : order);
  },
  async proposeChanges(id: ID, proposal: string, proposedPrice?: number): Promise<void> {
    await sleep(400);
    if (proposal.length > 500) throw new Error("Keep the note within 500 characters.");
    if (proposedPrice !== undefined && (!Number.isFinite(proposedPrice) || proposedPrice <= 0)) throw new Error("Enter a new price greater than zero.");
    if (proposedPrice === undefined && !proposal.trim()) throw new Error("Describe the proposed changes.");
    if (!orders.some(order => order.id === id)) throw new Error("Order not found.");
    orders = orders.map(order => order.id === id ? { ...order, proposal, proposedPrice } : order);
  },
  async rejectOrder(id: ID, note: string): Promise<void> {
    await sleep(400);
    if (note.length > 500) throw new Error("Keep the note within 500 characters.");
    if (!orders.some(order => order.id === id)) throw new Error("Order not found.");
    orders = orders.map(order => order.id === id ? { ...order, status: "cancelled", rejectionNote: note } : order);
  },
  async createInvoice(id: ID): Promise<void> {
    await sleep(400);
    orders = orders.map(order => order.id === id ? { ...order, invoiceNumber: order.invoiceNumber ?? `INV-${order.orderId}` } : order);
  },
  async recordPayment(id: ID, payment: Omit<OrderPayment, "id">): Promise<void> {
    await sleep(400);
    const order = orders.find(order => order.id === id);
    if (!order || !Number.isFinite(payment.amount) || payment.amount <= 0 || payment.amount > getOrderBalance(order)) throw new Error("Enter an amount within the outstanding balance.");
    orders = orders.map(order => order.id === id ? { ...order, amountPaid: order.amountPaid + payment.amount, payments: [...(order.payments ?? []), { ...payment, id: `PAY-${String(nextPayment++).padStart(3, "0")}` }] } : order);
  },
  async createReturn(id: ID, entry: Omit<OrderReturn, "id" | "status">): Promise<void> {
    await sleep(400);
    const order = orders.find(order => order.id === id);
    const eligible = order?.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0;
    const returned = order?.returns?.filter(row => row.status !== "Rejected").reduce((sum, row) => sum + row.items, 0) ?? 0;
    if (!order || !Number.isInteger(entry.items) || entry.items < 1 || entry.items > eligible - returned || !Number.isFinite(entry.amount) || entry.amount < 0 || entry.amount > order.total) throw new Error("Check the return quantity and amount.");
    orders = orders.map(order => order.id === id ? { ...order, returns: [...(order.returns ?? []), { ...entry, id: `RET-${String(nextReturn++).padStart(3, "0")}`, status: "Approved" }] } : order);
  },

  async listOrders(params: SalesOrderListParams = {}): Promise<Paginated<SalesOrder>> {
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

  async getOrder(id: ID): Promise<SalesOrder | null> {
    await sleep(300);
    return orders.find((order) => order.id === id) ?? null;
  },

  async getSummary(params: { branchId?: ID } = {}): Promise<SalesOrderSummary> {
    await sleep(400);

    const branchId = params.branchId ?? DEFAULT_BRANCH_ID;
    const scoped = orders.filter(
      (order) => order.branchId === branchId && order.status !== "cancelled",
    );

    const totalSales = scoped.reduce((sum, order) => sum + order.total, 0);
    const collected = scoped.reduce((sum, order) => sum + order.amountPaid, 0);

    return {
      totalSales,
      totalSalesDelta: 5.2,
      invoiceCount: scoped.length,
      collected,
      collectedDelta: 5.2,
      outstanding: scoped.reduce((sum, order) => sum + getOrderBalance(order), 0),
      outstandingDelta: -2.1,
      grossProfit: Math.round(totalSales * 0.29),
      grossProfitDelta: 6.2,
      invoices: scoped.filter((order) => order.amountPaid > 0).length,
    };
  },

  async cancelOrder(id: ID): Promise<void> {
    await sleep(700);
    orders = orders.map((order) =>
      order.id === id ? { ...order, status: "cancelled" as OrderStatus } : order,
    );
  },

  async markGoodsSent(id: ID): Promise<void> {
    await sleep(700);
    orders = orders.map((order) =>
      order.id === id ? { ...order, status: "fulfilled" as OrderStatus, lines: order.lines.map(line => ({ ...line, sent: line.quantity })) } : order,
    );
  },
};
