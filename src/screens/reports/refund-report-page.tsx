"use client";

import { ReportLayout } from "@/features/reports/components/report-layout";
import { ReportCard } from "@/features/reports/components/report-card";
import { LineChart } from "@/features/reports/components/report-charts";
import { ReportTable } from "@/features/reports/components/report-table";
import { exportReport } from "@/features/reports/export-report";
import type { ReportsData, ReportPeriod } from "@/features/reports/types";
import { formatNaira } from "@/lib/format";

export default function RefundReportPage({
  data,
  onPeriodChange,
}: {
  data: ReportsData["refunds"];
  onPeriodChange?: (value: ReportPeriod) => void;
}) {
  const columns = ["Ref", "Invoice", "Reason", "Amount", "Date"];
  function exportRefunds() {
    exportReport("refund-report", [columns, ...data.rows]);
  }
  return (
    <ReportLayout
      title="Refund Report"
      description="See what you paid back to customers."
      onPeriodChange={onPeriodChange}
      onExport={exportRefunds}
    >
      <ReportCard
        title="Refunds over time"
        value={formatNaira(data.total)}
        note={data.insights.trend}
      >
        <LineChart
          points={data.overTime}
          ticks={["₦100K", "₦50K", "₦0"]}
          max={100000}
          height={92}
          label="Refunds from October 1 to October 10"
        />
      </ReportCard>
      <ReportCard
        title="Refunds"
        value={`${data.rows.length} refunds`}
        note={data.insights.largest}
        className="report-refunds-table"
      >
        <ReportTable
          columns={columns}
          rows={data.rows}
          numericColumns={[3, 4]}
        />
      </ReportCard>
    </ReportLayout>
  );
}
