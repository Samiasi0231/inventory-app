"use client";

import { formatNaira } from "@/lib/format";
import { ReportLayout } from "@/features/reports/components/report-layout";
import { ReportCard } from "@/features/reports/components/report-card";
import {
  DonutChart,
  LineChart,
} from "@/features/reports/components/report-charts";
import { ReportTable } from "@/features/reports/components/report-table";
import { exportReport } from "@/features/reports/export-report";
import type { ReportsData, ReportPeriod } from "@/features/reports/types";

export default function CustomerReportPage({
  data,
  onPeriodChange,
}: {
  data: ReportsData["customers"];
  onPeriodChange?: (value: ReportPeriod) => void;
}) {
  const columns = ["Customer", "Total sales", "Outstanding"];
  function exportCustomers() {
    exportReport("customer-report", [
      ["Date", "New customers"],
      ...data.overTime.map((point) => [point.label, point.value]),
      [],
      columns,
      ...data.balances,
    ]);
  }
  return (
    <ReportLayout
      title="Customer Report"
      description="See who buys from you, who is new and who owes you."
      onPeriodChange={onPeriodChange}
      onExport={exportCustomers}
    >
      <ReportCard
        title="New customers over time"
        value={String(data.total)}
        note={data.insights.trend}
      >
        <LineChart
          points={data.overTime}
          ticks={["6", "4", "2", "0"]}
          max={6}
          label="New customers from October 1 to October 10"
        />
      </ReportCard>
      <div className="report-grid report-customer-summary">
        <ReportCard
          title="Outstanding customer balances"
          value={formatNaira(data.outstandingTotal)}
          detail={`Owed by ${data.owingCustomers} customers`}
          note={data.insights.balances}
        >
          <ReportTable
            columns={columns}
            rows={data.balances}
            numericColumns={[1, 2]}
          />
        </ReportCard>
        <ReportCard title="Sales by customer type" note={data.insights.types}>
          <DonutChart
            items={data.customerTypes}
            value={`₦${(data.salesTotal / 1_000_000).toFixed(1)}M`}
            detail="In sales"
          />
        </ReportCard>
      </div>
    </ReportLayout>
  );
}
