import { Panel } from "./panel";

export interface InfoRowData {
  label: string;
  value: string;
}

export function ContactInfoCard({
  rows,
  title = "Contact Information",
}: {
  rows: InfoRowData[];
  title?: string;
}) {
  return (
    <Panel>
      <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
      <div className="space-y-4">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-start justify-between gap-6 text-xs"
          >
            <div className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {r.label} :
            </div>
            <div className="max-w-[260px] text-right text-gray-900">
              {r.value || "—"}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
