"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/button";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { RoleForm } from "@/features/settings/components/roles/role-form";
import { settingsService } from "@/features/settings/settings.service";

export default function NewRolePage() {
  const router = useRouter();
  return (
    <SettingsShell
      title="Roles & Permissions"
      description="Control access to RIINOX modules and business actions"
      action={
        <PrimaryButton
          onClick={() => router.push("/settings/roles/new")}
          leftIcon={<PlusIcon className="size-5" />}
        >
          Custom Role
        </PrimaryButton>
      }
    >
      <RoleForm
        onSubmit={async (payload) => {
          await settingsService.createRole(payload);
        }}
      />
    </SettingsShell>
  );
}