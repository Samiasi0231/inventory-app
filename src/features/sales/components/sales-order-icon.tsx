import type { SVGProps } from "react";

export type SalesIconName = "refresh" | "reject" | "invoices" | "view" | "invoice" | "receipt" | "returns" | "payment" | "send" | "cancel" | "accept" | "changes" | "filter" | "chevron" | "sales" | "collected" | "outstanding" | "profit";
const paths: Record<SalesIconName, React.ReactNode> = {
  refresh: <><path d="M3 9a9 9 0 0 1 16-3l2 3M21 3v6h-6M21 15a9 9 0 0 1-16 3l-2-3m0 6v-6h6"/></>,
  reject: <><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></>,
  invoices: <><rect x="4" y="3" width="16" height="19" rx="2"/><path d="M9 1v4m6-4v4M8 10h8m-8 4h8"/></>,
  view: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  invoice: <><path d="m7 2 13 3-4 17-13-3Z"/><path d="m9 6 7 1.5M8 9l7 1.5M7 12l6 1.5"/></>,
  receipt: <><path d="M3 3h18v18l-3-2-3 2-3-2-3 2-3-2-3 2Z"/><path d="M7 7h10M7 11h10M7 15h6"/></>,
  returns: <><path d="M8 5 3 10l5 5M3 10h12a6 6 0 0 1 0 12" transform="translate(0 -3)"/></>,
  payment: <><rect x="2" y="5" width="20" height="14" rx="1"/><path d="M2 9h20M5 15h3m3 0h2"/></>,
  send: <><path d="m12 2 3 2 4 1 1 4 2 3-2 3-1 4-4 1-3 2-3-2-4-1-1-4-2-3 2-3 1-4 4-1Z"/><path d="m8 12 3 3 5-6"/></>,
  cancel: <><path d="M5 2h9l5 5v15H5Z M14 2v6h5M9 12l6 6m0-6-6 6"/></>,
  accept: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  changes: <><path d="M3 5h17v9H10m6-13 4 4-4 4M21 19H4v-9h10M8 15l-4 4 4 4"/></>,
  filter: <path d="M3 4h18l-7 8v8l-4-2v-6Z"/>,
  chevron: <path d="m5 9 7 7 7-7"/>,
  sales: <><path d="M12 2v20M7 22h10M3 6l9-2 9 2M5 6l-4 9h8Zm14 0-4 9h8Z"/></>,
  collected: <><path d="M4 9a8 8 0 0 1 14-3l4 1v7l-3 1-2 5h-3l-1-3H8l-1 3H4l-1-6-2-2V9Zm5-4h5"/><circle cx="17" cy="9" r=".5"/></>,
  outstanding: <><path d="M2 15h4v7H2Zm4 1h4l3-2h5a2 2 0 0 1 0 4h-5m-7 3h10l6-5M14 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5-2 3 3-3 3"/></>,
  profit: <><path d="M2 22h20M4 22V12h4v10m2 0V7h4v15m2 0V2h4v20"/></>,
};
export function SalesOrderIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: SalesIconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
