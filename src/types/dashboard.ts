export type DashboardPeriod = "today" | "week" | "month" | "year";

export const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

export interface DashboardOverview {
  sales: number;
  salesDelta: number;
  expenses: number;
  expensesDelta: number;
  netProfit: number;
  netProfitDelta: number;
  refunds: number;
  refundsDelta: number;
}

export interface SalesPoint {
  /** Shown in the hover tooltip. */
  label: string;
  /** Shown under the x-axis at this point. Leave empty to skip a tick. */
  axisLabel?: string;
  value: number;
}

export interface SalesOverview {
  total: number;
  delta: number;
  points: SalesPoint[];
}

export type AlertSeverity = "urgent" | "warning" | "info";

export interface SmartAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  href?: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  timeAgo: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sold: number;
  target: number;
}

export type TransactionType = "sale" | "refund" | "purchase" | "expense";
export type TransactionStatus = "pending" | "successful" | "failed";

export interface DashboardTransaction {
  id: string;
  reference: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  branch: string;
  occurredAt: string; // ISO string
}

export interface DashboardData {
  overview: DashboardOverview;
  salesOverview: SalesOverview;
  alerts: SmartAlert[];
  activity: ActivityItem[];
  topProducts: TopProduct[];
  transactions: { data: DashboardTransaction[]; total: number };
}

export interface DashboardParams {
  branchId: string;
  period: DashboardPeriod;
}