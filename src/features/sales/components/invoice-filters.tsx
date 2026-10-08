"use client";

import { useState } from "react";
import { ChevronDownIcon, ListFilterIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
import { INVOICE_STATUS_LABELS, type InvoiceStatus, type PartyType } from "../types";

export interface InvoiceFilterState {
  status: InvoiceStatus | "all";
  partyType: PartyType | "all";
  issuedFrom: string;
  dueBefore: string;
}

export const DEFAULT_INVOICE_FILTERS: InvoiceFilterState = {
  status: "all",
  partyType: "all",
  issuedFrom: "",
  dueBefore: "",
};

export function countActiveFilters(value: InvoiceFilterState) {
  return (
    (value.status !== "all" ? 1 : 0) +
    (value.partyType !== "all" ? 1 : 0) +
    (value.issuedFrom ? 1 : 0) +
    (value.dueBefore ? 1 : 0)
  );
}

interface InvoiceFiltersProps {
  value: InvoiceFilterState;
  onChange: (value: InvoiceFilterState) => void;
}

export function InvoiceFilters({ value, onChange }: InvoiceFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const active = countActiveFilters(value);

  function openChange(nextOpen: boolean) {
    // Re-sync the draft each time it opens so a cancelled edit is dropped.
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  }

  return (
    <Popover open={open} onOpenChange={openChange}>
      <PopoverTrigger className="flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted">
        <ListFilterIcon className="size-4" />
        Filter
        {active > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {active}
          </span>
        )}
        <ChevronDownIcon className="size-4" />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[420px] max-w-[calc(100vw-2rem)] p-5">
        <div className="flex flex-col gap-4">
          <p className="text-base font-semibold text-ink-1">Filter</p>
          <p className="-mt-3 text-sm text-ink-3">Filter invoice by…</p>

          <Field label="Status" htmlFor="filter-status">
            <SelectInput
              id="filter-status"
              value={draft.status}
              onChange={(event) =>
                setDraft({ ...draft, status: event.target.value as InvoiceStatus | "all" })
              }
            >
              <option value="all">All statuses</option>
              {(Object.keys(INVOICE_STATUS_LABELS) as InvoiceStatus[]).map((status) => (
                <option key={status} value={status}>
                  {INVOICE_STATUS_LABELS[status]}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Type" htmlFor="filter-type">
            <SelectInput
              id="filter-type"
              value={draft.partyType}
              onChange={(event) =>
                setDraft({ ...draft, partyType: event.target.value as PartyType | "all" })
              }
            >
              <option value="all">Customer or Supplier</option>
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </SelectInput>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date Issued" htmlFor="filter-issued">
              <TextInput
                id="filter-issued"
                type="date"
                value={draft.issuedFrom}
                onChange={(event) => setDraft({ ...draft, issuedFrom: event.target.value })}
              />
            </Field>
            <Field label="Date Due" htmlFor="filter-due">
              <TextInput
                id="filter-due"
                type="date"
                value={draft.dueBefore}
                onChange={(event) => setDraft({ ...draft, dueBefore: event.target.value })}
              />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-2">
            {active > 0 && (
              <SecondaryButton
                className="h-10"
                onClick={() => {
                  setDraft(DEFAULT_INVOICE_FILTERS);
                  onChange(DEFAULT_INVOICE_FILTERS);
                  setOpen(false);
                }}
              >
                Clear
              </SecondaryButton>
            )}
            <PrimaryButton
              className="h-10 px-6"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              Add
            </PrimaryButton>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
