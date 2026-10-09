import { Suspense } from "react";
import StaffPage from "@/screens/staff-page";

export default function Page() {
  return (
    <Suspense>
      <StaffPage
        title="Staff"
        description="Manage your staff members and their access."
      />
    </Suspense>
  );
}
