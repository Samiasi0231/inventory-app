import type { ID } from "@/types/shared";

export interface BusinessProfile {
  businessName: string;
  legalName: string;
  businessType: string;
  registrationNumber: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  country: string;
  currency: string;
}

export type LocationStatus = "active" | "inactive";

export interface BusinessLocation {
  id: ID;
  name: string;
  code: string;
  address: string;
  staffCount: number;
  status: LocationStatus;
}

export type RoleType = "system" | "custom";

export interface StaffRole {
  id: ID;
  name: string;
  description: string;
  staffCount: number;
  type: RoleType;
}

export type ThresholdUnit = "units" | "percent" | "currency";

export interface ApprovalRule {
  id: ID;
  name: string;
  description: string;
  enabled: boolean;
  condition: string;
  threshold?: string;
  thresholdUnit?: ThresholdUnit;
  appliesTo: string;
  approver: string;
}

export interface ProductSettings {
  skuGeneration: string;
  skuPrefix: string;
  barcodeSupport: boolean;
  stockAlerts: boolean;
  outOfStockNotifications: boolean;
  stockVarianceNotifications: boolean;
  expiryAlerts: boolean;
  expiryAlertDays: string;
  batchTracking: boolean;
  stockTransfers: boolean;
  insufficientStockAction: string;
}

export const BUSINESS_TYPES = ["Wholesale", "Retail", "Distribution", "Manufacturing"];

export const SKU_GENERATION_OPTIONS = [
  "Automatic - prefix + sequence",
  "Automatic - sequence only",
  "Manual",
];

export const INSUFFICIENT_STOCK_OPTIONS = [
  "Block the sale",
  "Warn and allow",
  "Allow and backorder",
];

export const APPROVER_OPTIONS = ["Manager", "Administrator", "Owner", "Accountant"];

export const APPROVAL_LOCATIONS = ["All", "Main Warehouse", "Lekki Branch", "Ikeja Branch"];
