"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { SettingsCard } from "@/features/settings/components/settings-card";
import {
  ROLE_DESCRIPTION_OPTIONS,
  ROLE_NAME_OPTIONS,
  type PermissionAction,
} from "@/types/permission-config";
import type { RolePayload, RolePermissions } from "@/types/role-types";
import { ComboField } from "@/features/settings/components/roles/combo-filed";
import { PermissionMatrix, type PermissionState } from "./permission-matrix";

const ROLES_PATH = "/settings/roles";

/** Same shell as the roles list: title, description and the Custom Role button stay visible. */
export function RolePageShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <SettingsShell
      title="Roles & Permissions"
      description="Control access to RIINOX modules and business actions"
      action={
        <PrimaryButton
          onClick={() => router.push(`${ROLES_PATH}/new`)}
          leftIcon={<PlusIcon className="size-5" />}
        >
          Custom Role
        </PrimaryButton>
      }
    >
      {children}
    </SettingsShell>
  );
}

function toState(permissions: RolePermissions = {}): PermissionState {
  return Object.fromEntries(
    Object.entries(permissions).map(([area, actions]) => [area, new Set<PermissionAction>(actions)]),
  );
}

function toPermissions(state: PermissionState): RolePermissions {
  const out: RolePermissions = {};
  for (const [area, set] of Object.entries(state)) {
    if (set.size > 0) out[area] = Array.from(set).sort();
  }
  return out;
}

interface RoleFormProps {
  initial?: { name: string; description?: string; permissions: RolePermissions };
  readOnly?: boolean;
  onSubmit: (payload: RolePayload) => Promise<void>;
}

export function RoleForm({ initial, readOnly = false, onSubmit }: RoleFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [permissions, setPermissions] = useState<PermissionState>(() => toState(initial?.permissions));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const snapshot = useMemo(
    () => JSON.stringify({ name, description, permissions: toPermissions(permissions) }),
    [name, description, permissions],
  );
  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        permissions: toPermissions(toState(initial?.permissions)),
      }),
    [initial],
  );
  const dirty = snapshot !== initialSnapshot;

  const handleDiscard = () => {
    if (dirty && !window.confirm("Discard your changes?")) return;
    router.push(ROLES_PATH);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Enter a role name.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        permissions: toPermissions(permissions),
      });
      router.push(ROLES_PATH);
    } catch {
      setError("We couldn't save this role. Please try again.");
      setSaving(false);
    }
  };

  return (
    <SettingsCard className="flex min-w-0 flex-col gap-6 p-5">
      <div className="flex flex-col gap-4">
        <Link
          href={ROLES_PATH}
          className="flex w-fit items-center gap-1 text-xs text-ink-3 transition-colors hover:text-ink-1"
        >
          <ChevronLeftIcon className="size-4" />
          Back
        </Link>
        <h2 className="text-sm font-semibold text-ink-1">Role Details</h2>

        <div className="flex flex-col gap-4">
          <ComboField
            label="Role Name"
            value={name}
            onChange={setName}
            options={ROLE_NAME_OPTIONS}
            placeholder="Select or type a role name"
            disabled={readOnly}
          />
          <ComboField
            label="Description (optional)"
            value={description}
            onChange={setDescription}
            options={ROLE_DESCRIPTION_OPTIONS}
            placeholder="Select or type a description"
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ink-1">Permissions</h2>
        <PermissionMatrix value={permissions} onChange={setPermissions} readOnly={readOnly} />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {!readOnly && (
        <div className="flex items-center justify-between">
          <SecondaryButton onClick={handleDiscard} disabled={saving}>
            Discard
          </SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Role"}
          </PrimaryButton>
        </div>
      )}
    </SettingsCard>
  );
}