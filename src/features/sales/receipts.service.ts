import type { ID, ISODateString, ListParams, Paginated } from "@/types/shared";
import { MOCK_CUSTOMERS, MOCK_SELLABLE_PRODUCTS } from "./mock-data";
import type { PaymentMethod } from "./types";

export interface ReceiptLine {
  description: string;
  quantity: number;
  amount: number;
}

export interface Receipt {
  id: ID;
  /** Display reference, e.g. "RCT-00028". */
  number: string;
  issuedAt: ISODateString;
  invoiceNumber: string;
  customerName: string;
  method: PaymentMethod;
  receivedBy: string;
  amount: number;
  /** Invoice total at the time of payment, used to show the remaining balance. */
  invoiceTotal: number;
  lines: ReceiptLine[];
  branchId: ID;
}

export interface ReceiptSummary {
  collected: number;
  collectedDelta: number;
  receiptCount: number;
  invoices: number;
}

export interface ReceiptListParams extends ListParams {
  branchId?: ID;
  method?: PaymentMethod | "all";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_BRANCH_ID = "br_ph";
const BRANCH_IDS = ["br_ph", "br_lagos", "br_abuja", "br_kano"];
const METHODS: PaymentMethod[] = ["cash", "transfer", "card"];
const CASHIERS = ["Amaka Obi", "Tunde Bello", "Grace Eze"];

function buildReceipt(index: number): Receipt {
  const product = MOCK_SELLABLE_PRODUCTS[index % MOCK_SELLABLE_PRODUCTS.length];
  const quantity = 1 + (index % 3);
  const amount = product.price * quantity;
  const customer = MOCK_CUSTOMERS[index % MOCK_CUSTOMERS.length];

  return {
    id: `rct_${index + 1}`,
    number: `RCT-${String(index + 1).padStart(5, "0")}`,
    issuedAt: new Date(2026, 8, 1 + (index % 28), 19, 11).toISOString(),
    invoiceNumber: `INV-2026-${String(index + 1).padStart(4, "0")}`,
    customerName: index % 4 === 0 ? "Walk-in customer" : customer.name,
    method: METHODS[index % METHODS.length],
    receivedBy: CASHIERS[index % CASHIERS.length],
    amount,
    invoiceTotal: amount,
    lines: [
      { description: `${quantity} × ${product.name}`, quantity, amount },
    ],
    branchId: index < 29 ? "br_ph" : BRANCH_IDS[index % BRANCH_IDS.length],
  };
}

const receipts: Receipt[] = Array.from({ length: 64 }, (_, index) => buildReceipt(index));

/**
 * Mock for the Receipts API: lets the UI run without a backend, simulating
 * network latency and the branch-scoping the real endpoints will do.
 */
export const receiptsService = {
  async listReceipts(params: ReceiptListParams = {}): Promise<Paginated<Receipt>> {
    await sleep(500);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 15;

    let filtered = receipts.filter((receipt) => {
      if (params.branchId && receipt.branchId !== params.branchId) return false;
      if (params.method && params.method !== "all" && receipt.method !== params.method) return false;
      if (params.search) {
        const needle = params.search.trim().toLowerCase();
        const haystack =
          `${receipt.number} ${receipt.invoiceNumber} ${receipt.customerName}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const { sortBy, sortDirection = "asc" } = params;
    if (sortBy) {
      const factor = sortDirection === "desc" ? -1 : 1;
      filtered = [...filtered].sort((a, b) => {
        const left = a[sortBy as keyof Receipt];
        const right = b[sortBy as keyof Receipt];
        if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
        return String(left).localeCompare(String(right)) * factor;
      });
    }

    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      total: filtered.length,
    };
  },

  /** Summary figures, scoped to the branch being viewed. */
  async getSummary(params: { branchId?: ID } = {}): Promise<ReceiptSummary> {
    await sleep(400);
    const branchId = params.branchId ?? DEFAULT_BRANCH_ID;
    const scoped = receipts.filter((receipt) => receipt.branchId === branchId);

    return {
      collected: scoped.reduce((sum, receipt) => sum + receipt.amount, 0),
      collectedDelta: 5.2,
      receiptCount: scoped.length,
      invoices: new Set(scoped.map((receipt) => receipt.invoiceNumber)).size,
    };
  },
};
