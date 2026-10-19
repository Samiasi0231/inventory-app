"use client";

import { ReportLayout } from "@/features/reports/components/report-layout";
import { ReportCard } from "@/features/reports/components/report-card";
import { LineChart } from "@/features/reports/components/report-charts";
import { ReportTable } from "@/features/reports/components/report-table";
import { exportReport } from "@/features/reports/export-report";
import type { ReportsData, ReportPeriod } from "@/features/reports/types";
import { formatNaira } from "@/lib/format";

export default function PaymentReportPage({
  data,
  onPeriodChange,
}: {
  data: ReportsData["payments"];
  onPeriodChange?: (value: ReportPeriod) => void;
}) {
  const columns = ["Payment ID", "Date", "Method", "Amount"];
  function exportPayments() {
    exportReport("payment-report", [
      ["Date", "Payments received"],
      ...data.overTime.map((point) => [point.label, point.value]),
      [],
      columns,
      ...data.rows,
    ]);
  }
  return (
    <ReportLayout
      title="Payment Report"
      description="See the money you have received."
      onPeriodChange={onPeriodChange}
      onExport={exportPayments}
    >
      <ReportCard
        title="Payments received over time"
        value={formatNaira(data.total)}
        note={data.insight}
      >
        <LineChart
          points={data.overTime}
          ticks={["₦1.5M", "₦1M", "₦500K", "₦0"]}
          max={1500000}
          label="Payments received from October 1 to October 10"
        />
      </ReportCard>
      <ReportCard
        title="Payments"
        value={`${data.count} payments`}
        className="report-payments-table"
      >
        <ReportTable columns={columns} rows={data.rows} numericColumns={[3]} />
        <p className="report-table-footer">
          Showing {data.rows.length} of {data.count} payments.
        </p>
      </ReportCard>
    </ReportLayout>
  );
}
