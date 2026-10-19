import type { ChartPoint, RankedItem, DonutItem, ReportsData } from "./types";

function dailyPoints(values: number[]): ChartPoint[] {
  return values.map((value, index) => ({ label: `Oct ${index + 1}`, value }));
}

const categories: RankedItem[] = [
  { label: "Grains and flour", value: 41, displayValue: "41%" },
  { label: "Sugar and sweetners", value: 22, displayValue: "22%" },
  { label: "Dairy", value: 17, displayValue: "17%" },
  { label: "Beverages", value: 12, displayValue: "12%" },
  { label: "Other", value: 8, displayValue: "8%" },
];

const paymentMethods: DonutItem[] = [
  { label: "Bank transfer", value: 46, displayValue: "46%", color: "#006b39" },
  { label: "Cash", value: 27, displayValue: "27%", color: "#008c4b" },
  { label: "Card", value: 15, displayValue: "15%", color: "#00ba68" },
  { label: "Not yet paid", value: 12, displayValue: "12%", color: "#d4d4d4" },
];

export const reportData: ReportsData = {
  overview: {
    profit: 1280000,
    dateRange: "1 to 10 Oct",
    salesTotal: 10632360,
    insights: {
      profit: "Gross profit was highest in September, at ₦3.7M.",
      categories: "Grains and flour made up 41% of this month's sales.",
      payments: "Bank transfer was the most used way to pay, at 46%.",
    },
    profitDaily: dailyPoints([
      120000, 110000, 135000, 90000, 160000, 105000, 175000, 115000, 145000,
      125000,
    ]),
    profitOverTime: [
      { label: "Jun", value: 3260000 },
      { label: "Jul", value: 3100000 },
      { label: "Aug", value: 3520000 },
      { label: "Sep", value: 3820000 },
      { label: "Oct", value: 1280000 },
    ],
    categories,
    paymentMethods,
  },
  sales: {
    total: 10632360,
    orders: 148,
    insights: {
      trend: "Sales averaged about ₦1.06M a day.",
      products: "Premium Rice is 27.3% of sales",
      customers: "Coca Cola Ikeja is your biggest customer, at 19.8% of sales.",
    },
    overTime: dailyPoints([
      1040000, 955000, 1100000, 1020000, 1160000, 1110000, 1200000, 1035000,
      1025000, 967360,
    ]),
    products: [
      { label: "Premium Rice (50kg)", value: 2900000, displayValue: "₦2.9M" },
      { label: "Dangote Sugar (50kg)", value: 2340000, displayValue: "₦2.34M" },
      {
        label: "Golden Penny Flour (2kg)",
        value: 1460000,
        displayValue: "₦1.46M",
      },
      {
        label: "Peak Milk Powder (900g)",
        value: 1300000,
        displayValue: "₦1.3M",
      },
      { label: "Milo (500g)", value: 700000, displayValue: "₦700K" },
    ],
    customers: [
      ["Coca Cola Ikeja", "24", "₦2,100,000"],
      ["Nasco Group", "19", "₦1,850,000"],
      ["Lagos Food Co", "17", "₦1,420,000"],
      ["Indomitable Food Co", "11", "₦1,300,000"],
      ["Dangote Refinery", "9", "₦980,000"],
    ],
  },
  inventory: {
    total: 65040000,
    insights: {
      categories: "Grains and flour hold the most stock, at ₦24.7M.",
      slowStock:
        "Bournvita (900g) has not sold in 62 days and holds ₦1.4M of stock.",
      lowStock: "Quaker Oats (1kg) is the lowest, at 6 units.",
      expiring: "Peak Milk Powder (900g) expires first, on 22 Oct 2026.",
    },
    categories: [
      { label: "Grains and flour", value: 24700000, displayValue: "₦24.7M" },
      { label: "Sugar and sweetners", value: 15600000, displayValue: "₦15.6M" },
      { label: "Dairy", value: 9800000, displayValue: "₦9.8M" },
      { label: "Beverages", value: 9100000, displayValue: "₦9.1M" },
      { label: "Others", value: 5800000, displayValue: "₦5.8M" },
    ],
    slowStock: 5230000,
    slowProductCount: 9,
    slowStockDays: 30,
    slowProducts: [
      {
        label: "Bournvita (900g)",
        value: 1400000,
        displayValue: "₦1.4M",
        color: "#006b39",
      },
      {
        label: "Honeywell Flour",
        value: 1200000,
        displayValue: "₦1.2M",
        color: "#008c4b",
      },
      {
        label: "Milo Energy Drink",
        value: 900000,
        displayValue: "₦900K",
        color: "#00ba68",
      },
      {
        label: "Ayoola Palm Oil",
        value: 400000,
        displayValue: "₦400K",
        color: "#00df7b",
      },
      {
        label: "Other 5 products",
        value: 1300000,
        displayValue: "₦1.3M",
        color: "#d4d4d4",
      },
    ],
    lowStock: [
      ["Quaker Oats (1kg)", "6", "20"],
      ["Maggi Chicken Cubes", "9", "20"],
      ["Devon King's Oil", "12", "25"],
      ["Titus Sardine", "18", "30"],
      ["Pet Coke", "24", "40"],
    ],
    expiring: [
      ["Peak Milk Powder (900g)", "22 Oct 2026", "30"],
      ["Bournvita (900g)", "29 Oct 2026", "25"],
      ["Milo Energy Drink", "03 Nov 2026", "40"],
      ["Quaker Oats (1kg)", "09 Nov 2026", "14"],
      ["Indomie (40pk)", "13 Nov 2026", "60"],
    ],
  },
  suppliers: {
    total: 1640000,
    insights: {
      trend: "Most was bought on Oct 6, at ₦450,000.",
      spending: "Nasco Group supplied the most, at ₦520K.",
      outstanding: "You owe Dangote Refinery the most, at ₦250K.",
    },
    overTime: dailyPoints([
      125000, 0, 300000, 80000, 0, 450000, 120000, 0, 365000, 160000,
    ]),
    spending: [
      { label: "Nasco Group", value: 520000, displayValue: "₦520K" },
      { label: "Dangote Refinery", value: 380000, displayValue: "₦380K" },
      { label: "FreshMart Ltd", value: 290000, displayValue: "₦290K" },
      { label: "Prime Distributors", value: 250000, displayValue: "₦250K" },
      { label: "ABC Suppliers Ltd", value: 200000, displayValue: "₦200K" },
    ],
    outstanding: [
      { label: "Dangote Refinery", value: 250000, displayValue: "₦250K" },
      { label: "Nasco Group", value: 120000, displayValue: "₦120K" },
      { label: "Prime Distributors", value: 89000, displayValue: "₦89K" },
      { label: "FreshMart Ltd", value: 80000, displayValue: "₦80K" },
      { label: "ABC Suppliers Ltd", value: 60000, displayValue: "₦60K" },
    ],
  },
  refunds: {
    total: 260000,
    insights: {
      trend: "Most was refunded on Oct 6, at ₦85,000.",
      largest: "R-011 was the largest refund, at ₦85,000.",
    },
    overTime: dailyPoints([0, 45000, 0, 30000, 0, 85000, 0, 60000, 0, 40000]),
    rows: [
      ["R-011", "INV-2014", "Damaged goods", "₦85,000", "06 Oct 2026"],
      ["R-014", "INV-2021", "Damaged goods", "₦60,000", "08 Oct 2026"],
      ["R-009", "INV-2011", "Expired products", "₦45,000", "02 Oct 2026"],
      ["R-015", "INV-2024", "Expired products", "₦40,000", "10 Oct 2026"],
      ["R-012", "INV-2016", "Expired products", "₦30,000", "04 Oct 2026"],
    ],
  },
  payments: {
    total: 9400000,
    insight: "Most was received on Oct 7, at ₦1,100,000.",
    count: 130,
    overTime: dailyPoints([
      910000, 890000, 1000000, 870000, 1080000, 1020000, 1130000, 900000,
      930000, 780000,
    ]),
    rows: [
      ["PAY-020", "10 Oct 2026", "Bank transfer", "₦108,000"],
      ["PAY-019", "09 Oct 2026", "Cash", "₦85,000"],
      ["PAY-018", "09 Oct 2026", "Card", "₦62,000"],
      ["PAY-017", "08 Oct 2026", "Bank transfer", "₦96,000"],
      ["PAY-016", "08 Oct 2026", "Card", "₦150,000"],
    ],
  },
  customers: {
    total: 23,
    outstandingTotal: 1950500,
    owingCustomers: 7,
    salesTotal: 10632360,
    insights: {
      trend: "Most new customers joined on Oct 7.",
      balances: "Indomitable Food Co owes the most, at ₦1,550,000.",
      types: "Returning customers brought in 72% of this month's sales.",
    },
    overTime: dailyPoints([2, 1, 3, 2, 4, 2, 5, 1, 2, 1]),
    balances: [
      ["Indomitable Food Co", "₦2,000,000", "₦1,550,000"],
      ["Kokoa Foods", "₦80,000", "₦42,000"],
      ["Dangote Refinery", "₦80,000", "₦81,500"],
      ["Nasco Group", "₦700,000", "₦75,000"],
      ["Nasbury Limited", "₦70,000", "₦41,500"],
    ],
    customerTypes: [
      {
        label: "Returning customers",
        value: 72,
        displayValue: "72%",
        color: "#006b39",
      },
      {
        label: "New customers",
        value: 28,
        displayValue: "28%",
        color: "#00ba68",
      },
    ],
  },
};
