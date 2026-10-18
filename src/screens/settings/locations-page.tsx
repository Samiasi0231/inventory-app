"use client";

import { useMemo, useState } from "react";
import { ListFilterIcon, MapPinIcon, PlusIcon, SearchIcon, TriangleAlertIcon } from "lucide-react";
import { MoreHorizontalIcon } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useAwaitingDesign } from "@/hooks/use-awaiting-design";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { settingsService } from "@/features/settings/settings.service";

const COLUMNS = [
  { id: "name", label: "Location" },
  { id: "code", label: "Code", width: "w-[120px]" },
  { id: "address", label: "Address" },
  { id: "staff", label: "Staff", width: "w-[90px]" },
  { id: "status", label: "Status", width: "w-[130px]" },
  { id: "actions", label: "Actions", width: "w-[90px]" },
];

export default function LocationsPage() {
  const awaitingDesign = useAwaitingDesign();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, loading, error, refetch } = useAsyncResource(
    `locations::${debouncedSearch}`,
    () => settingsService.listLocations(debouncedSearch),
    "We couldn't load your locations. Please try again.",
  );

  const locations = data?.data ?? [];
  const summary = useMemo(
    () => [
      { label: "Total Locations", value: data?.summary.total ?? 0 },
      { label: "Active", value: data?.summary.active ?? 0 },
      { label: "Inactive", value: data?.summary.inactive ?? 0 },
    ],
    [data],
  );

  return (
    <SettingsShell
      title="Branches & Locations"
      description="Manage your busiess locations and their operational setings"
      action={
        <PrimaryButton
          onClick={() => awaitingDesign("Adding a location")}
          leftIcon={<PlusIcon className="size-5" />}
        >
          Add Location
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-6">
        <section className="grid gap-6 sm:grid-cols-3">
          {summary.map((entry) => (
            <div key={entry.label} className="rounded-xl bg-surface p-5">
              <p className="text-sm text-ink-3">{entry.label}</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-10" />
              ) : (
                <p className="mt-2 text-2xl font-semibold text-ink-1">{entry.value}</p>
              )}
            </div>
          ))}
        </section>

        <SettingsCard className="flex min-w-0 flex-col gap-4 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 sm:max-w-[560px]">
              <SearchIcon className="size-5 shrink-0 text-ink-4" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search in Supplier List"
                aria-label="Search locations"
                className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
              />
            </div>

            <SecondaryButton
              onClick={() => awaitingDesign("Filtering locations")}
              leftIcon={<ListFilterIcon className="size-4" />}
              className="h-9 shrink-0"
            >
              Filter
            </SecondaryButton>
          </div>

          {error ? (
            <EmptyState
              icon={TriangleAlertIcon}
              title="We couldn't load your locations"
              description={error}
              action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
            />
          ) : !loading && locations.length === 0 ? (
            <EmptyState
              icon={MapPinIcon}
              title={search ? "No locations match your search" : "No locations yet"}
              description={
                search
                  ? "Try a different name, code or address."
                  : "Branches and warehouses you add will be listed here."
              }
              action={
                search ? (
                  <SecondaryButton onClick={() => setSearch("")}>Clear search</SecondaryButton>
                ) : undefined
              }
            />
          ) : (
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {COLUMNS.map((column) => (
                    <TableHead key={column.id} className={column.width}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <TableRow key={index} className="hover:bg-transparent">
                        {COLUMNS.map((column) => (
                          <TableCell key={column.id} className={column.width}>
                            <Skeleton className="h-4 w-full max-w-[120px]" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : locations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell className="text-ink-1">{location.name}</TableCell>
                        <TableCell className="w-[120px]">{location.code}</TableCell>
                        <TableCell className="max-w-0 truncate" title={location.address}>
                          {location.address}
                        </TableCell>
                        <TableCell className="w-[90px]">{location.staffCount}</TableCell>
                        <TableCell className="w-[130px]">
                          <Badge
                            variant={location.status === "active" ? "success" : "neutral"}
                            dot
                          >
                            {location.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-[90px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label={`Actions for ${location.name}`}
                              className="rounded-md px-2 py-1 text-ink-3 transition-colors hover:bg-surface-muted"
                            >
                              <MoreHorizontalIcon className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => awaitingDesign("Viewing location details")}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => awaitingDesign("Editing a location")}
                              >
                                Edit Location
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => awaitingDesign("Viewing location staff")}
                              >
                                View Staff
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          )}
        </SettingsCard>
      </div>
    </SettingsShell>
  );
}
