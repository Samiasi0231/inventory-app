import { Suspense } from "react";
import InventoryProductsPage from "@/screens/inventory-products-page";
export default function Page() {
   return (
     <Suspense>
       <InventoryProductsPage />;
     </Suspense>
   );
}
