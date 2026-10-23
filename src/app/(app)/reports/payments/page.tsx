import PaymentReportPage from "@/screens/reports/payment-report-page";
import { reportData } from "@/features/reports/mock-data";

export default function Page() {
  return <PaymentReportPage data={reportData.payments} />;
}
