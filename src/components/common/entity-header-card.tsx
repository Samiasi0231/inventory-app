"use client";
import { Archive, Pencil } from "lucide-react";
import { SecondaryButton } from "@/components/button";
import { Panel} from "@/components/common/panel";

interface Props {
  /** e.g. "Lagos Food Co." */
  name: string;
  /** e.g. "Individual • CUS-001" */
  meta: string;
  /** e.g. "Customer since April 2026" */
  since: string;
  onArchive: () => void;
  onEdit: () => void;
}

/** Top card on customer / supplier detail pages. */
export function EntityHeaderCard({
  name,
  meta,
  since,
  onArchive,
  onEdit,
}: Props) {
  return (
    <Panel className="flex flex-row flex-wrap items-start justify-between gap-4">
      {/* Left: entity information */}
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
        <p className="mt-1 text-xs text-gray-600">{meta}</p>
        <p className="mt-1 text-[11px] text-emerald-700">{since}</p>
      </div>

      {/* Right: actions */}
      <div className="ml-auto flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onArchive}
          className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:underline"
        >
          <Archive size={14} />
          Archive
        </button>

        <SecondaryButton type="button" onClick={onEdit}>
          <span className="flex items-center gap-1.5">
            <Pencil size={14} />
            Edit Details
          </span>
        </SecondaryButton>
      </div>
    </Panel>
  );
}
