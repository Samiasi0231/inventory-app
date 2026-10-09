"use client";

import { Download } from "lucide-react";
import { Panel } from "./panel";
import { FilterDropdown } from "./filter-dropdwon";

interface Props<T extends string> {
  title: string;
  description: string;
  branch: T;
  branches: readonly T[];
  onBranchChange: (b: T) => void;
  onExport: () => void;
}

/** Title + description card with the branch picker and Export button. */
export function ListPageHeader<T extends string>({
  title,
  description,
  branch,
  branches,
  onBranchChange,
  onExport,
}: Props<T>) {
  return (
    <Panel className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-xs text-gray-600">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <FilterDropdown
          value={branch}
          options={branches}
          onChange={onBranchChange}
          className="h-8"
        />
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-emerald-700"
        >
          <Download size={14} />
          Export
        </button>
      </div>
    </Panel>
  );
}
