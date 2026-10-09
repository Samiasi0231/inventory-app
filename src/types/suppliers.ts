import type { InvoiceRecord } from "../features/sales/types";

// The designs don't show the dropdown options — adjust to your real supplier categories.
export const SUPPLIER_TYPES = ["Individual", "Business"] as const;
export type SupplierType = (typeof SUPPLIER_TYPES)[number];

export interface Supplier {
  id: string;
  code: string; // e.g. SUP-001
  name: string;
  type: SupplierType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  branch: string;
  totalPurchases: number;
  outstanding: number;
  since: string; // ISO
  archived: boolean;
  purchases: InvoiceRecord[];
}

/** What the add/edit form produces */
export interface SupplierInput {
  name: string;
  type: SupplierType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export type SupplierModalState =
  | { type: "edit"; supplier: Supplier }
  | { type: "archive"; supplier: Supplier }
  | null;