"use client";

import { useMemo, useState } from "react";
import {
  ChevronDownIcon,
  DownloadIcon,
  ListFilterIcon,
  LockIcon,
  ScrollTextIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { TextInput } from "@/components/form/app-fields";
import { useBranch } from "@/context/branch-context";
import { BranchSelector } from "@/layout/branch-selector";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import {
  DetailsPanel,
  PanelRow,
  PanelSection,
} from "@/features/activity/components/details-panel";
import {
  activityService,
  AUDIT_MODULES,
  AUDIT_USERS,
} from "@/features/activity/activity.service";
import {
  AUDIT_ACTION_LABELS,
  AUDIT_PERIOD_LABELS,
  type AuditAction,
  type AuditEntry,
  type AuditPeriod,
} from "@/features/activity/types";

const ACTION_VARIANTS: Record<AuditAction, "success" | "warning" | "danger" | "neutral" | "pink"> = {
  create: "success",
  update: "warning",
  delete: "danger",
  login: "neutral",
  auto_generated: "neutral",
  export: "pink",
};

const ACTIONS: AuditAction[] = ["create", "update", "delete", "login", "export", "auto_generated"];
const PERIODS: AuditPeriod[] = ["all", "today", "7d", "30d"];
const FORMATS = ["CSV", "PDF", "XLSX"] as const;

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const clockFormatter = new Intl.DateTimeFormat("en-NG", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** The filter's four dropdowns share one borderless style. */
const filterSelect =
  "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink-1 outline-none transition-colors focus-visible:border-primary";

export default function AuditLogPage() {
  const { activeBranch } = useBranch();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [period, setPeriod] = useState<AuditPeriod>("all");
  const [user, setUser] = useState("all");
  const [moduleName, setModuleName] = useState("all");
  const [action, setAction] = useState<AuditAction | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<AuditEntry | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [range, setRange] = useState<"current" | "custom">("current");
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("CSV");

  const params = useMemo(
    () => ({
      page,
      pageSize: 15,
      search: debouncedSearch || undefined,
      branchId: activeBranch.id,
      period,
      user,
      module: moduleName,
      action,
    }),
    [page, debouncedSearch, activeBranch.id, period, user, moduleName, action],
  );

  const { data, loading, error, refetch } = useAsyncResource(
    JSON.stringify(params),
    () => activityService.listAuditEntries(params),
    "We couldn't load the audit log. Please try again.",
  );

  const entries = data?.data ?? [];
  const total = data?.total ?? 0;
  const activeFilters =
    (period !== "all" ? 1 : 0) +
    (user !== "all" ? 1 : 0) +
    (moduleName !== "all" ? 1 : 0) +
    (action !== "all" ? 1 : 0);
  const hasFilters = Boolean(debouncedSearch) || activeFilters > 0;

  function resetFilters() {
    setSearch("");
    setPeriod("all");
    setUser("all");
    setModuleName("all");
    setAction("all");
    setPage(1);
  }

  async function confirmExport() {
    setExporting(true);
    try {
      await activityService.exportAuditLog({ format });
      toast.add({
        type: "success",
        title: "Export started",
        description: `The audit log will be emailed to you as ${format}.`,
      });
      setExportOpen(false);
    } catch {
      toast.add({ type: "error", title: "Couldn't export", description: "Please try again." });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex min-w-0 gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-ink-1">Audit Log</h1>
            <p className="mt-2 flex items-center gap-2 text-base text-ink-1">
              <LockIcon className="size-4 shrink-0 text-ink-3" />
              A record of who did what and when. Entries cannot be edited or deleted.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <BranchSelector />
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="flex h-8 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted"
            >
              <DownloadIcon className="size-4" />
              Export
            </button>
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 sm:max-w-[620px]">
              <SearchIcon className="size-5 shrink-0 text-ink-4" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search in Audit Log"
                aria-label="Search audit log"
                className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
              />
            </div>

            <div className="self-start sm:self-auto">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger className="flex h-8 items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted">
                  <ListFilterIcon className="size-4" />
                  Filter
                  {activeFilters > 0 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {activeFilters}
                    </span>
                  )}
                  <ChevronDownIcon className="size-4" />
                </PopoverTrigger>
                {/* Four dropdowns that apply as soon as they change. */}
                <PopoverContent align="end" className="w-[260px] gap-3 p-4">
                  <select
                    aria-label="Time period"
                    value={period}
                    onChange={(event) => {
                      setPeriod(event.target.value as AuditPeriod);
                      setPage(1);
                    }}
                    className={filterSelect}
                  >
                    {PERIODS.map((entry) => (
                      <option key={entry} value={entry}>
                        {AUDIT_PERIOD_LABELS[entry]}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="User"
                    value={user}
                    onChange={(event) => {
                      setUser(event.target.value);
                      setPage(1);
                    }}
                    className={filterSelect}
                  >
                    <option value="all">All users</option>
                    {AUDIT_USERS.map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Module"
                    value={moduleName}
                    onChange={(event) => {
                      setModuleName(event.target.value);
                      setPage(1);
                    }}
                    className={filterSelect}
                  >
                    <option value="all">All modules</option>
                    {AUDIT_MODULES.map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Action"
                    value={action}
                    onChange={(event) => {
                      setAction(event.target.value as AuditAction | "all");
                      setPage(1);
                    }}
                    className={filterSelect}
                  >
                    <option value="all">All actions</option>
                    {ACTIONS.map((entry) => (
                      <option key={entry} value={entry}>
                        {AUDIT_ACTION_LABELS[entry]}
                      </option>
                    ))}
                  </select>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {error ? (
            <EmptyState
              icon={TriangleAlertIcon}
              title="We couldn't load the audit log"
              description={error}
              action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
            />
          ) : !loading && entries.length === 0 ? (
            <EmptyState
              icon={ScrollTextIcon}
              title={hasFilters ? "No entries match your filters" : "No audit entries yet"}
              description={
                hasFilters
                  ? "Try a different search term, period, user, module or action."
                  : "Everything people do in the app will be recorded here."
              }
              action={
                hasFilters ? (
                  <SecondaryButton onClick={resetFilters}>Clear filters</SecondaryButton>
                ) : undefined
              }
            />
          ) : (
            <>
              <Table className="min-w-[1040px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[140px]">Timestamp</TableHead>
                    <TableHead className="w-[170px]">User</TableHead>
                    <TableHead className="w-[150px]">Action</TableHead>
                    <TableHead className="w-[160px]">Module</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[140px]">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? Array.from({ length: 15 }).map((_, index) => (
                        <TableRow key={index} className="hover:bg-transparent">
                          {Array.from({ length: 6 }).map((__, cell) => (
                            <TableCell key={cell}>
                              <Skeleton className="h-4 w-full max-w-[120px]" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : entries.map((entry) => {
                        const when = new Date(entry.occurredAt);
                        const isSelected = selected?.id === entry.id;
                        return (
                          <TableRow
                            key={entry.id}
                            onClick={() => setSelected(entry)}
                            aria-selected={isSelected}
                            className={cn("cursor-pointer", isSelected && "bg-accent/40")}
                          >
                            <TableCell className="w-[140px] whitespace-nowrap">
                              <p>{dateFormatter.format(when)},</p>
                              <p className="text-ink-3">{clockFormatter.format(when)}</p>
                            </TableCell>
                            <TableCell className="w-[170px]">
                              <p>{entry.userName}</p>
                              <p className="text-xs text-ink-4">{entry.userRole}</p>
                            </TableCell>
                            <TableCell className="w-[150px]">
                              <Badge variant={ACTION_VARIANTS[entry.action]}>
                                {AUDIT_ACTION_LABELS[entry.action]}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[160px]">
                              <p>{entry.module}</p>
                              <p className="text-xs text-ink-4">{entry.subModule}</p>
                            </TableCell>
                            <TableCell className="min-w-[260px]">{entry.description}</TableCell>
                            <TableCell className="w-[140px] whitespace-nowrap">
                              {entry.ipAddress}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
              <Pagination page={page} pageSize={15} total={total} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>

      <DetailsPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.summary ?? ""}
        subtitle={selected ? `${selected.module}/${selected.subModule}` : ""}
        badge={
          selected && (
            <Badge variant={ACTION_VARIANTS[selected.action]}>
              {AUDIT_ACTION_LABELS[selected.action]}
            </Badge>
          )
        }
      >
        {selected && (
          <>
            <PanelSection title="When and who">
              <PanelRow label="Time" value={new Date(selected.occurredAt).toLocaleString("en-NG")} />
              <PanelRow label="User" value={selected.userName} />
              <PanelRow label="Role" value={selected.userRole} />
              <PanelRow label="IP Address" value={selected.ipAddress} />
              <PanelRow label="Branch" value={selected.branchName} />
            </PanelSection>

            {selected.changes.length > 0 && (
              <section className="mt-6">
                <h3 className="text-sm font-semibold text-ink-1">What Changed</h3>
                <div className="mt-3 overflow-hidden rounded-lg border border-border/70">
                  <div className="grid grid-cols-3 gap-2 bg-surface-muted px-3 py-2 text-[11px] font-semibold text-ink-1">
                    <span>Field</span>
                    <span>Before</span>
                    <span>After</span>
                  </div>
                  {selected.changes.map((change) => (
                    <div
                      key={change.field}
                      className="grid grid-cols-3 gap-2 border-t border-border/50 px-3 py-2 text-[11px]"
                    >
                      <span className="text-ink-2">{change.field}</span>
                      <span className="text-ink-3">{change.before}</span>
                      <span className="font-medium text-ink-1">{change.after}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </DetailsPanel>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent showCloseButton className="gap-0 p-6 sm:max-w-[540px]">
          <DialogTitle className="text-xl font-bold text-ink-1">Export Audit Log</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-ink-3">
            Choose what you want to export
          </DialogDescription>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-ink-1">Date Range</legend>
            <div className="mt-3 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-ink-1">
                <input
                  type="radio"
                  name="export-range"
                  checked={range === "current"}
                  onChange={() => setRange("current")}
                  className="size-4 accent-[var(--primary)]"
                />
                Current view
                <Badge variant="success">Default</Badge>
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-1">
                <input
                  type="radio"
                  name="export-range"
                  checked={range === "custom"}
                  onChange={() => setRange("custom")}
                  className="size-4 accent-[var(--primary)]"
                />
                Custom range
              </label>
            </div>
          </fieldset>

          {range === "custom" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextInput aria-label="From" type="date" />
              <TextInput aria-label="To" type="date" />
            </div>
          )}

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-ink-1">File Format</legend>
            <div className="mt-3 grid grid-cols-3 gap-4">
              {FORMATS.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  aria-pressed={format === entry}
                  onClick={() => setFormat(entry)}
                  className={cn(
                    "h-11 rounded-lg border text-sm font-medium transition-colors",
                    format === entry
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border text-ink-1 hover:bg-surface-muted",
                  )}
                >
                  {entry}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex justify-end gap-3">
            <SecondaryButton onClick={() => setExportOpen(false)} disabled={exporting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={confirmExport} loading={exporting}>
              Export
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
