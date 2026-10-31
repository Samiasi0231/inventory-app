
"use client";

import { useMemo, useState } from "react";
import { TopbarAction } from "@/layout/app-topbar";

import {
  StaffInviteModal,
  type StaffInviteFormValues,
} from "@/components/staff/staff-invite-modal";
import { Panel } from "@/components/common/panel";
import { FilterMenu } from "@/components/common/filter-menu";
import { ListPageHeader } from "@/components/common/list-page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { EditStaffModal } from "@/components/staff/edit-staff-modal";
import { RemoveStaffModal } from "@/components/staff/remove-staff-modal";
import { ResendInvitationModal } from "@/components/staff/resend-invitation-modal";
import type { StaffAction } from "@/components/staff/staff-actions-menu";
import { StaffTable } from "@/components/staff/staff-table";
import { SuspendAccessModal } from "@/components/staff/suspend-access-modal";
import { useStaff } from "@/hooks/use-staff";
import { exportCsv } from "@/lib/utils";
import { BRANCHES, type Branch } from "@/types/staff";
import {
  STAFF_STATUS_FILTERS,
  type StaffMember,
  type StaffModalState,
  type StaffStatusFilter,
} from "@/types/staff";

interface StaffPageProps {
  title: string;
  description: string;
}

export default function StaffPage({
  title,
  description,
}: StaffPageProps) {
  const {
    staff,
    updateStaff,
    suspendStaff,
    restoreStaff,
    removeStaff,
    resendInvitation,
  } = useStaff();

  const [branch, setBranch] = useState<Branch>("Port Harcourt");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StaffStatusFilter>("All");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [modal, setModal] = useState<StaffModalState>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const roleOptions = useMemo(
    () => [
      "All roles",
      ...Array.from(new Set(staff.map((member) => member.role))),
    ],
    [staff],
  );

  const handleInviteStaff = async (data: StaffInviteFormValues) => {
    console.log("Staff invitation details:", data);
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return staff.filter((member) => {
      const matchesBranch = member.branch === branch;

      const matchesStatus =
        statusFilter === "All" ||
        member.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesRole =
        roleFilter === "All roles" || member.role === roleFilter;

      const matchesSearch =
        !q ||
        [member.name, member.email, member.role].some((value) =>
          value.toLowerCase().includes(q),
        );

      return (
        matchesBranch &&
        matchesStatus &&
        matchesRole &&
        matchesSearch
      );
    });
  }, [staff, branch, statusFilter, roleFilter, query]);

  const handleAction = (
    action: StaffAction,
    member: StaffMember,
  ) => {
    if (action === "restore") {
      void restoreStaff(member.id);
      return;
    }

    setModal({ type: action, staff: member });
  };

  const closeModal = () => setModal(null);

  const handleExport = () =>
    exportCsv(
      visible,
      [
        { header: "Name", value: (s) => s.name },
        { header: "Email", value: (s) => s.email },
        { header: "Role", value: (s) => s.role },
        { header: "Branch", value: (s) => s.branch },
        { header: "Status", value: (s) => s.status },
      ],
      "staff.csv",
    );

  return (
    <div className="min-w-0 space-y-6">
      <TopbarAction>
        <button
          type="button"
          onClick={() => setIsAddStaffOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          <span className="text-lg leading-none">+</span>
          Invite Staff
        </button>
      </TopbarAction>

      <ListPageHeader
        title={title}
        description={description}
        branch={branch}
        branches={BRANCHES}
        onBranchChange={setBranch}
        onExport={handleExport}
      />

      <Panel>
        <ListToolbar
          search={query}
          onSearchChange={setQuery}
          placeholder="Search staff"
        >
          <FilterMenu
            label="Filter"
            groups={[
              {
                id: "status",
                label: "Status",
                value: statusFilter,
                options: STAFF_STATUS_FILTERS,
                defaultValue: "All",
                defaultLabel: "All statuses",
                onChange: (value) =>
                  setStatusFilter(value as StaffStatusFilter),
              },
              {
                id: "role",
                label: "Role",
                value: roleFilter,
                options: roleOptions,
                defaultValue: "All roles",
                defaultLabel: "All roles",
                onChange: setRoleFilter,
              },
            ]}
          />
        </ListToolbar>

        <StaffTable staff={visible} onAction={handleAction} />
      </Panel>

      <StaffInviteModal
        open={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSubmit={handleInviteStaff}
      />

      <EditStaffModal
        staff={modal?.type === "edit" ? modal.staff : null}
        onClose={closeModal}
        onSubmit={updateStaff}
      />

      <SuspendAccessModal
        staff={modal?.type === "suspend" ? modal.staff : null}
        onClose={closeModal}
        onConfirm={suspendStaff}
      />

      <RemoveStaffModal
        staff={modal?.type === "remove" ? modal.staff : null}
        onClose={closeModal}
        onConfirm={removeStaff}
      />

      <ResendInvitationModal
        staff={modal?.type === "resend" ? modal.staff : null}
        onClose={closeModal}
        onConfirm={resendInvitation}
      />
    </div>
  );
}
