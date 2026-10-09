import { Panel} from "../common/panel";

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Panel className="p-4">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-gray-900">{value}</p>
    </Panel>
  );
}
