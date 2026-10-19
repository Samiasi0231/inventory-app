"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { ReportLayout } from "@/features/reports/components/report-layout";
import { ReportCard } from "@/features/reports/components/report-card";
import {
  BarChart,
  DonutChart,
  LineChart,
  IntervalSelect,
} from "@/features/reports/components/report-charts";
import type {
  ReportsData,
  ChartInterval,
  ReportPeriod,
} from "@/features/reports/types";
import {
  groupWeekly,
  formatAxisCurrency,
} from "@/features/reports/chart-utils";
import { formatNaira } from "@/lib/format";

const reportLinks = [
  {
    title: "Sales",
    description: "Sales summary, best sellers and sales by customer",
    href: "/reports/sales",
  },
  {
    title: "Inventory",
    description: "Stock value, what is running low and what is expiring",
    href: "/reports/inventory",
  },
  {
    title: "Suppliers",
    description: "What you owe suppliers and what you buy from them",
    href: "/reports/suppliers",
  },
  {
    title: "Refunds",
    description: "Money paid back to customers",
    href: "/reports/refunds",
  },
  {
    title: "Payments",
    description: "Money received and how people paid",
    href: "/reports/payments",
  },
  {
    title: "Customers",
    description: "New customers, who owes you and sales by customer type",
    href: "/reports/customers",
  },
];

export default function ReportsPage({
  data,
  onPeriodChange,
}: {
  data: ReportsData["overview"];
  onPeriodChange?: (value: ReportPeriod) => void;
}) {
  const [interval, setInterval] = useState<ChartInterval>("Monthly");
  const pointsByInterval = {
    Daily: data.profitDaily,
    Weekly: groupWeekly(data.profitDaily),
    Monthly: data.profitOverTime,
  };
  const maxByInterval = { Daily: 200000, Weekly: 1000000, Monthly: 4000000 };
  const points = pointsByInterval[interval];
  const max = maxByInterval[interval];
  const ticks = Array.from({ length: 5 }, (_, index) =>
    formatAxisCurrency((max * (4 - index)) / 4),
  );
  return (
    <ReportLayout
      title="Reports"
      description="See how your business is doing."
      overview
      onPeriodChange={onPeriodChange}
    >
      <ReportCard
        title="Gross profit over time"
        value={formatNaira(data.profit)}
        detail={data.dateRange}
        note={data.insights.profit}
        className="report-overview-trend"
        action={
          <IntervalSelect
            options={["Daily", "Weekly", "Monthly"]}
            value={interval}
            onChange={setInterval}
          />
        }
      >
        <LineChart
          points={points}
          ticks={ticks}
          max={max}
          height={186}
          partialLastPoint={interval === "Monthly"}
          label={`Gross profit, grouped ${interval.toLowerCase()}`}
        />
      </ReportCard>
      <div className="report-grid report-overview-summary">
        <ReportCard title="Sales by category" note={data.insights.categories}>
          <BarChart items={data.categories} spacing="compact" />
        </ReportCard>
        <ReportCard
          title="Payment status and methods"
          note={data.insights.payments}
        >
          <DonutChart
            items={data.paymentMethods}
            value={`₦${(data.salesTotal / 1_000_000).toFixed(1)}M`}
            detail="This month"
          />
        </ReportCard>
      </div>
      <section className="report-browse">
        <h2>Browse Reports</h2>
        <div className="report-grid">
          {reportLinks.map((report) => (
            <Link key={report.href} href={report.href} className="report-link">
              <div>
                <h3>{report.title}</h3>
                <p>{report.description}</p>
              </div>
              <ChevronRightIcon size={20} strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </section>
    </ReportLayout>
  );
}
