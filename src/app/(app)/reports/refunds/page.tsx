import RefundReportPage from "@/screens/reports/refund-report-page";
import { reportData } from "@/features/reports/mock-data";

export default function Page() {
  return <RefundReportPage data={reportData.refunds} />;
}
