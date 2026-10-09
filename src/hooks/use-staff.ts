import { useCallback, useState } from "react";
import { MOCK_STAFF } from "@/lib/staff-mock-data";
import type { StaffMember } from "@/types/staff";

const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));
export function useStaff() {
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);

  const patch = useCallback((id: string, changes: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  }, []);

  const updateStaff = useCallback(
    async (id: string, data: Pick<StaffMember, "name" | "email" | "role" | "branch">) => {
      await wait();
      patch(id, data);
    },
    [patch]
  );

  const suspendStaff = useCallback(
    async (id: string) => {
      await wait();
      patch(id, { status: "suspended" });
    },
    [patch]
  );

  const restoreStaff = useCallback(
    async (id: string) => {
      await wait(300);
      patch(id, { status: "active" });
    },
    [patch]
  );

  const removeStaff = useCallback(async (id: string) => {
    await wait();
    setStaff((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const resendInvitation = useCallback(
    async (id: string, email: string) => {
      await wait();
      patch(id, { email });
    },
    [patch]
  );

  return { staff, updateStaff, suspendStaff, restoreStaff, removeStaff, resendInvitation };
}