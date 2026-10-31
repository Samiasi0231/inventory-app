import type { ID } from "@/types/shared";
import type {
  ApprovalRule,
  BusinessLocation,
  BusinessProfile,
  ProductSettings,
  StaffRole,
} from "./types";
import type { RoleDetail, RolePayload, RolePermissions } from "@/types/role-types";
import { PERMISSION_AREAS } from "@/types/permission-config";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let profile: BusinessProfile = {
  businessName: "Lagos Wholesale Depot",
  legalName: "Lagos Wholesale Depot Ltd",
  businessType: "Wholesale",
  registrationNumber: "RC 1234567",
  email: "info@lagoswholesale.com",
  phone: "+234 801 234 5678",
  city: "Ikeja",
  state: "Lagos",
  address: "12 Broad Street, Lagos Island, Lagos",
  country: "Nigeria",
  currency: "Naira (₦)",
};

let locations: BusinessLocation[] = [
  {
    id: "loc_main",
    name: "Main Warehouse",
    code: "Main",
    address: "12, Marina Road, Lagos Island",
    staffCount: 4,
    status: "active",
  },
  {
    id: "loc_lekki",
    name: "Lekki Branch",
    code: "Lek",
    address: "Admirality Way, Lekki Phase 1",
    staffCount: 2,
    status: "inactive",
  },
  {
    id: "loc_ikeja",
    name: "Ikeja Branch",
    code: "Ike",
    address: "Obafemi Awolowo Way, Ikeja",
    staffCount: 2,
    status: "active",
  },
  {
    id: "loc_ph",
    name: "Port Harcourt Store",
    code: "PHC",
    address: "45 Aba Road, Port Harcourt",
    staffCount: 3,
    status: "active",
  },
];

let roles: StaffRole[] = [
  { id: "role_owner", name: "Owner", description: "Full control of organization", staffCount: 1, type: "system" },
  { id: "role_manager", name: "Manager", description: "Operations, approvals and reports", staffCount: 1, type: "system" },
  { id: "role_sales", name: "Sales Representative", description: "Create sales and reciepts", staffCount: 4, type: "system" },
  { id: "role_inv_mgr", name: "Inventory Manager", description: "Manage inventory approvals", staffCount: 2, type: "system" },
  { id: "role_inv_staff", name: "Inventory Staff", description: "Receive and count stock", staffCount: 4, type: "system" },
  { id: "role_warehouse", name: "Warehouse  Supervisor", description: "Receive and count stock", staffCount: 4, type: "custom" },
];

// Permissions per role (mock). Owner gets every action the matrix allows.
const ownerPermissions: RolePermissions = Object.fromEntries(
  PERMISSION_AREAS.map((area) => [area.id, [...area.actions]]),
);

let rolePermissions: Record<ID, RolePermissions> = {
  role_owner: ownerPermissions,
  role_manager: {
    dashboard: ["view", "export"],
    sales: ["view", "create", "edit", "export"],
    purchasing: ["view", "create", "edit", "export"],
    inventory: ["view", "create", "edit", "export"],
    reports: ["view", "export"],
    approvals: ["view", "approve"],
  },
  role_sales: {
    sales: ["view", "create"],
    customers: ["view", "create"],
    invoices: ["view", "create"],
  },
  role_inv_mgr: {
    inventory: ["view", "create", "edit", "cancel", "export"],
    approvals: ["view", "approve"],
  },
  role_inv_staff: {
    inventory: ["view", "create"],
  },
  role_warehouse: {
    inventory: ["view", "create", "edit"],
    suppliers: ["view"],
  },
};

let approvalRules: ApprovalRule[] = [
  {
    id: "rule_inventory",
    name: "Inventory Adjustments",
    description: "Stock quantity changes that require authorization.",
    enabled: true,
    condition: "Quantity above threshold",
    threshold: "10",
    thresholdUnit: "units",
    appliesTo: "All",
    approver: "Manager",
  },
  {
    id: "rule_price",
    name: "Price Changes",
    description: "Changes to a product's selling price.",
    enabled: true,
    condition: "Any change to a selling price",
    appliesTo: "All",
    approver: "Manager",
  },
  {
    id: "rule_cancellations",
    name: "Invoice & Receipt Cancellations",
    description: "Cancellation of an issued invoice or receipt.",
    enabled: true,
    condition: "Every cancellation",
    appliesTo: "All",
    approver: "Administrator",
  },
  {
    id: "rule_discounts",
    name: "Large Sales Discounts",
    description: "Discounts above the permitted threshold.",
    enabled: true,
    condition: "Discount above threshold",
    threshold: "5",
    thresholdUnit: "percent",
    appliesTo: "All",
    approver: "Manager",
  },
  {
    id: "rule_credit",
    name: "Customer Credit",
    description: "Transactions that exceed the customer's credit limit.",
    enabled: true,
    condition: "Exceeds assigned credit limit",
    appliesTo: "All",
    approver: "Manager",
  },
  {
    id: "rule_returns",
    name: "Returns",
    description: "Returns that require review before processing.",
    enabled: true,
    condition: "Every return",
    appliesTo: "All",
    approver: "Manager",
  },
  {
    id: "rule_writeoffs",
    name: "Write-offs",
    description: "Stock written off as damaged, lost or unusable.",
    enabled: true,
    condition: "Every write-off",
    appliesTo: "All",
    approver: "Owner",
  },
  {
    id: "rule_purchase_orders",
    name: "Purchase Orders",
    description: "Purchase orders above the configured value.",
    enabled: false,
    condition: "Order total above threshold",
    threshold: "500000",
    thresholdUnit: "currency",
    appliesTo: "Main Warehouse",
    approver: "Manager",
  },
];

let productSettings: ProductSettings = {
  skuGeneration: "Automatic - prefix + sequence",
  skuPrefix: "LWD",
  barcodeSupport: true,
  stockAlerts: true,
  outOfStockNotifications: true,
  stockVarianceNotifications: true,
  expiryAlerts: true,
  expiryAlertDays: "60",
  batchTracking: true,
  stockTransfers: true,
  insufficientStockAction: "Block the sale",
};

export interface LocationSummary {
  total: number;
  active: number;
  inactive: number;
}

export const settingsService = {
  async getBusinessProfile(): Promise<BusinessProfile> {
    await sleep(400);
    return profile;
  },

  async updateBusinessProfile(payload: BusinessProfile): Promise<BusinessProfile> {
    await sleep(700);
    profile = payload;
    return profile;
  },

  async listLocations(search?: string): Promise<{
    data: BusinessLocation[];
    summary: LocationSummary;
  }> {
    await sleep(450);
    const needle = search?.trim().toLowerCase();
    const data = needle
      ? locations.filter((entry) =>
          `${entry.name} ${entry.code} ${entry.address}`.toLowerCase().includes(needle),
        )
      : locations;

    return {
      data,
      summary: {
        total: locations.length,
        active: locations.filter((entry) => entry.status === "active").length,
        inactive: locations.filter((entry) => entry.status === "inactive").length,
      },
    };
  },

  async setLocationStatus(id: ID, status: BusinessLocation["status"]): Promise<void> {
    await sleep(500);
    locations = locations.map((entry) => (entry.id === id ? { ...entry, status } : entry));
  },

  async listRoles(): Promise<StaffRole[]> {
    await sleep(450);
    return roles;
  },

  async getRole(id: ID): Promise<RoleDetail> {
    await sleep(350);
    const role = roles.find((entry) => entry.id === id);
    if (!role) throw new Error("Role not found");
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      type: role.type,
      permissions: rolePermissions[id] ?? {},
    };
  },

  async createRole(payload: RolePayload): Promise<RoleDetail> {
    await sleep(700);
    const role: StaffRole = {
      id: `role_${Date.now()}`,
      name: payload.name,
      description: payload.description ?? "",
      staffCount: 0,
      type: "custom",
    };
    roles = [...roles, role];
    rolePermissions = { ...rolePermissions, [role.id]: payload.permissions };
    return { ...role, permissions: payload.permissions };
  },

  async updateRole(id: ID, payload: RolePayload): Promise<RoleDetail> {
    await sleep(700);
    const existing = roles.find((entry) => entry.id === id);
    if (!existing) throw new Error("Role not found");
    if (existing.type === "system") throw new Error("System roles can't be edited");
    const updated: StaffRole = {
      ...existing,
      name: payload.name,
      description: payload.description ?? "",
    };
    roles = roles.map((entry) => (entry.id === id ? updated : entry));
    rolePermissions = { ...rolePermissions, [id]: payload.permissions };
    return { ...updated, permissions: payload.permissions };
  },

  async listApprovalRules(): Promise<ApprovalRule[]> {
    await sleep(450);
    return approvalRules;
  },

  async getApprovalRule(id: ID): Promise<ApprovalRule | undefined> {
    await sleep(350);
    return approvalRules.find((rule) => rule.id === id);
  },

  async updateApprovalRule(id: ID, payload: Partial<ApprovalRule>): Promise<void> {
    await sleep(600);
    approvalRules = approvalRules.map((rule) =>
      rule.id === id ? { ...rule, ...payload } : rule,
    );
  },

  async getProductSettings(): Promise<ProductSettings> {
    await sleep(400);
    return productSettings;
  },

  async updateProductSettings(payload: ProductSettings): Promise<ProductSettings> {
    await sleep(700);
    productSettings = payload;
    return productSettings;
  },
};