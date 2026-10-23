"use client";

import { useState } from "react";
import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { FormDialog } from "@/components/common/form-dialog";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddProductDialog } from "@/features/inventory/components/add-product/add-product-dialog";
import "@/features/approvals/approvals.css";

type Status = "Pending" | "Approved" | "Rejected";
type Request = { key: number; id: string; type: string; details: string; location: string; status: Status };
const initialRequests: Request[] = [
  { key: 1, id: "P-00124", type: "Inventory Adjustment", details: "Reduce Rice 25kg Local stock by 5 bags due to damage.", location: "Main Warehouse", status: "Pending" },
  ...[2, 3].map(key => ({ key, id: "CUS-00125", type: "Customer Credit", details: "Sale exceeds customer's credit limit.", location: "Lekki Branch", status: "Pending" as Status })),
  { key: 4, id: "INV-00128", type: "Invoice Cancellation", details: "Order Cancelled", location: "Lekki Branch", status: "Approved" },
  ...[5, 6, 7, 8, 9].map(key => ({ key, id: "REC-00128", type: "Receipt Cancellation", details: "Products refunded", location: "Lekki Branch", status: (key === 9 ? "Rejected" : "Approved") as Status })),
];

export default function ApprovalsPage() {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [summary, setSummary] = useState({ Pending: 5, Approved: 3, Rejected: 1 });
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Request | null>(null);
  const filtered = requests.filter(request => (status === "All statuses" || request.status === status) && `${request.id} ${request.type} ${request.details} Chidi Okafor ${request.location}`.toLowerCase().includes(search.toLowerCase()));
  const visible = filtered.slice((page - 1) * 9, page * 9);
  function decide(nextStatus: Status) {
    if (!selected || selected.status !== "Pending") return;
    setSummary(counts => ({ ...counts, Pending: counts.Pending - 1, [nextStatus]: counts[nextStatus] + 1 }));
    setRequests(rows => rows.map(row => row.key === selected?.key ? { ...row, status: nextStatus } : row));
    setSelected(null);
  }

  return (
    <div className="approvals-page flex min-w-0 flex-col gap-6">
      <TopbarAction><button type="button" onClick={() => setAddProductOpen(true)} className="flex h-12 items-center gap-2 rounded-lg bg-primary px-4 text-base font-bold text-primary-foreground sm:px-6"><Plus className="size-6" /><span>Add Product</span></button></TopbarAction>
      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:min-h-[100px] sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-xl font-semibold">Approvals</h1><p className="mt-2 text-base tracking-[0.14px]">Review requests and authorise important business actions.</p></div>
        <BranchSelector />
      </section>
      <section aria-label="Approval summary" className="grid gap-6 sm:grid-cols-3">
        {[[summary.Pending, "Pending Awaiting a decision"], [summary.Approved, "Approved Last 30 days"], [summary.Rejected, "Rejected Last 30 days"]].map(([value, label]) => <div key={label} className="rounded-lg bg-surface p-5"><p className="text-2xl font-semibold tabular-nums">{value}</p><p className="mt-2 text-xs tracking-[0.18px]">{label}</p></div>)}
      </section>
      <section className="min-w-0 rounded-xl bg-surface p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex h-[42px] w-full items-center gap-3 rounded-lg border border-border px-4 sm:max-w-[633px]"><Search className="size-5 shrink-0 text-ink-4" /><input aria-label="Search approval requests" placeholder="Search by request ID, product, customer, supplier or requester....." value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-4" /></label>
          <button type="button" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)} className="flex h-8 items-center justify-center gap-2 self-start rounded-lg border border-border px-3 text-sm font-semibold text-primary sm:self-auto"><Filter className="size-4" />Filter<ChevronDown className="size-4" /></button>
        </div>
        {showFilters && <label className="mb-5 flex flex-wrap items-center gap-3 text-sm">Status<select value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border bg-surface p-2">{["All statuses", "Pending", "Approved", "Rejected"].map(value => <option key={value}>{value}</option>)}</select></label>}
        <Table className="min-w-[1060px] table-fixed">
          <TableHeader><TableRow>{[["Request ID", "9%"], ["Request Type", "17%"], ["Request Details", "20%"], ["Requested By", "11%"], ["Location", "13%"], ["Date Requested", "13%"], ["Status", "10%"], ["Actions", "7%"]].map(([label, width]) => <TableHead key={label} style={{ width }}>{label}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{visible.map(request => <TableRow key={request.key}>
            <TableCell>{request.id}</TableCell><TableCell>{request.type}</TableCell><TableCell><p className="truncate" title={request.details}>{request.details}</p></TableCell><TableCell>Chidi Okafor</TableCell><TableCell>{request.location}</TableCell><TableCell>12 Oct 2026,<br />09:40</TableCell><TableCell><span className={`approval-status approval-status-${request.status.toLowerCase()}`}>• {request.status}</span></TableCell><TableCell><button type="button" onClick={() => setSelected(request)} className="rounded-lg bg-surface-muted px-2 py-1 text-xs text-ink-3 hover:bg-accent hover:text-primary">Review</button></TableCell>
          </TableRow>)}{!visible.length && <TableRow><TableCell colSpan={8} className="text-center">No requests match your search.</TableCell></TableRow>}</TableBody>
        </Table>
        <Pagination className="mt-4" page={page} pageSize={9} total={filtered.length} onPageChange={setPage} />
      </section>
      <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} />
      <FormDialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }} title="Review request" description={selected?.id} footer={<><Button variant="outline" onClick={() => setSelected(null)}>Close</Button>{selected?.status === "Pending" && <><Button variant="outline" onClick={() => decide("Rejected")}>Reject</Button><Button onClick={() => decide("Approved")}>Approve</Button></>}</>}>
        {selected && <dl className="grid gap-4 text-sm">{[["Request type", selected.type], ["Request details", selected.details], ["Requested by", "Chidi Okafor"], ["Location", selected.location], ["Date requested", "12 Oct 2026, 09:40"], ["Status", selected.status]].map(([label, value]) => <div key={label}><dt className="text-ink-3">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl>}
      </FormDialog>
    </div>
  );
}
