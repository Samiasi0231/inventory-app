import type { InvoiceRecord } from "../features/sales/types";

export const CUSTOMER_TYPES = ["Individual", "Business"] as const;
export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export interface Customer {
  id: string;
  code: string; // e.g. CUS-001
  name: string;
  type: CustomerType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  /** null = no credit limit */
  creditLimit: number | null;
  notes: string;
  branch: string;
  totalSales: number;
  outstanding: number;
  since: string; // ISO
  archived: boolean;
  sales: InvoiceRecord[];
}

/** What the add/edit form produces */
export interface CustomerInput {
  name: string;
  type: CustomerType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number | null;
  notes: string;
}

export type CustomerModalState =
  | { type: "edit"; customer: Customer }
  | { type: "archive"; customer: Customer }
  | null;