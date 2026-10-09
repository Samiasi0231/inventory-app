import type { Customer } from "@/types/customer";
import type { InvoiceRecord } from "../features/sales/types";

const sales = (code: string): InvoiceRecord[] => [
  { id: `${code}-s1`, date: "2026-10-04", invoiceNo: "INV-2026-0032", amount: 55000, status: "completed" },
  { id: `${code}-s2`, date: "2026-10-04", invoiceNo: "INV-2026-0031", amount: 55000, status: "completed" },
];

const make = (
  n: number,
  name: string,
  email: string,
  totalSales: number,
  outstanding: number,
  extra: Partial<Customer> = {}
): Customer => {
  const code = `CUS-${String(n).padStart(3, "0")}`;
  return {
    id: String(n),
    code,
    name,
    type: "Business",
    contactPerson: "",
    email,
    phone: "+2348134450602",
    address: "",
    creditLimit: null,
    notes: "",
    branch: "Port Harcourt",
    totalSales,
    outstanding,
    since: "2026-04-12",
    archived: false,
    sales: sales(code),
    ...extra,
  };
};

// Remove once the real API is wired in.
export const MOCK_CUSTOMERS: Customer[] = [
  make(1, "Lagos Food Co", "lagosfoodco@gmail.com", 155000, 60000, {
    type: "Individual",
    contactPerson: "Mr Salami",
    phone: "08165898981",
    address: "3 Marshland, Ikeja, Lagos",
    notes: "Urgent order",
  }),
  make(2, "Coca Cola Ikeja", "cocacola@gmail.com", 670000, 72000),
  make(3, "Ade Traders Limited", "adetraders@gmail.com", 100000, 15000),
  make(4, "Nasco Group", "nascogroup@gmail.com", 700000, 75000),
  make(5, "Dangote Refinery", "dangoterefinery@gmail.com", 60000, 81500),
  make(6, "Indomitable Food Co", "indomitable@gmail.com", 2000000, 2550000),
  make(7, "Nasbury Limited", "nasburylimited@gmail.com", 70000, 75000),
  make(8, "Kokoa Foods", "kokoafoods@gmail.com", 60000, 82000),
];