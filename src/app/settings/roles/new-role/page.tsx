"use client";

import { RoleForm, RolePageShell } from "@/features/settings/components/roles/role-form";
import { settingsService } from "@/features/settings/settings.service";

export default function NewRolePage() {
  return (
    <RolePageShell>
      <RoleForm
        onSubmit={async (payload) => {
          await settingsService.createRole(payload);
        }}
      />
    </RolePageShell>
  );
}