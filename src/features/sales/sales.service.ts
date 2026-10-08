import type { ID, Paginated } from "@/types/shared";
import {
  MOCK_CUSTOMERS,
  MOCK_INVOICES,
  MOCK_SELLABLE_PRODUCTS,
} from "./mock-data";
import {
  calculateCartTotals,
  getBalanceDue,
  getInvoiceStatus,
  type CreateSalePayload,
  type CreateSaleResult,
  type Customer,
  type Invoice,
  type InvoiceListParams,
  type InvoiceSummary,
  type SellableProduct,
} from "./types";

/**
 * Mock for the Sales API: lets the UI run without a backend, simulating network
 * latency and the branch-scoping the real endpoints will do.
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_BRANCH_ID = "br_ph";

type InvoiceRecord = Invoice & { cancelled: boolean };

/** In-memory store so new sales and payments persist for the session. */
let invoices: InvoiceRecord[] = MOCK_INVOICES.map((invoice) => ({ ...invoice }));
let customers: Customer[] = [...MOCK_CUSTOMERS];
let nextInvoiceSequence = invoices.length + 1;

function matchesFilters(invoice: InvoiceRecord, params: InvoiceListParams) {
  if (params.branchId && invoice.branchId !== params.branchId) return false;

  if (params.status && params.status !== "all") {
    if (getInvoiceStatus(invoice) !== params.status) return false;
  }

  if (params.partyType && params.partyType !== "all" && invoice.partyType !== params.partyType) {
    return false;
  }

  if (params.issuedFrom && new Date(invoice.issueDate) < new Date(params.issuedFrom)) return false;
  if (params.dueBefore && new Date(invoice.dueDate) > new Date(params.dueBefore)) return false;

  if (params.search) {
    const needle = params.search.trim().toLowerCase();
    const haystack = `${invoice.number} ${invoice.customerName}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  return true;
}

function sortInvoices(list: InvoiceRecord[], params: InvoiceListParams) {
  const { sortBy, sortDirection = "asc" } = params;
  if (!sortBy) return list;

  const factor = sortDirection === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    if (sortBy === "balanceDue") return (getBalanceDue(a) - getBalanceDue(b)) * factor;

    const left = a[sortBy as keyof InvoiceRecord];
    const right = b[sortBy as keyof InvoiceRecord];
    if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
    return String(left).localeCompare(String(right)) * factor;
  });
}

export const salesService = {
  async listInvoices(params: InvoiceListParams = {}): Promise<Paginated<Invoice>> {
    await sleep(500);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 15;

    const filtered = sortInvoices(
      invoices.filter((invoice) => matchesFilters(invoice, params)),
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

  async getInvoice(id: ID): Promise<Invoice | null> {
    await sleep(300);
    return invoices.find((invoice) => invoice.id === id) ?? null;
  },

  /** Summary figures, scoped to the branch being viewed. */
  async getInvoiceSummary(params: { branchId?: ID } = {}): Promise<InvoiceSummary> {
    await sleep(400);

    const branchId = params.branchId ?? DEFAULT_BRANCH_ID;
    const scoped = invoices.filter(
      (invoice) => invoice.branchId === branchId && !invoice.cancelled,
    );
    const now = Date.now();

    const overdue = scoped.filter(
      (invoice) => getBalanceDue(invoice) > 0 && new Date(invoice.dueDate).getTime() < now,
    );

    return {
      invoiced: scoped.reduce((sum, invoice) => sum + invoice.total, 0),
      invoicedDelta: 4.8,
      invoicedCount: scoped.length,
      paid: scoped.reduce((sum, invoice) => sum + invoice.amountPaid, 0),
      paidDelta: 6.1,
      outstanding: scoped.reduce((sum, invoice) => sum + getBalanceDue(invoice), 0),
      outstandingDelta: -3.4,
      overdue: overdue.reduce((sum, invoice) => sum + getBalanceDue(invoice), 0),
      overdueDelta: -5.2,
      overdueCount: overdue.length,
    };
  },

  async sendPaymentReminder(_id: ID): Promise<void> {
    await sleep(600);
  },

  async recordPayment(id: ID, amount: number): Promise<void> {
    await sleep(700);
    invoices = invoices.map((invoice) =>
      invoice.id === id
        ? { ...invoice, amountPaid: Math.min(invoice.total, invoice.amountPaid + amount) }
        : invoice,
    );
  },

  /**
   * Invoices are locked once confirmed, so corrections archive the original and
   * a fresh invoice is issued in its place.
   */
  async archiveInvoice(id: ID): Promise<void> {
    await sleep(700);
    invoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, cancelled: true } : invoice,
    );
  },

  async listSellableProducts(_params: { branchId?: ID } = {}): Promise<SellableProduct[]> {
    await sleep(400);
    return MOCK_SELLABLE_PRODUCTS;
  },

  async listCustomers(): Promise<Customer[]> {
    await sleep(250);
    return customers;
  },

  async createCustomer(name: string, phone?: string): Promise<Customer> {
    await sleep(500);
    const created: Customer = { id: `cus_${Date.now()}`, name, phone };
    customers = [created, ...customers];
    return created;
  },

  /** Confirms a sale: the invoice and receipt are created together. */
  async createSale(payload: CreateSalePayload): Promise<CreateSaleResult> {
    await sleep(900);

    const { subtotal, vat, total } = calculateCartTotals(
      payload.lines,
      payload.discountMode,
      payload.discountValue,
    );
    const amountPaid = payload.payments.reduce((sum, payment) => sum + payment.amount, 0);

    const sequence = nextInvoiceSequence++;
    const number = `INV-2026-${String(sequence).padStart(4, "0")}`;
    const customer = customers.find((entry) => entry.id === payload.customerId);
    const issued = new Date();
    const due = new Date(issued);
    due.setDate(due.getDate() + 14);

    const created: InvoiceRecord = {
      id: `inv_${sequence}`,
      number,
      customerId: customer?.id ?? "cus_walk_in",
      customerName: customer?.name ?? "Walk-in customer",
      partyType: "customer",
      issueDate: issued.toISOString(),
      dueDate: due.toISOString(),
      lines: payload.lines.map((line) => ({
        productId: line.productId,
        name: line.name,
        sku: line.sku,
        quantity: line.quantity,
        unit: line.unit,
        unitPrice: line.unitPrice,
        amount: line.unitPrice * line.quantity,
      })),
      subtotal,
      vat,
      total,
      amountPaid: Math.min(total, amountPaid),
      branchId: payload.branchId,
      cancelled: false,
    };

    invoices = [created, ...invoices];

    return {
      invoiceId: created.id,
      invoiceNumber: number,
      receiptNumber: `RCP-2026-${String(sequence).padStart(4, "0")}`,
      total,
    };
  },
};
