import { Check, ChevronDown, ChevronLeft, Lock, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeatureImage } from "./feature-image";
import {
  branchDetails,
  branchPreview,
  grossProfitPreview,
  inventoryPreview,
  purchaseOrderPreview,
  type IllustrationKind,
} from "./landing-content";
 
// -----------------------------------------------------------------------------
// Sales & Purchasing — purchase-order form with the products table on top of it
// -----------------------------------------------------------------------------
function PurchaseOrderIllustration() {
  const { formFields, columns, rows } = purchaseOrderPreview;
 
  return (
    <>
      <div className="absolute left-[8%] top-[30%] w-[57%] rounded-md bg-white p-3 shadow-sm">
        <p className="flex items-center gap-1 text-[10px] font-semibold text-ink-1">
          <ChevronLeft className="size-3" /> Supplier and Logistics
        </p>
        <dl className="mt-3 space-y-2">
          {formFields.map((label) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <dt className="truncate text-[9px] text-ink-3">{label}</dt>
              <dd className="h-1.5 w-16 shrink-0 rounded bg-neutral-200" />
            </div>
          ))}
        </dl>
      </div>
 
      <div className="absolute left-[36%] top-[54%] w-[56%] rounded-md border border-neutral-100 bg-white p-3 shadow-md">
        <p className="flex items-center gap-1 text-[10px] font-semibold text-ink-1">
          <ChevronLeft className="size-3" /> Products
        </p>
        <table className="mt-2 w-full table-fixed text-left text-[8px]">
          <thead>
            <tr className="text-ink-3">
              {columns.map((column) => (
                <th key={column} className="truncate pb-1 pr-1 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-neutral-100 text-ink-2">
                {row.map((cell, index) => (
                  <td key={index} className="truncate py-1 pr-1">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
 
// -----------------------------------------------------------------------------
// Smart inventory & batch control — stock table with status pills
// -----------------------------------------------------------------------------
const statusStyles = {
  low: { label: "Low Stock", pill: "bg-danger-bg text-danger-fg", dot: "bg-danger-fg" },
  "in-stock": { label: "In Stock", pill: "bg-success-bg text-success-fg", dot: "bg-success-fg" },
} as const;
 
const inventoryGrid = "grid grid-cols-[0.6fr_1.5fr_1.6fr_0.9fr_1.1fr] items-center gap-2 px-3";
 
function InventoryIllustration() {
  const { columns, rows } = inventoryPreview;
 
  return (
    <div className="absolute inset-x-[14%] bottom-[8%] overflow-hidden rounded-sm bg-white shadow-sm">
      <div className={cn(inventoryGrid, "bg-brand-50/50 py-2 text-[9px] font-semibold text-ink-2")}>
        {columns.map((column) => (
          <span key={column} className="truncate">
            {column}
          </span>
        ))}
      </div>
 
      {rows.map((row) => {
        const status = statusStyles[row.status];
        return (
          <div key={row.code} className={cn(inventoryGrid, "border-t border-neutral-100 py-2 text-[9px] text-ink-2")}>
            <span>{row.code}</span>
            <span className="truncate">{row.product}</span>
            <span className="truncate">{row.category}</span>
            <span>{row.stock}</span>
            <span className={cn("inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-medium", status.pill)}>
              <span className={cn("size-1 rounded-full", status.dot)} />
              {status.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
 
// -----------------------------------------------------------------------------
// Performance Insights — "Gross profit over time" chart
// -----------------------------------------------------------------------------
function GrossProfitIllustration() {
  const { tabs, activeTab, yLabels, xLabels, values } = grossProfitPreview;
 
  // Every point is a percentage so the SVG line and the HTML markers line up.
  const points = values.map((value, index) => ({
    x: (index / (values.length - 1)) * 100,
    y: 100 - (6 + value * 0.88),
  }));
  const line = points.map((p, index) => `${index === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L100 100 L0 100 Z`;
 
  return (
    <>
      <div className="absolute left-5 top-1.5 z-10 flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-ink-1 shadow-sm">
        <span className="grid size-4 place-items-center rounded bg-brand-50 text-brand-600">
          <TrendingUp className="size-2.5" />
        </span>
        Gross profit over time
      </div>
 
      <div className="absolute inset-x-3 bottom-0 top-5 rounded-t-lg bg-white shadow-sm">
        <div className="flex justify-end px-3 pt-3">
          <div className="flex rounded-md border border-neutral-200 p-0.5 text-[8px]">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={cn(
                  "rounded px-1.5 py-0.5",
                  tab === activeTab ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-3",
                )}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
 
        <div className="mx-3 mt-1 flex h-[64px] gap-2">
          <div className="flex w-9 flex-col justify-between text-[7px] leading-none text-ink-4">
            {yLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
 
          <div className="relative flex-1">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
              <defs>
                <linearGradient id="gross-profit-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#008c4b" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#008c4b" stopOpacity="0" />
                </linearGradient>
              </defs>
              {yLabels.map((label, index) => (
                <line
                  key={label}
                  x1="0"
                  x2="100"
                  y1={(index / (yLabels.length - 1)) * 100}
                  y2={(index / (yLabels.length - 1)) * 100}
                  stroke="#ececec"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <path d={area} fill="url(#gross-profit-fill)" />
              <path d={line} fill="none" stroke="#008c4b" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
 
            {points.map((point, index) => (
              <span
                key={index}
                className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-500 bg-white"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              />
            ))}
          </div>
        </div>
 
        <div className="ml-12 mr-3 mt-1 flex justify-between text-[7px] text-ink-4">
          {xLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
 
        <div className="mx-3 mt-1.5 flex items-center justify-between text-[8px]">
          <span className="text-ink-3">Gross profit is trending upward this month</span>
          <span className="font-semibold text-brand-600">View Report</span>
        </div>
      </div>
    </>
  );
}
 
// -----------------------------------------------------------------------------
// Multi-Store support — branch selector with a detail card
// -----------------------------------------------------------------------------
function BranchSelectorIllustration() {
  return (
    <>
      <div className="absolute left-[8%] top-3 w-[38%] rounded-lg bg-white p-2 shadow-sm">
        <div className="flex items-center justify-between rounded-md border border-neutral-200 px-2 py-1 text-[9px] text-ink-2">
          Select Branch
          <ChevronDown className="size-3" />
        </div>
        <ul className="mt-1.5 space-y-0.5">
          {branchPreview.map((branch) => (
            <li
              key={branch.name}
              className={cn("flex items-center justify-between rounded px-1.5 py-1", branch.active && "bg-brand-50")}
            >
              <span className="min-w-0">
                <span className="block truncate text-[9px] font-semibold text-ink-1">{branch.name}</span>
                <span className="block truncate text-[7px] text-ink-4">{branch.area}</span>
              </span>
              {branch.active && (
                <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                  <Check className="size-2.5" />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
 
      <div className="absolute left-[40%] top-8 w-[52%] rounded-lg border border-neutral-100 bg-white p-2.5 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-semibold text-ink-1">Lekki Branch</span>
          <span className="rounded-full bg-success-bg px-1.5 py-0.5 text-[7px] font-medium text-success-fg">Active</span>
        </div>
        <div className="mt-1.5 flex gap-3 border-b border-neutral-100 text-[8px] text-ink-3">
          <span className="border-b border-brand-500 pb-1 font-semibold text-brand-700">Details</span>
          <span className="pb-1">Staff</span>
        </div>
        <p className="mt-1.5 text-[8px] font-semibold text-ink-2">Location information</p>
        <dl className="mt-1 space-y-1">
          {branchDetails.map((detail) => (
            <div key={detail.label} className="flex justify-between gap-2 text-[7px]">
              <dt className="text-ink-4">{detail.label}</dt>
              <dd className="truncate text-ink-2">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
 
// -----------------------------------------------------------------------------
// Staff management — user circles around the RIINOX mark, some locked
// -----------------------------------------------------------------------------
const lockedCorners: Record<number, string> = {
  0: "-left-1 -top-1",
  5: "-right-1 -top-1",
  6: "-left-1 -top-1",
  8: "-right-1 -top-1",
};
 
function StaffIllustration() {
  return (
    <div className="mx-auto grid h-full max-w-[290px] grid-cols-3 place-items-center">
      {Array.from({ length: 9 }).map((_, index) => {
        if (index === 4) {
          return (
            <span
              key={index}
              className="grid size-14 place-items-center rounded-full border border-neutral-200 bg-white text-2xl font-black text-brand-500 shadow-md"
            >
              R
            </span>
          );
        }
 
        return (
          <span
            key={index}
            className={cn(
              "relative grid size-12 place-items-center rounded-full bg-neutral-100 text-ink-1",
              index === 3 && "translate-x-5",
              index === 5 && "-translate-x-5",
            )}
          >
            <User className="size-5" strokeWidth={1.5} />
            {lockedCorners[index] && (
              <span
                className={cn(
                  "absolute grid size-5 place-items-center rounded-full border border-neutral-200 bg-white",
                  lockedCorners[index],
                )}
              >
                <Lock className="size-2.5 text-ink-3" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
 
// -----------------------------------------------------------------------------
const illustrations: Record<IllustrationKind, () => React.JSX.Element> = {
  sales: PurchaseOrderIllustration,
  inventory: InventoryIllustration,
  insights: GrossProfitIllustration,
  "multi-store": BranchSelectorIllustration,
  staff: StaffIllustration,
};
 
/** Frame (size, background, spacing) for each illustration. */
const frames: Record<IllustrationKind, string> = {
  sales: "h-[190px] bg-brand-50/70",
  inventory: "h-[190px] bg-brand-50/70",
  insights: "mx-8 mb-8 h-40 rounded-xl bg-brand-50/70",
  "multi-store": "mx-8 mb-8 h-40 rounded-xl bg-brand-50/70",
  staff: "mx-8 mb-6 h-[170px]",
};
 
interface FeatureIllustrationProps {
  kind: IllustrationKind;
  /** Optional Figma export drawn over the coded illustration. */
  image?: string;
  className?: string;
}
 
export function FeatureIllustration({ kind, image, className }: FeatureIllustrationProps) {
  const Illustration = illustrations[kind];
 
  return (
    <div aria-hidden className={cn("relative overflow-hidden", frames[kind], className)}>
      <Illustration />
      {image && <FeatureImage src={image} />}
    </div>
  );
}