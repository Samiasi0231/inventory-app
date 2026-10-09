
import { Suspense } from "react";
import SuppliersDetailPage from "@/screens/supplier-detail-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-sm text-gray-500">Loading supplier details...</p>
      }
    >
      {" "}
      <SuppliersDetailPage />{" "}
    </Suspense>
  );
}
