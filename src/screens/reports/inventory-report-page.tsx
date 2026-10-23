"use client";

import { ReportLayout } from "@/features/reports/components/report-layout";
import { ReportCard } from "@/features/reports/components/report-card";
import {
  BarChart,
  DonutChart,
} from "@/features/reports/components/report-charts";
import { ReportTable } from "@/features/reports/components/report-table";
import { exportReport } from "@/features/reports/export-report";
import type { ReportsData, ReportPeriod } from "@/features/reports/types";
import { formatNaira } from "@/lib/format";

export default function InventoryReportPage({
  data,
  onPeriodChange,
}: {
  data: ReportsData["inventory"];
  onPeriodChange?: (value: ReportPeriod) => void;
}) {
  function exportInventory() {
    exportReport("inventory-report", [
      ["Category", "Stock value"],
      ...data.categories.map((item) => [item.label, item.value]),
      [],
      ["Product", "In stock", "Reorder level"],
      ...data.lowStock,
      [],
      ["Product", "Expiry date", "Units"],
      ...data.expiring,
    ]);
  }
  return (
    <ReportLayout
      title="Inventory Report"
      description="See what you have, what is running low and what is expiring."
      onPeriodChange={onPeriodChange}
      onExport={exportInventory}
    >
      <div className="report-grid report-inventory-summary">
        <ReportCard
          title="Stock value by category"
          value={formatNaira(data.total)}
          detail="Total stock worth"
          note={data.insights.categories}
        >
          <BarChart items={data.categories} />
        </ReportCard>
        <ReportCard
          title="Slow-moving stock"
          value={formatNaira(data.slowStock)}
          detail={`${data.slowProductCount} products, no sale in ${data.slowStockDays} days or more`}
          note={data.insights.slowStock}
        >
          <DonutChart items={data.slowProducts} roundLegend />
        </ReportCard>
      </div>
      <div className="report-grid report-inventory-tables">
        <ReportCard title="Low stock" note={data.insights.lowStock}>
          <ReportTable
            columns={["Product", "In stock", "Reorder level"]}
            rows={data.lowStock}
            numericColumns={[2]}
          />
        </ReportCard>
        <ReportCard title="Expiring soon" note={data.insights.expiring}>
          <ReportTable
            columns={["Product", "Expiry date", "Units"]}
            rows={data.expiring}
            numericColumns={[1, 2]}
          />
        </ReportCard>
      </div>
    </ReportLayout>
  );
}
