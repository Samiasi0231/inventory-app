import type { InvoiceRecord } from "../features/sales/types";
import type { Supplier } from "@/types/suppliers";

const purchases = (code: string): InvoiceRecord[] => [
  { id: `${code}-p1`, date: "2026-10-04", invoiceNo: "INV-2026-0032", amount: 55000, status: "completed" },
  { id: `${code}-p2`, date: "2026-10-04", invoiceNo: "INV-2026-0031", amount: 55000, status: "completed" },
];

const make = (
  n: number,
  name: string,
  email: string,
  phone: string,
  totalPurchases: number,
  outstanding: number,
  extra: Partial<Supplier> = {}
): Supplier => {
  const code = `SUP-${String(n).padStart(3, "0")}`;
  return {
    id: String(n),
    code,
    name,
    type: "Business",
    contactPerson: "",
    email,
    phone,
    address: "",
    notes: "",
    branch: "Port Harcourt",
    totalPurchases,
    outstanding,
    since: "2026-04-12",
    archived: false,
    purchases: purchases(code),
    ...extra,
  };
};

// Remove once the real API is wired in.
export const MOCK_SUPPLIERS: Supplier[] = [
  make(1, "ABC Suppliers Ltd", "abc@gmail.com", "08012345654", 520000, 60000, {
    type: "Individual",
    contactPerson: "Baba James",
    address: "9 Agbamasho Close, Magado Abuja",
    notes: "Urgent order",
  }),
  make(2, "FreshMart Ltd", "freshmart@gmail.com", "08033822867", 670000, 80000, {
    contactPerson: "Mrs Okafor",
    address: "14 Aba Road, Port Harcourt",
  }),
  make(3, "Prime Distributors", "prime@gmail.com", "08126734562", 690000, 65000, {
    contactPerson: "Mr Adeyemi",
    address: "12 Trans-Amadi Road, Port Harcourt",
  }),
  make(4, "Nasco Group", "nasco@gmail.com", "07030298635", 850000, 120000, {
    contactPerson: "Mr Bello",
    address: "3 Industrial Layout, Port Harcourt",
  }),
  make(5, "Dangote Refinery", "dangoterefinery@gmail.com", "08026735642", 1200000, 250000, {
    contactPerson: "Ms Eze",
    address: "Lekki Free Zone, Lagos",
  }),
  make(6, "Indomitable food co", "indomitable@gmail.com", "07033822877", 180000, 50000, {
    contactPerson: "Mr Salami",
    address: "7 Rumuola Road, Port Harcourt",
  }),
];