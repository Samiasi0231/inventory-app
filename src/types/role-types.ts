import type { PermissionAction } from "./permission-config";

/** areaId -> granted actions */
export type RolePermissions = Record<string, PermissionAction[]>;

export interface RoleDetail {
  id: string;
  name: string;
  description?: string;
  type: "system" | "custom";
  permissions: RolePermissions;
}

export interface RolePayload {
  name: string;
  description?: string;
  permissions: RolePermissions;
}