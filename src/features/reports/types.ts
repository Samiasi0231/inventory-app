export type ReportPeriod = "this-month" | "last-month";
export type ChartInterval = "Daily" | "Weekly" | "Monthly";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface RankedItem {
  label: string;
  value: number;
  displayValue: string;
}

export interface DonutItem {
  label: string;
  value: number;
  displayValue: string;
  color: string;
}

export interface ReportsData {
  overview: {
    profit: number;
    dateRange: string;
    profitDaily: ChartPoint[];
    profitOverTime: ChartPoint[];
    categories: RankedItem[];
    paymentMethods: DonutItem[];
    salesTotal: number;
    insights: { profit: string; categories: string; payments: string };
  };
  sales: {
    total: number;
    orders: number;
    overTime: ChartPoint[];
    products: RankedItem[];
    customers: string[][];
    insights: { trend: string; products: string; customers: string };
  };
  inventory: {
    total: number;
    categories: RankedItem[];
    slowStock: number;
    slowProductCount: number;
    slowStockDays: number;
    slowProducts: DonutItem[];
    lowStock: string[][];
    expiring: string[][];
    insights: {
      categories: string;
      slowStock: string;
      lowStock: string;
      expiring: string;
    };
  };
  suppliers: {
    total: number;
    overTime: ChartPoint[];
    spending: RankedItem[];
    outstanding: RankedItem[];
    insights: { trend: string; spending: string; outstanding: string };
  };
  payments: {
    total: number;
    count: number;
    overTime: ChartPoint[];
    rows: string[][];
    insight: string;
  };
  refunds: {
    total: number;
    overTime: ChartPoint[];
    rows: string[][];
    insights: { trend: string; largest: string };
  };
  customers: {
    total: number;
    overTime: ChartPoint[];
    outstandingTotal: number;
    owingCustomers: number;
    salesTotal: number;
    balances: string[][];
    customerTypes: DonutItem[];
    insights: { trend: string; balances: string; types: string };
  };
}
