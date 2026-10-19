"use client";

import { useState } from "react";
import { ReportLayout } from "@/features/reports/components/report-layout";
import { ReportCard } from "@/features/reports/components/report-card";
import {
  BarChart,
  LineChart,
  IntervalSelect,
} from "@/features/reports/components/report-charts";
import { ReportTable } from "@/features/reports/components/report-table";
import { exportReport } from "@/features/reports/export-report";
import {
  groupWeekly,
  formatAxisCurrency,
} from "@/features/reports/chart-utils";
import type {
  ReportsData,
  ChartInterval,
  ReportPeriod,
} from "@/features/reports/types";
import { formatNaira } from "@/lib/format";

export default function SalesReportPage({
  data,
  onPeriodChange,
}: {
  data: ReportsData["sales"];
  onPeriodChange?: (value: ReportPeriod) => void;
}) {
  const [interval, setInterval] = useState<ChartInterval>("Daily");
  const points =
    interval === "Weekly" ? groupWeekly(data.overTime) : data.overTime;
  const max = interval === "Weekly" ? 9000000 : 1500000;
  const ticks = Array.from({ length: 6 }, (_, index) =>
    formatAxisCurrency((max * (5 - index)) / 5),
  );
  function exportSales() {
    exportReport("sales-report", [
      ["Date", "Sales"],
      ...data.overTime.map((point) => [point.label, point.value]),
      [],
      ["Customer", "Orders", "Total sales"],
      ...data.customers,
    ]);
  }
  return (
    <ReportLayout
      title="Sales Report"
      description="See what you sold and who bought it."
      onPeriodChange={onPeriodChange}
      onExport={exportSales}
    >
      <ReportCard
        title="Sales over time"
        value={formatNaira(data.total)}
        detail={`${data.orders} orders`}
        note={data.insights.trend}
        className="report-sales-trend"
        action={
          <IntervalSelect
            options={["Daily", "Weekly"]}
            value={interval}
            onChange={setInterval}
          />
        }
      >
        <LineChart
          points={points}
          ticks={ticks}
          max={max}
          height={232}
          label={`Sales over time, grouped ${interval.toLowerCase()}`}
        />
      </ReportCard>
      <div className="report-grid report-sales-summary">
        <ReportCard title="Top products by sales" note={data.insights.products}>
          <BarChart items={data.products} spacing="wide" />
        </ReportCard>
        <ReportCard
          title="Top customers by sales"
          note={data.insights.customers}
        >
          <ReportTable
            columns={["Customer", "Orders", "Total sales"]}
            rows={data.customers}
            numericColumns={[2]}
          />
        </ReportCard>
      </div>
    </ReportLayout>
  );
}
