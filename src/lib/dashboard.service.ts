import type { DashboardData, DashboardParams } from "@/types/dashboard";

/**
 * Mocked until the dashboard endpoint is available. Swap the body of
 * `getDashboard` for the real request; the shape of `DashboardData` is the
 * contract the page depends on.
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** An ISO timestamp `daysAgo` days back at the given local time. */
function at(daysAgo: number, hours: number, minutes: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export const dashboardService = {
  async getDashboard(params: DashboardParams): Promise<DashboardData> {
    void params;
    await wait(500);

    return {
      overview: {
        sales: 650_400_000,
        salesDelta: 5.2,
        expenses: 210_200_000,
        expensesDelta: 5.2,
        netProfit: 440_200_000,
        netProfitDelta: 6.2,
        refunds: 45_000_000,
        refundsDelta: -5.2,
      },
      salesOverview: {
        total: 65_400_000,
        delta: 12.4,
        points: [
          { label: "Week 1, start", axisLabel: "W1", value: 100_000 },
          { label: "Week 1, end", value: 50_000 },
          { label: "Week 2, start", value: 370_000 },
          { label: "Week 2, mid", axisLabel: "W2", value: 400_000 },
          { label: "Week 2, end", value: 500_000 },
          { label: "Week 3, start", value: 400_000 },
          { label: "Week 3, mid", axisLabel: "W3", value: 400_000 },
          { label: "Week 3, end", value: 500_000 },
          { label: "Week 4, start", value: 400_000 },
          { label: "Week 4, end", axisLabel: "W4", value: 500_000 },
        ],
      },
      alerts: [
        {
          id: "alert_low_stock",
          title: "Low Stock Alert",
          message: "12 products are below their reorder level",
          severity: "urgent",
          href: "/inventory/products",
        },
        {
          id: "alert_overdue",
          title: "Overdue Payment",
          message: "₦125,500 from ABC stores is overdue",
          severity: "urgent",
          href: "/sales/invoices",
        },
        {
          id: "alert_expiry",
          title: "Expiry Warning",
          message: "7 products are expiring within 30days",
          severity: "urgent",
          href: "/inventory/products",
        },
      ],
      activity: [
        { id: "act_1", message: "Ada added 50 units of Premium Rice", timeAgo: "10mins ago" },
        { id: "act_2", message: "Emeka recorded expense Fuel - Gen", timeAgo: "20mins ago" },
        { id: "act_3", message: "System generated weekly sales report", timeAgo: "Yesterday" },
        { id: "act_4", message: "Chioma processed refund for INV-2031", timeAgo: "Yesterday" },
      ],
      topProducts: [
        { id: "prod_1", name: "Pet Coke", sold: 44, target: 50 },
        { id: "prod_2", name: "Rice 50g", sold: 48, target: 50 },
        { id: "prod_3", name: "Ayoola Palm Oil (Small Bottle)", sold: 38, target: 50 },
        { id: "prod_4", name: "Milo 100g", sold: 32, target: 50 },
      ],
      transactions: {
        total: 100,
        data: [
          { id: "t1", reference: "S-001", type: "sale", amount: 45_000, status: "pending", branch: "Port Harcourt", occurredAt: at(0, 10, 42) },
          { id: "t2", reference: "R-002", type: "refund", amount: 45_000, status: "successful", branch: "Port Harcourt", occurredAt: at(0, 8, 15) },
          { id: "t3", reference: "P-003", type: "purchase", amount: 6_000_000, status: "successful", branch: "Port Harcourt", occurredAt: at(1, 8, 15) },
          { id: "t4", reference: "E-004", type: "expense", amount: 10_000_000, status: "failed", branch: "Port Harcourt", occurredAt: at(1, 22, 0) },
        ],
      },
    };
  },
};