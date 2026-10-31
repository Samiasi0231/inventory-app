"use client";

import { useParams, useSearchParams } from "next/navigation";
import { TriangleAlertIcon } from "lucide-react";
import { SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { RoleForm, RolePageShell } from "@/features/settings/components/roles/role-form";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { settingsService } from "@/features/settings/settings.service";

export default function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const viewOnly = searchParams.get("mode") === "view";

  const { data: role, loading, error, refetch } = useAsyncResource(
    `role-${id}`,
    () => settingsService.getRole(id),
    "We couldn't load this role. Please try again.",
  );

  return (
    <RolePageShell>
      {error ? (
        <SettingsCard className="p-5">
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load this role"
            description={error}
            action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
          />
        </SettingsCard>
      ) : loading || !role ? (
        <SettingsCard className="flex flex-col gap-4 p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-64 w-full" />
        </SettingsCard>
      ) : (
        <RoleForm
          key={role.id}
          initial={role}
          readOnly={viewOnly}
          onSubmit={async (payload) => {
            await settingsService.updateRole(role.id, payload);
          }}
        />
      )}
    </RolePageShell>
  );
}