import type { StaffMember } from "@/types/staff";
import { StaffActionsMenu, type StaffAction } from "./staff-actions-menu";
import { StaffStatusBadge } from "./staff-status-badge";

interface Props {
  staff: StaffMember[];
  onAction: (action: StaffAction, staff: StaffMember) => void;
}

const HEADERS = ["Name", "Email", "Assigned Role", "Branch", "Status"];

export function StaffTable({ staff, onAction }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-xs text-gray-700">
        <thead>
          <tr className="bg-gray-50 text-[11px] font-medium text-gray-500">
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                No staff found.
              </td>
            </tr>
          ) : (
            staff.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-5 text-gray-900">{s.name}</td>
                <td className="px-4 py-5">{s.email}</td>
                <td className="px-4 py-5">{s.role}</td>
                <td className="px-4 py-5">{s.branch}</td>
                <td className="px-4 py-5">
                  <StaffStatusBadge status={s.status} />
                </td>
                <td className="px-4 py-5 text-right">
                  {/* The owner's account can't be edited/suspended/removed from here */}
                  <StaffActionsMenu
                    staff={s}
                    onAction={onAction}
                    disabled={s.role === "Owner"}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
