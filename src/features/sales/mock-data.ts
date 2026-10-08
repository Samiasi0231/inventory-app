import type { Customer, Invoice, InvoiceLine, SellableProduct } from "./types";

/** Issuing business, printed on invoices and receipts. */
export const BUSINESS_PROFILE = {
  name: "Donquixote.CO",
  address: "14 Aminu Kano Crescent, Wuse II, Abuja",
  phone: "+234 803 555 0142",
  email: "hello@adaezetrading.ng",
  taxId: "TIN 2048-1173",
};

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "cus_ngozi", name: "Mama Ngozi Store", phone: "0813 552 9087" },
  { id: "cus_donquixote", name: "Donquixote", phone: "0802 114 7781" },
  { id: "cus_blessing", name: "Blessing Supermarket", phone: "0706 229 4410" },
  { id: "cus_chidi", name: "Chidi Wholesale", phone: "0908 771 3320" },
  { id: "cus_amara", name: "Amara Provisions", phone: "0815 640 9912" },
];

export const SALE_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "groceries", name: "Groceries" },
  { id: "dairy", name: "Dairy" },
  { id: "grains", name: "Grains" },
  { id: "oils", name: "Oils" },
  { id: "beverages", name: "Beverages" },
  { id: "household", name: "Household" },
  { id: "services", name: "Services" },
];

export const MOCK_SELLABLE_PRODUCTS: SellableProduct[] = [
  { id: "sp_001", name: "Indomie Chicken (carton of 40)", sku: "IND-CH-40", categoryId: "groceries", categoryName: "Groceries", unit: "carton", price: 9_800, stock: 60, isService: false },
  { id: "sp_002", name: "Peak Milk Tin (carton of 48)", sku: "PKM-48", categoryId: "dairy", categoryName: "Dairy", unit: "carton", price: 42_500, stock: 20, isService: false },
  { id: "sp_003", name: "Mama Gold Rice (50kg bag)", sku: "MGR-50", categoryId: "grains", categoryName: "Grains", unit: "bag", price: 82_000, stock: 16, isService: false },
  { id: "sp_004", name: "Kings Vegetable Oil (5 L)", sku: "KVO-5L", categoryId: "oils", categoryName: "Oils", unit: "each", price: 12_500, stock: 40, isService: false },
  { id: "sp_005", name: "Golden Penny Semovita", sku: "GPS-10", categoryId: "grains", categoryName: "Grains", unit: "bag", price: 14_200, stock: 26, isService: false },
  { id: "sp_006", name: "Coca-Cola PET (crate of 12)", sku: "CCP-12", categoryId: "beverages", categoryName: "Beverages", unit: "crate", price: 5_400, stock: 50, isService: false },
  { id: "sp_007", name: "Table Water (bag of 20)", sku: "TWB-20", categoryId: "beverages", categoryName: "Beverages", unit: "bag", price: 1_100, stock: 90, isService: false },
  { id: "sp_008", name: "Tomato Paste (carton of 70)", sku: "TMP-70", categoryId: "groceries", categoryName: "Groceries", unit: "carton", price: 21_500, stock: 14, isService: false },
  { id: "sp_009", name: "Omo Detergent (2 kg)", sku: "OMO-2K", categoryId: "household", categoryName: "Household", unit: "each", price: 6_800, stock: 6, isService: false },
  { id: "sp_010", name: "Peak Milk Powder (400 g)", sku: "PPM-400", categoryId: "dairy", categoryName: "Dairy", unit: "each", price: 5_200, stock: 0, isService: false },
  { id: "sp_011", name: "Delivery within FCT", sku: "SVC-DLV", categoryId: "services", categoryName: "Services", unit: "trip", price: 3_500, stock: null, isService: true },
  { id: "sp_012", name: "Dangote Sugar (50 kg bag)", sku: "DSG-50", categoryId: "groceries", categoryName: "Groceries", unit: "bag", price: 78_000, stock: 18, isService: false },
  { id: "sp_013", name: "Shelf installation", sku: "SVC-INS", categoryId: "services", categoryName: "Services", unit: "job", price: 15_000, stock: null, isService: true },
];

/** Stock at or below this is shown as "Low" on the sale screen. */
export const LOW_STOCK_THRESHOLD = 10;

const BRANCH_IDS = ["br_ph", "br_lagos", "br_abuja", "br_kano"];

function buildLines(index: number): InvoiceLine[] {
  const picks = [
    MOCK_SELLABLE_PRODUCTS[index % MOCK_SELLABLE_PRODUCTS.length],
    MOCK_SELLABLE_PRODUCTS[(index + 3) % MOCK_SELLABLE_PRODUCTS.length],
    MOCK_SELLABLE_PRODUCTS[(index + 6) % MOCK_SELLABLE_PRODUCTS.length],
  ];

  return picks.slice(0, 2 + (index % 2)).map((product, position) => {
    const quantity = 1 + ((index + position) % 6);
    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      quantity,
      unit: product.unit,
      unitPrice: product.price,
      amount: product.price * quantity,
    };
  });
}

function buildInvoice(index: number): Invoice & { cancelled: boolean } {
  const number = `INV-2026-${String(index + 1).padStart(4, "0")}`;
  const lines = buildLines(index);
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const vat = Math.round(subtotal * 0.075 * 100) / 100;
  const total = subtotal + vat;

  // Spread invoices across paid, part-paid, pending and cancelled.
  const bucket = index % 5;
  const amountPaid = bucket === 0 ? 0 : bucket === 1 ? Math.round(total / 2) : total;

  const customer = MOCK_CUSTOMERS[index % MOCK_CUSTOMERS.length];
  const issued = new Date(2026, 8, 1 + (index % 28));
  const due = new Date(issued);
  due.setDate(due.getDate() + 14);

  return {
    id: `inv_${index + 1}`,
    number,
    customerId: customer.id,
    customerName: customer.name,
    issueDate: issued.toISOString(),
    dueDate: due.toISOString(),
    lines,
    subtotal,
    vat,
    total,
    amountPaid,
    branchId: index < 40 ? "br_ph" : BRANCH_IDS[index % BRANCH_IDS.length],
    cancelled: bucket === 4 && index % 20 === 4,
  };
}

export const MOCK_INVOICES = Array.from({ length: 125 }, (_, index) => buildInvoice(index));
