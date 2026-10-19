import SalesReportPage from "@/screens/reports/sales-report-page";
import { reportData } from "@/features/reports/mock-data";

export default function Page() {
  return <SalesReportPage data={reportData.sales} />;
}
