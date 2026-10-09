import type { Paginated } from "@/types/shared";
import type {
  ActivityEntry,
  ActivityListParams,
  AuditAction,
  AuditEntry,
  AuditListParams,
} from "./types";

/**
 * Mock for the activity and audit API: lets the UI run without a backend,
 * simulating network latency and the branch-scoping the real endpoints will do.
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_BRANCH_ID = "br_ph";

interface Seed {
  minutesAgo: number;
  userName: string;
  userRole: string;
  action: AuditAction;
  module: string;
  subModule: string;
  description: string;
  summary: string;
  feedAction: string;
  ip: string;
  changes?: { field: string; before: string; after: string }[];
  details?: { label: string; value: string }[];
  linkLabel?: string;
  linkHref?: string;
}

/** Seed entries, shared by the audit log and the activity feed. */
const SEEDS: Seed[] = [
  {
    minutesAgo: 60,
    userName: "Amara Okafor",
    userRole: "Accountant",
    action: "update",
    module: "Transactions",
    subModule: "Invoices",
    description: "Changed INV-088 (Dangote Refinery) from Unpaid to Paid",
    summary: "Changed BILL-S-088 (Dangote Refinery) from Unpaid to Paid",
    feedAction: "changed INV-088 (Dangote Refinery) from Unpaid to Paid",
    ip: "192.168.1.45",
    changes: [
      { field: "Status", before: "Unpaid", after: "Paid" },
      { field: "Amount", before: "₦0.00", after: "₦80,000" },
      { field: "Paid", before: "Not set", after: "29 Sep 2026" },
    ],
    details: [
      { label: "Invoice", value: "INV-088" },
      { label: "Customer", value: "Dangote Refinery" },
      { label: "Status", value: "Unpaid to Paid" },
      { label: "Amount", value: "₦81,500.00" },
    ],
    linkLabel: "Open invoice INV-088",
    linkHref: "/sales/invoices",
  },
  {
    minutesAgo: 95,
    userName: "Tunde Bakare",
    userRole: "Manager",
    action: "create",
    module: "People",
    subModule: "Staff",
    description: "Invited new user musa@company.com",
    summary: "Invited new user Ngozi Eze as Inventory Manager",
    feedAction: "invited new user Ngozi Eze as Inventory Manager",
    ip: "192.168.1.12",
    details: [
      { label: "Name", value: "Ngozi Eze" },
      { label: "Role", value: "Inventory Manager" },
    ],
  },
  {
    minutesAgo: 1_490,
    userName: "System",
    userRole: "Automatic",
    action: "auto_generated",
    module: "Transactions",
    subModule: "Sales Orders",
    description: "Cloned PO-2026-001 to Mrs. B's SO dashboard",
    summary: "Cloned PO-2026-001 to Mrs. B's SO dashboard",
    feedAction: "cloned PO-2026-001 to Mrs. B's SO dashboard",
    ip: "Internal server",
    details: [{ label: "Reference", value: "PO-2026-001" }],
  },
  {
    minutesAgo: 1_585,
    userName: "Amara Okafor",
    userRole: "Accountant",
    action: "update",
    module: "People",
    subModule: "Customers",
    description: "Changed outstanding balance for Coca Cola Ikeja from ₦72,000.00 to ₦57,000.00",
    summary: "Changed outstanding balance for Coca Cola Ikeja",
    feedAction: "changed outstanding balance for Coca Cola Ikeja from ₦72,000.00 to ₦57,000.00",
    ip: "192.168.1.45",
    changes: [{ field: "Balance", before: "₦72,000.00", after: "₦57,000.00" }],
    details: [
      { label: "Customer", value: "Coca Cola Ikeja" },
      { label: "Balance", value: "₦57,000.00" },
    ],
  },
  {
    minutesAgo: 1_665,
    userName: "Funke Adeleke",
    userRole: "Owner",
    action: "delete",
    module: "Inventory",
    subModule: "Products",
    description: "Deleted product Tin Tomato 400g",
    summary: "Deleted product Tin Tomato 400g",
    feedAction: "deleted product Tin Tomato 400g",
    ip: "197.210.54.18",
    details: [{ label: "Product", value: "Tin Tomato 400g" }],
  },
  {
    minutesAgo: 1_863,
    userName: "Tunde Bakare",
    userRole: "Manager",
    action: "update",
    module: "Inventory",
    subModule: "Products",
    description: "Updated 5 fields on Peak Milk Powder 900g",
    summary: "Updated 5 fields on Peak Milk Powder 900g",
    feedAction: "updated 5 fields on Peak Milk Powder 900g",
    ip: "192.168.1.12",
    changes: [
      { field: "Cost price", before: "₦78,000", after: "₦80,000" },
      { field: "Reorder point", before: "40", after: "60" },
    ],
    details: [{ label: "Product", value: "Peak Milk Powder 900g" }],
  },
  {
    minutesAgo: 2_008,
    userName: "Funke Adeleke",
    userRole: "Owner",
    action: "login",
    module: "Settings",
    subModule: "Security",
    description: "Signed in from a new device",
    summary: "Signed in from a new device",
    feedAction: "signed in from a new device",
    ip: "197.210.54.18",
    details: [{ label: "Device", value: "MacBook Pro" }],
  },
  {
    minutesAgo: 2_915,
    userName: "Amara Okafor",
    userRole: "Accountant",
    action: "export",
    module: "Reports",
    subModule: "Stock reports",
    description: "Exported stock report (1 to 27 Sep, CSV)",
    summary: "Exported stock report for September 2026",
    feedAction: "exported stock report for September 2026",
    ip: "192.168.1.45",
    details: [{ label: "Period", value: "September 2026" }],
  },
  {
    minutesAgo: 3_298,
    userName: "Ngozi Eze",
    userRole: "Inventory Manager",
    action: "update",
    module: "Inventory",
    subModule: "Stock",
    description: "Adjusted Peak Milk Powder: 5 tins expired",
    summary: "Adjusted Peak Milk Powder: 5 tins expired",
    feedAction: "adjusted Peak Milk Powder: 5 tins expired",
    ip: "192.168.1.30",
    changes: [{ field: "Quantity", before: "45", after: "40" }],
    details: [{ label: "Product", value: "Peak Milk Powder" }],
  },
  {
    minutesAgo: 4_735,
    userName: "Tunde Bakare",
    userRole: "Manager",
    action: "create",
    module: "People",
    subModule: "Customers",
    description: "Added customer Kokoa Foods",
    summary: "Added customer Kokoa Foods",
    feedAction: "added customer Kokoa Foods",
    ip: "192.168.1.12",
    details: [{ label: "Customer", value: "Kokoa Foods" }],
  },
];

const BRANCH_IDS = ["br_ph", "br_lagos", "br_abuja", "br_kano"];
const BRANCH_NAMES: Record<string, string> = {
  br_ph: "Port Harcourt",
  br_lagos: "Lagos",
  br_abuja: "Abuja",
  br_kano: "Kano",
};

/** Repeats the seeds back through time so the list has enough to paginate. */
function at(index: number) {
  const seed = SEEDS[index % SEEDS.length];
  const cycle = Math.floor(index / SEEDS.length);
  const when = new Date();
  when.setMinutes(when.getMinutes() - seed.minutesAgo - cycle * 1_440);
  const branchId = cycle === 0 ? "br_ph" : BRANCH_IDS[index % BRANCH_IDS.length];
  return { seed, when, branchId };
}

const auditEntries: AuditEntry[] = Array.from({ length: 60 }, (_, index) => {
  const { seed, when, branchId } = at(index);
  return {
    id: `aud_${index + 1}`,
    occurredAt: when.toISOString(),
    userName: seed.userName,
    userRole: seed.userRole,
    action: seed.action,
    module: seed.module,
    subModule: seed.subModule,
    description: seed.description,
    summary: seed.summary,
    ipAddress: seed.ip,
    branchId,
    branchName: BRANCH_NAMES[branchId],
    changes: seed.changes ?? [],
  };
});

const activityEntries: ActivityEntry[] = Array.from({ length: 60 }, (_, index) => {
  const { seed, when, branchId } = at(index);
  return {
    id: `act_${index + 1}`,
    occurredAt: when.toISOString(),
    actor: seed.userName,
    action: seed.feedAction,
    module: seed.module,
    subModule: seed.subModule,
    summary: `${seed.userName} ${seed.feedAction}`,
    userRole: seed.userRole,
    branchName: BRANCH_NAMES[branchId],
    details: seed.details ?? [],
    linkLabel: seed.linkLabel,
    linkHref: seed.linkHref,
  };
});

/** Options offered in the audit log filter. */
export const AUDIT_MODULES = [...new Set(SEEDS.map((seed) => seed.module))].sort();
export const AUDIT_USERS = [...new Set(SEEDS.map((seed) => seed.userName))].sort();

export const activityService = {
  async listAuditEntries(params: AuditListParams = {}): Promise<Paginated<AuditEntry>> {
    await sleep(500);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 15;

    const filtered = auditEntries.filter((entry) => {
      if (params.branchId && entry.branchId !== params.branchId) return false;
      if (params.action && params.action !== "all" && entry.action !== params.action) return false;
      if (params.module && params.module !== "all" && entry.module !== params.module) return false;
      if (params.user && params.user !== "all" && entry.userName !== params.user) return false;

      if (params.period && params.period !== "all") {
        const days = params.period === "today" ? 1 : params.period === "7d" ? 7 : 30;
        const cutoff = Date.now() - days * 86_400_000;
        if (new Date(entry.occurredAt).getTime() < cutoff) return false;
      }
      if (params.search) {
        const needle = params.search.trim().toLowerCase();
        const haystack =
          `${entry.userName} ${entry.description} ${entry.module} ${entry.subModule}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      total: filtered.length,
    };
  },

  async listActivity(params: ActivityListParams = {}): Promise<Paginated<ActivityEntry>> {
    await sleep(500);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const branchId = params.branchId ?? DEFAULT_BRANCH_ID;

    const filtered = activityEntries.filter((entry) => {
      if (branchId && entry.branchName !== BRANCH_NAMES[branchId]) return false;
      if (params.search) {
        const needle = params.search.trim().toLowerCase();
        if (!`${entry.actor} ${entry.action}`.toLowerCase().includes(needle)) return false;
      }
      return true;
    });

    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      total: filtered.length,
    };
  },

  /** Audit entries cannot be edited or deleted, so export is the only write. */
  async exportAuditLog(_params: { from?: string; to?: string; format: string }): Promise<void> {
    await sleep(800);
  },
};
