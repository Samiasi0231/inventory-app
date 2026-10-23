import CustomerReportPage from "@/screens/reports/customer-report-page";
import { reportData } from "@/features/reports/mock-data";

export default function Page() {
  return <CustomerReportPage data={reportData.customers} />;
}
