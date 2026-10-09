import type { ID, ISODateString, ListParams } from "@/types/shared";

/** What a person (or the system) did to a record. */
export type AuditAction = "create" | "update" | "delete" | "login" | "export" | "auto_generated";

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  create: "Create",
  update: "Update",
  delete: "Delete",
  login: "Login",
  export: "Export",
  auto_generated: "Auto-generated",
};

/** A single before/after pair shown in the entry's "What Changed" table. */
export interface AuditFieldChange {
  field: string;
  before: string;
  after: string;
}

export interface AuditEntry {
  id: ID;
  occurredAt: ISODateString;
  userName: string;
  userRole: string;
  action: AuditAction;
  /** Where it happened, e.g. "Transactions" / "Invoices". */
  module: string;
  subModule: string;
  description: string;
  /** Headline shown at the top of the details panel. */
  summary: string;
  ipAddress: string;
  branchId: ID;
  branchName: string;
  changes: AuditFieldChange[];
}

/** Time window offered by the audit log's "All time" filter. */
export type AuditPeriod = "all" | "today" | "7d" | "30d";

export const AUDIT_PERIOD_LABELS: Record<AuditPeriod, string> = {
  all: "All time",
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

export interface AuditListParams extends ListParams {
  branchId?: ID;
  action?: AuditAction | "all";
  module?: string | "all";
  user?: string | "all";
  period?: AuditPeriod;
}

/* -- Activity feed --------------------------------------------------------- */

/** One labelled value in the feed panel's "Details" list. */
export interface ActivityDetail {
  label: string;
  value: string;
}

export interface ActivityEntry {
  id: ID;
  occurredAt: ISODateString;
  /** Rendered in bold before the action text. */
  actor: string;
  /** The sentence that follows the actor, e.g. "changed INV-088 …". */
  action: string;
  module: string;
  subModule: string;
  summary: string;
  userRole: string;
  branchName: string;
  details: ActivityDetail[];
  /** Deep link out of the feed, e.g. "Open invoice INV-088". */
  linkLabel?: string;
  linkHref?: string;
}

export interface ActivityListParams extends ListParams {
  branchId?: ID;
}

/** Entries bucketed under "Today", "Yesterday" or a date, newest first. */
export interface ActivityGroup {
  label: string;
  entries: ActivityEntry[];
}

const groupDateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function groupActivityByDay(entries: ActivityEntry[]): ActivityGroup[] {
  const startOfDay = (input: Date) =>
    new Date(input.getFullYear(), input.getMonth(), input.getDate()).getTime();
  const today = startOfDay(new Date());

  const groups = new Map<string, ActivityEntry[]>();

  for (const entry of entries) {
    const when = new Date(entry.occurredAt);
    const daysAgo = Math.round((today - startOfDay(when)) / 86_400_000);
    const label =
      daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : groupDateFormatter.format(when);

    const bucket = groups.get(label);
    if (bucket) bucket.push(entry);
    else groups.set(label, [entry]);
  }

  return [...groups.entries()].map(([label, grouped]) => ({ label, entries: grouped }));
}
