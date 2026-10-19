"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Panel} from "@/components/common/panel";
import { FilterDropdown } from "@/components/common/filter-dropdwon";
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

export default function StaffPage({ title, description }: StaffPageProps) {
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
  const [statusFilter, setStatusFilter] = useState<StaffStatusFilter>("All");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [modal, setModal] = useState<StaffModalState>(null);

  const roleOptions = useMemo(
    () => ["All roles", ...Array.from(new Set(staff.map((s) => s.role)))],
    [staff],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return staff.filter((s) => {
      if (s.branch !== branch) return false;
      if (statusFilter !== "All" && s.status !== statusFilter.toLowerCase())
        return false;
      if (roleFilter !== "All roles" && s.role !== roleFilter) return false;
      if (!q) return true;
      return [s.name, s.email, s.role].some((v) => v.toLowerCase().includes(q));
    });
  }, [staff, branch, statusFilter, roleFilter, query]);

  const handleAction = (action: StaffAction, member: StaffMember) => {
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
    <div className="space-y-5 p-6">
      <ListPageHeader
        title="Staff"
        description="Manage employee, roles and access"
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
          <FilterDropdown
            value={statusFilter}
            options={STAFF_STATUS_FILTERS}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            value={roleFilter}
            options={roleOptions}
            onChange={setRoleFilter}
            icon={<Filter size={13} />}
            label={roleFilter === "All roles" ? "Filter" : roleFilter}
          />
        </ListToolbar>
        <StaffTable staff={visible} onAction={handleAction} />
      </Panel>

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
