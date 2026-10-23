"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  FilterIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
} from "lucide-react";
import { SelectInput, TextInput } from "@/components/form/app-fields";
import { RowActionsMenu } from "@/components/common/row-action-menu";
import { ConfirmModal } from "@/components/common/confirm-modal";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { useSavedSettings } from "@/features/settings/hooks/use-saved-settings";

const defaults = [
  {
    name: "Cream Crackers",
    type: "Product",
    by: "Inventory Manager",
    location: "Main Warehouse",
  },
  {
    name: "Pet coke",
    type: "Product",
    by: "Inventory Manager",
    location: "Lekki Branch",
  },
  {
    name: "Ayoola Oil",
    type: "Product",
    by: "Inventory Manager",
    location: "Lekki Branch",
  },
  { name: "Jane Doe", type: "Staff", by: "Owner", location: "Lekki Branch" },
  {
    name: "Abc Suppliers",
    type: "Supplier",
    by: "Owner",
    location: "Lekki Branch",
  },
  {
    name: "Nasco Limited",
    type: "Supplier",
    by: "Owner",
    location: "Lekki Branch",
  },
  {
    name: "Bangote Limited",
    type: "Supplier",
    by: "Owner",
    location: "Lekki Branch",
  },
  {
    name: "Rufus Joe",
    type: "Customer",
    by: "Owner",
    location: "Lekki Branch",
  },
  { name: "Liam Miam", type: "Staff", by: "Owner", location: "Lekki Branch" },
];

export default function ArchiveSettingsPage() {
  const saved = useSavedSettings("archive", defaults);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [type, setType] = useState("All records");
  const [location, setLocation] = useState("All locations");
  const [restore, setRestore] = useState<string | null>(null);
  const toast = useToast();
  const rows = saved.value.filter(
    (row) =>
      `${row.name} ${row.type} ${row.by} ${row.location}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()) &&
      (type === "All records" || row.type === type) &&
      (location === "All locations" || row.location === location),
  );
  return (
    <SettingsShell
      title="Archive"
      description="Archive records leave active list but keep their full history. Restoring never changes their details"
      action={
        <Link href="/settings/locations" className="settings-primary-link">
          <PlusIcon size={24} strokeWidth={1.5} />
          Add Location
        </Link>
      }
    >
      <SettingsCard>
        <div className="settings-archive-toolbar">
          <div className="settings-search">
            <SearchIcon size={20} strokeWidth={1.5} />
            <TextInput
              aria-label="Search archived records"
              placeholder="Search in Supplier List"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            aria-expanded={filterOpen}
            aria-controls="archive-filters"
            className="settings-filter"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <FilterIcon size={14} />
            Filter
            <ChevronDownIcon size={14} />
          </button>
        </div>
        {filterOpen && (
          <div className="settings-archive-filters" id="archive-filters">
            <SelectInput
              aria-label="Record type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {["All records", "Product", "Staff", "Supplier", "Customer"].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </SelectInput>
            <SelectInput
              aria-label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {["All locations", "Main Warehouse", "Lekki Branch"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </SelectInput>
            <button
              type="button"
              onClick={() => {
                setType("All records");
                setLocation("All locations");
                setSearch("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        <Table className="settings-table settings-archive-table">
          <TableHeader>
            <TableRow>
              {[
                "Record",
                "Request Type",
                "Archived By",
                "Location",
                "Date Requested",
                "Actions",
              ].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.by}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>12 Oct 2026, 09:40</TableCell>
                <TableCell>
                  <RowActionsMenu
                    ariaLabel={`Actions for ${row.name}`}
                    items={[
                      {
                        key: "restore",
                        label: "Restore record",
                        icon: <RotateCcwIcon size={14} />,
                        onSelect: () => setRestore(row.name),
                      },
                      {
                        key: "view",
                        label: `View ${row.type.toLowerCase()} list`,
                        icon: <ArrowUpRightIcon size={14} />,
                        onSelect: () => {
                          window.location.href =
                            row.type === "Product"
                              ? "/inventory/products"
                              : `/people/${row.type === "Staff" ? "staff" : row.type === "Supplier" ? "suppliers" : "customers"}`;
                        },
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No archived records match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SettingsCard>
      <ConfirmModal
        open={restore !== null}
        onClose={() => setRestore(null)}
        title="Restore record?"
        description={`${restore ?? "This record"} will return to the active list with its history and details preserved.`}
        note="This updates the local demo archive."
        icon={<RotateCcwIcon size={18} />}
        confirmLabel="Restore record"
        onConfirm={() => {
          try {
            saved.save(saved.value.filter((row) => row.name !== restore));
            toast.add({
              type: "success",
              title: "Record restored in demo archive",
            });
          } catch {
            toast.add({ type: "error", title: "Couldn't restore record" });
            return false;
          }
        }}
      />
    </SettingsShell>
  );
}
