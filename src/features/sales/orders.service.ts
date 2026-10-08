import type { ID, Paginated } from "@/types/shared";
import { MOCK_CUSTOMERS } from "./mock-data";
import {
  getOrderBalance,
  type OrderStatus,
  type SalesOrder,
  type SalesOrderListParams,
  type SalesOrderSummary,
} from "./order-types";

/**
 * Mock for the Sales Orders API: lets the UI run without a backend, simulating
 * network latency and the branch-scoping the real endpoints will do.
 */

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

function buildOrder(index: number): SalesOrder {
  const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
  const total = AMOUNTS[index % AMOUNTS.length];
  const customer = MOCK_CUSTOMERS[index % MOCK_CUSTOMERS.length];

  // Paid in full unless the stage implies money is still owed.
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
    branchId: index < 29 ? "br_ph" : BRANCH_IDS[index % BRANCH_IDS.length],
  };
}

let orders: SalesOrder[] = Array.from({ length: 96 }, (_, index) => buildOrder(index));

function matchesFilters(order: SalesOrder, params: SalesOrderListParams) {
  if (params.branchId && order.branchId !== params.branchId) return false;
  if (params.status && params.status !== "all" && order.status !== params.status) return false;
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

  /** Summary figures, scoped to the branch being viewed. */
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
      // Margin is not modelled yet, so approximate it as a share of revenue.
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
      order.id === id ? { ...order, status: "fulfilled" as OrderStatus } : order,
    );
  },
};
