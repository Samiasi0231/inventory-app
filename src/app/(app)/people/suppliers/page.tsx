import { Suspense } from "react";
import SuppliersPage from "@/screens/suppliers-page";

export default function Page() {
  
  return (
    <Suspense>
      <SuppliersPage
        title="Suppliers"
        description="Gives product prices and terms"
      />
    </Suspense>
  );
}
