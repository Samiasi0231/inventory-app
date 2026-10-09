
import { Suspense } from "react";
import CustomersPage from "@/screens/customers-page";

export default function Page() {
  return (
    <Suspense>
      <CustomersPage
        title="Customers"
        description="Manage customer records, balances and sales history."
      />
    </Suspense>
  );
}

