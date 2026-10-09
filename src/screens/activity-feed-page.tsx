"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ActivityIcon, SearchIcon, TriangleAlertIcon } from "lucide-react";
import { SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranch } from "@/context/branch-context";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import {
  DetailsPanel,
  PanelRow,
  PanelSection,
} from "@/features/activity/components/details-panel";
import { activityService } from "@/features/activity/activity.service";
import { groupActivityByDay, type ActivityEntry } from "@/features/activity/types";

const clockFormatter = new Intl.DateTimeFormat("en-NG", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/** Today reads as "1 hr ago"; anything older shows the clock time. */
function formatWhen(value: string) {
  const date = new Date(value);

  if (isToday(date)) {
    const minutesAgo = Math.max(0, Math.round((Date.now() - date.getTime()) / 60_000));
    if (minutesAgo < 1) return "just now";
    if (minutesAgo < 60) return `${minutesAgo} min ago`;
    const hours = Math.round(minutesAgo / 60);
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  return `${clockFormatter.format(date)}${date.getHours() < 12 ? "am" : "pm"}`;
}

export default function ActivityFeedPage() {
  const router = useRouter();
  const { activeBranch } = useBranch();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [selected, setSelected] = useState<ActivityEntry | null>(null);

  const params = useMemo(
    () => ({
      page: 1,
      pageSize: 40,
      search: debouncedSearch || undefined,
      branchId: activeBranch.id,
    }),
    [debouncedSearch, activeBranch.id],
  );

  const { data, loading, error, refetch } = useAsyncResource(
    JSON.stringify(params),
    () => activityService.listActivity(params),
    "We couldn't load the activity feed. Please try again.",
  );

  const entries = data?.data ?? [];
  const groups = groupActivityByDay(entries);

  return (
    <div className="flex min-w-0 gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <section className="rounded-xl bg-surface p-5">
          <h1 className="text-xl font-semibold text-ink-1">Activity Feed</h1>
          <p className="mt-2 text-base text-ink-1">See what is happening across your business.</p>
        </section>

        <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
          <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 lg:max-w-[780px]">
            <SearchIcon className="size-5 shrink-0 text-ink-4" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search in Activity Feed"
              aria-label="Search activity feed"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          {error ? (
            <EmptyState
              icon={TriangleAlertIcon}
              title="We couldn't load the activity feed"
              description={error}
              action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
            />
          ) : loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              icon={ActivityIcon}
              title={search ? "No activity matches your search" : "Nothing has happened yet"}
              description={
                search
                  ? "Try a different name or action."
                  : "Sales, stock movements and changes will appear here as they happen."
              }
              action={
                search ? (
                  <SecondaryButton onClick={() => setSearch("")}>Clear search</SecondaryButton>
                ) : undefined
              }
            />
          ) : (
            // Date bands run the full width of the card, so break out of its padding.
            <div className="-mx-5 -mb-5 flex flex-col overflow-hidden rounded-b-xl">
              {groups.map((group) => (
                <section key={group.label}>
                  <h2 className="bg-surface-muted px-5 py-2.5 text-xs font-medium text-ink-2">
                    {group.label}
                  </h2>
                  <ul>
                    {group.entries.map((entry) => {
                      const isSelected = selected?.id === entry.id;
                      return (
                        <li key={entry.id} className="px-5">
                          <button
                            type="button"
                            onClick={() => setSelected(entry)}
                            aria-current={isSelected ? "true" : undefined}
                            className={cn(
                              "w-full border-b border-border/50 py-3.5 text-left transition-colors hover:bg-surface-muted/50",
                              isSelected && "bg-accent/40",
                            )}
                          >
                            <p className="text-sm text-ink-2">
                              <span className="font-semibold text-ink-1">{entry.actor}</span>{" "}
                              {entry.action}
                            </p>
                            <p className="mt-1 text-[11px] text-ink-4">
                              {entry.module} / {entry.subModule} • {formatWhen(entry.occurredAt)}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </section>
      </div>

      <DetailsPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.summary ?? ""}
        subtitle={selected ? `${selected.module} / ${selected.subModule}` : ""}
      >
        {selected && (
          <>
            <PanelSection title="When and who">
              <PanelRow label="Time" value={new Date(selected.occurredAt).toLocaleString("en-NG")} />
              <PanelRow label="User" value={selected.actor} />
              <PanelRow label="Role" value={selected.userRole} />
              <PanelRow label="Branch" value={selected.branchName} />
            </PanelSection>

            {selected.details.length > 0 && (
              <PanelSection title="Details">
                {selected.details.map((detail) => (
                  <PanelRow key={detail.label} label={detail.label} value={detail.value} />
                ))}
              </PanelSection>
            )}

            {selected.linkLabel && selected.linkHref && (
              <button
                type="button"
                onClick={() => router.push(selected.linkHref!)}
                className="mt-6 w-fit text-sm font-medium text-ink-1 underline underline-offset-4 transition-colors hover:text-primary"
              >
                {selected.linkLabel}
              </button>
            )}
          </>
        )}
      </DetailsPanel>
    </div>
  );
}
