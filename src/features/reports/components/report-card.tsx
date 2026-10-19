import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  title: string;
  value?: string;
  detail?: string;
  note?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ReportCard({
  title,
  value,
  detail,
  note,
  action,
  children,
  className,
}: ReportCardProps) {
  return (
    <section className={cn("report-card", className)}>
      <div className="report-card-heading">
        <div>
          <h2>{title}</h2>
          {value && (
            <div className="report-metric">
              <strong>{value}</strong>
              {detail && <span>{detail}</span>}
            </div>
          )}
        </div>
        {action}
      </div>
      <div className="report-card-content">{children}</div>
      {note && <p className="report-note">{note}</p>}
    </section>
  );
}
