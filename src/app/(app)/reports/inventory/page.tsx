import InventoryReportPage from "@/screens/reports/inventory-report-page";
import { reportData } from "@/features/reports/mock-data";

export default function Page() {
  return <InventoryReportPage data={reportData.inventory} />;
}
