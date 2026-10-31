"use client";

import { useRouter } from "next/navigation";
import {
  ArchiveIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useAwaitingDesign } from "@/hooks/use-awaiting-design";
import { SettingsShell } from "@/features/settings/components/settings-shell";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { settingsService } from "@/features/settings/settings.service";

const COLUMNS = [
  { id: "name", label: "Role name" },
  { id: "description", label: "Description" },
  { id: "staff", label: "Staff", width: "w-[90px]" },
  { id: "type", label: "Type", width: "w-[130px]" },
  { id: "actions", label: "Actions", width: "w-[90px]" },
];

const ROLES_PATH = "/settings/roles";

export default function RolesPage() {
  const router = useRouter();
  const awaitingDesign = useAwaitingDesign();
  const { data, loading, error, refetch } = useAsyncResource(
    "roles",
    () => settingsService.listRoles(),
    "We couldn't load your roles. Please try again.",
  );

  const roles = data ?? [];

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
      <SettingsCard className="flex min-w-0 flex-col gap-4 p-5">
        {error ? (
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load your roles"
            description={error}
            action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
          />
        ) : !loading && roles.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No roles yet"
            description="System roles and any custom roles you create will be listed here."
          />
        ) : (
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {COLUMNS.map((column) => (
                  <TableHead key={column.id} className={column.width}>
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index} className="hover:bg-transparent">
                      {COLUMNS.map((column) => (
                        <TableCell key={column.id} className={column.width}>
                          <Skeleton className="h-4 w-full max-w-[140px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="text-ink-1">{role.name}</TableCell>
                      <TableCell className="max-w-0 truncate" title={role.description}>
                        {role.description}
                      </TableCell>
                      <TableCell className="w-[90px]">{role.staffCount}</TableCell>
                      <TableCell className="w-[130px]">
                        <Badge variant={role.type === "custom" ? "purple" : "success"} dot>
                          {role.type === "custom" ? "Custom" : "System"}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[90px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label={`Actions for ${role.name}`}
                            className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted data-popup-open:bg-surface-muted"
                          >
                            <MoreHorizontalIcon className="size-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`${ROLES_PATH}/${role.id}`)}>
                              <EyeIcon className="size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => awaitingDesign("Archiving a role")}>
                              <ArchiveIcon className="size-4" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        )}
      </SettingsCard>
    </SettingsShell>
  );
}