import SupplierReportPage from "@/screens/reports/supplier-report-page";
import { reportData } from "@/features/reports/mock-data";

export default function Page() {
  return <SupplierReportPage data={reportData.suppliers} />;
}
