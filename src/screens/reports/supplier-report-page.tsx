"use client";

import { ReportLayout } from "@/features/reports/components/report-layout";
import { ReportCard } from "@/features/reports/components/report-card";
import {
  BarChart,
  LineChart,
} from "@/features/reports/components/report-charts";
import { exportReport } from "@/features/reports/export-report";
import type { ReportsData, ReportPeriod } from "@/features/reports/types";
import { formatNaira } from "@/lib/format";

export default function SupplierReportPage({
  data,
  onPeriodChange,
}: {
  data: ReportsData["suppliers"];
  onPeriodChange?: (value: ReportPeriod) => void;
}) {
  function exportSuppliers() {
    exportReport("supplier-report", [
      ["Date", "Purchases"],
      ...data.overTime.map((point) => [point.label, point.value]),
      [],
      ["Supplier", "Spending"],
      ...data.spending.map((item) => [item.label, item.value]),
      [],
      ["Supplier", "Outstanding"],
      ...data.outstanding.map((item) => [item.label, item.value]),
    ]);
  }
  return (
    <ReportLayout
      title="Supplier Report"
      description="See what you buy and what you owe."
      onPeriodChange={onPeriodChange}
      onExport={exportSuppliers}
    >
      <ReportCard
        title="Purchases over time"
        value={formatNaira(data.total)}
        note={data.insights.trend}
      >
        <LineChart
          points={data.overTime}
          ticks={["₦600K", "₦400K", "₦200K", "₦0"]}
          max={600000}
          label="Purchases from October 1 to October 10"
        />
      </ReportCard>
      <div className="report-grid report-supplier-summary">
        <ReportCard
          title="Spending by supplier"
          value={`${data.spending.length} suppliers`}
          note={data.insights.spending}
        >
          <BarChart items={data.spending} />
        </ReportCard>
        <ReportCard
          title="Outstanding supplier balances"
          value={formatNaira(
            data.outstanding.reduce((total, item) => total + item.value, 0),
          )}
          note={data.insights.outstanding}
        >
          <BarChart items={data.outstanding} />
        </ReportCard>
      </div>
    </ReportLayout>
  );
}
