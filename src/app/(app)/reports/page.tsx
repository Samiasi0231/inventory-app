import ReportsPage from "@/screens/reports/reports-page";
import { reportData } from "@/features/reports/mock-data";

export default function Page() {
  return <ReportsPage data={reportData.overview} />;
}
