export type StaffStatus = "active" | "suspended" | "pending";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  status: StaffStatus;
}

export type StaffModalState =
  | { type: "edit"; staff: StaffMember }
  | { type: "suspend"; staff: StaffMember }
  | { type: "remove"; staff: StaffMember }
  | { type: "resend"; staff: StaffMember }
  | null;

export const STAFF_STATUS_FILTERS = ["All", "Active", "Suspended", "Pending"] as const;
export type StaffStatusFilter = (typeof STAFF_STATUS_FILTERS)[number];

export const BRANCHES = ["Port Harcourt", "Lagos", "Abuja"] as const;
export type Branch = (typeof BRANCHES)[number];
export const ASSIGNABLE_ROLES = [
  "Manager",
  "Inventory Manager",
  "Inventory Staff",
  "Sales Manager",
  "Custom Role",
] as const;