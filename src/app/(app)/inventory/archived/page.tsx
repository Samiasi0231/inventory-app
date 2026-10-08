"use client";

import InventoryProductsPage from "@/screens/inventory-products-page";

export default function Page() {
  return (
    <InventoryProductsPage
      archived
      title="Archived"
      description="Products you have archived. Restore one to put it back into circulation."
    />
  );
}
