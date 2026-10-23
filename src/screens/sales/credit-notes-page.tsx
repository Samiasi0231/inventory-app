"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  Undo2Icon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { FormDialog } from "@/components/common/form-dialog";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { formatCurrency } from "@/lib/format";

const CREDIT_NOTES = [{
  number: "CN-0001",
  issued: "21 Sept 2026",
  invoice: "INV-2026-0032",
  customer: "Walk-in customer",
  item: "Kings Vegetable Oil (5 L)",
  value: 55_000,
  settlement: "Cash refund",
  status: "Pending",
}];

export default function CreditNotesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<"details" | "return" | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");

  const notes = useMemo(() => CREDIT_NOTES.filter((note) =>
    Object.values(note).join(" ").toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TopbarAction>
        <PrimaryButton onClick={() => router.push("/sales/new")} leftIcon={<PlusIcon className="size-5" />} className="h-12 px-6 text-base">
          <span className="hidden sm:inline">Add New Sales</span><span className="sm:hidden">New</span>
        </PrimaryButton>
      </TopbarAction>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink-1">Credit notes</h1>
          <p className="mt-2 text-base text-ink-1">Every return against an invoice, with what the customer got back. Returns from sales staff wait for a manager.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2"><BranchSelector /><button className="flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-bold text-primary"><DownloadIcon className="size-4" />Export</button></div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <Summary value="1" label="Credit notes issued" />
        <Summary value={formatCurrency(82_000)} label="Total credited" bordered />
        <Summary value="0" label="Awaiting approval" />
      </section>

      <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
        <div className="flex h-[42px] w-full max-w-[633px] items-center gap-2 rounded-lg border border-border px-4">
          <SearchIcon className="size-5 text-ink-4" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search in Items" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-4" />
        </div>
        <Table className="min-w-[980px]">
          <TableHeader><TableRow>{["Credit note","Issued","Invoice","Customer","Items","Value","Settled as","Status","Actions"].map((h) => <TableHead key={h} className={h === "Actions" ? "text-center" : ""}>{h}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{notes.map((note) => <TableRow key={note.number}>
            <TableCell>{note.number}</TableCell><TableCell>{note.issued}</TableCell><TableCell>{note.invoice}</TableCell><TableCell>{note.customer}</TableCell><TableCell>{note.item}</TableCell><TableCell>{formatCurrency(note.value)}</TableCell><TableCell>{note.settlement}</TableCell>
            <TableCell><span className="text-destructive">• {note.status}</span></TableCell>
            <TableCell className="text-center"><DropdownMenu><DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-surface-muted"><MoreHorizontalIcon className="size-5" /></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setDialog("details")}><EyeIcon />View Details</DropdownMenuItem><DropdownMenuItem onClick={() => setDialog("return")}><Undo2Icon />Return items</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
          </TableRow>)}</TableBody>
        </Table>
        <Pagination page={1} pageSize={15} total={notes.length} onPageChange={() => {}} />
      </section>

      <FormDialog open={dialog === "details"} onOpenChange={(open) => setDialog(open ? "details" : null)} title="Credit note details" description="CN-0001" footer={<PrimaryButton onClick={() => setDialog("return")}>Return items</PrimaryButton>}>
        <dl className="grid gap-5 sm:grid-cols-2">{[["Invoice","INV-2026-0032"],["Customer","Walk-in customer"],["Item","Kings Vegetable Oil (5 L)"],["Value",formatCurrency(55_000)],["Settled as","Cash refund"],["Status","Pending"]].map(([k,v]) => <div key={k}><dt className="text-xs text-ink-3">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>)}</dl>
      </FormDialog>

      <FormDialog open={dialog === "return"} onOpenChange={(open) => setDialog(open ? "return" : null)} title="Return items" footer={<><SecondaryButton onClick={() => setDialog(null)}>Cancel</SecondaryButton><PrimaryButton onClick={() => setDialog(null)}>Record return</PrimaryButton></>}>
        <p className="mb-6 text-sm text-ink-2">INV-2026-0032. Your role can approve returns, so this takes effect immediately.</p>
        <div className="mb-6 grid grid-cols-1 items-end gap-4 rounded-xl border border-border p-4 sm:grid-cols-[1fr_120px_1.1fr]">
          <div><p className="mb-4 text-sm font-semibold">Item</p><p className="text-base">Indomie chicken</p></div>
          <Field label="Qty"><TextInput min="1" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Field>
          <Field label="Condition"><SelectInput defaultValue="resalable"><option value="resalable">Resalable</option><option value="damaged">Damaged</option></SelectInput></Field>
        </div>
        <div className="space-y-6">
          <Field label="Reason"><TextInput value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is the customer returning this?" /></Field>
          <Field label="Give the customer" hint="Only applies to money already paid. Unpaid balances are simply reduced."><SelectInput defaultValue="refund"><option value="refund">A refund</option><option value="credit">Store credit</option></SelectInput></Field>
        </div>
      </FormDialog>
    </div>
  );
}

function Summary({ value, label, bordered = false }: { value: string; label: string; bordered?: boolean }) {
  return <div className={`min-h-[130px] rounded-xl bg-surface p-5 ${bordered ? "sm:rounded-none sm:border-x sm:border-border" : ""}`}><p className="mt-4 text-2xl font-semibold">{value}</p><p className="mt-3 text-sm text-ink-3">{label}</p></div>;
}
