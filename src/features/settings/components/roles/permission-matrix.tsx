"use client";

import { CheckIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PERMISSION_ACTIONS,
  PERMISSION_AREAS,
  type PermissionAction,
} from "@/types/permission-config";

export type PermissionState = Record<string, Set<PermissionAction>>;

// Swap these two for your own green token if you have one.
const CHECKED_CLASS = "border-emerald-500 text-emerald-600";
const FOCUS_CLASS = "focus-visible:outline-emerald-500";

interface PermissionMatrixProps {
  value: PermissionState;
  onChange?: (next: PermissionState) => void;
  readOnly?: boolean;
}

interface CellProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onToggle: () => void;
}

function PermissionCell({ checked, disabled, label, onToggle }: CellProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`mx-auto flex size-4 cursor-pointer items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${FOCUS_CLASS} disabled:cursor-default ${
        checked ? CHECKED_CLASS : "border-border text-transparent enabled:hover:border-ink-3"
      }`}
    >
      <CheckIcon className="size-3" strokeWidth={3} />
    </button>
  );
}

export function PermissionMatrix({ value, onChange, readOnly = false }: PermissionMatrixProps) {
  const toggle = (areaId: string, action: PermissionAction) => {
    if (readOnly || !onChange) return;
    const set = new Set(value[areaId] ?? []);
    if (set.has(action)) set.delete(action);
    else set.add(action);
    onChange({ ...value, [areaId]: set });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow className="bg-surface-muted hover:bg-surface-muted">
            <TableHead className="w-[28%]">Area</TableHead>
            {PERMISSION_ACTIONS.map((action) => (
              <TableHead key={action.id} className="text-center">
                {action.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSION_AREAS.map((area) => (
            <TableRow key={area.id} className="hover:bg-transparent">
              <TableCell className="text-ink-1">{area.label}</TableCell>
              {PERMISSION_ACTIONS.map((action) => (
                <TableCell key={action.id} className="text-center">
                  {area.actions.includes(action.id) ? (
                    <PermissionCell
                      checked={value[area.id]?.has(action.id) ?? false}
                      disabled={readOnly}
                      label={`${action.label} ${area.label}`}
                      onToggle={() => toggle(area.id, action.id)}
                    />
                  ) : (
                    <span aria-hidden className="text-ink-3">
                      –
                    </span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}