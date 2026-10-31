export const PERMISSION_ACTIONS = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "approve", label: "Approve" },
  { id: "cancel", label: "Cancel / Archive" },
  { id: "export", label: "Export" },
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]["id"];

export interface PermissionArea {
  id: string;
  label: string;
  /** Actions that apply to this area. Any other column renders as "–". */
  actions: readonly PermissionAction[];
}

const STANDARD: readonly PermissionAction[] = ["view", "create", "edit", "cancel", "export"];

/**
 * Rows of the permissions matrix, in design order.
 * Check the "–" cells against Figma and adjust `actions` here only.
 */
export const PERMISSION_AREAS: readonly PermissionArea[] = [
  { id: "dashboard", label: "Dashboard", actions: ["view", "export"] },
  { id: "sales", label: "Sales", actions: STANDARD },
  { id: "purchasing", label: "Purchasing", actions: ["view", "create", "edit", "approve", "cancel", "export"] },
  { id: "inventory", label: "Inventory", actions: ["view", "create", "edit", "approve", "export"] },
  { id: "customers", label: "Customers", actions: STANDARD },
  { id: "suppliers", label: "Suppliers", actions: STANDARD },
  { id: "invoices", label: "Invoice, Payments & Receipts", actions: STANDARD },
  { id: "reports", label: "Reports", actions: ["view", "export"] },
  { id: "staff", label: "Staff", actions: STANDARD },
  { id: "approvals", label: "Approvals", actions: ["view", "approve"] },
  { id: "activity", label: "Activity & Audit", actions: ["view", "export"] },
  { id: "branches", label: "Branches & Locations", actions: ["view", "create", "edit"] },
];

/** Suggestions for the Role Name dropdown. Users can still type a custom name. */
export const ROLE_NAME_OPTIONS = [
  "Owner",
  "Manager",
  "Sales Representative",
  "Inventory Manager",
  "Inventory Staff",
  "Warehouse Supervisor",
  "Cashier",
  "Accountant",
] as const;

/** Suggestions for the Description dropdown. Users can still type their own. */
export const ROLE_DESCRIPTION_OPTIONS = [
  "Full control of organization",
  "Operations, approvals and reports",
  "Create sales and receipts",
  "Manage inventory approvals",
  "Receive and count stock",
  "Manage invoices and payments",
  "View reports only",
] as const;