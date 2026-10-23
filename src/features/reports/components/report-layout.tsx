"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ChevronDownIcon, DownloadIcon } from "lucide-react";
import { BranchSelector } from "@/layout/branch-selector";
import type { ReportPeriod } from "../types";

interface ReportLayoutProps {
  title: string;
  description: string;
  onPeriodChange?: (value: ReportPeriod) => void;
  onExport?: () => void;
  overview?: boolean;
  children: ReactNode;
}

export function ReportLayout({
  title,
  description,
  onPeriodChange,
  onExport,
  overview = false,
  children,
}: ReportLayoutProps) {
  const [period, setPeriod] = useState<ReportPeriod>("this-month");
  return (
    <div
      className={`reports-page ${overview ? "reports-overview" : "reports-detail"}`}
    >
      {!overview && (
        <>
          <Link href="/reports" className="report-back">
            <ArrowLeftIcon size={16} strokeWidth={1} />
            Back to Reports
          </Link>
        </>
      )}
      <header className="report-page-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="report-filters">
          <BranchSelector />
          <div className="report-period">
            <select
              aria-label="Report period"
              value={period}
              onChange={(event) => {
                const next = event.target.value as ReportPeriod;
                setPeriod(next);
                onPeriodChange?.(next);
              }}
            >
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
            </select>
            <ChevronDownIcon size={16} strokeWidth={1} />
          </div>
          {!overview && (
            <button
              type="button"
              className="report-export"
              onClick={onExport}
              disabled={!onExport}
            >
              <DownloadIcon size={16} strokeWidth={1.5} />
              Export
            </button>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
