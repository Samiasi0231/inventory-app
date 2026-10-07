"use client";

import {
  ArchiveIcon,
  ArrowUpDownIcon,
  EyeIcon,
  MoreHorizontalIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InventoryItem } from "../types";

export type RowAction = "view" | "transfer" | "adjust" | "reorder" | "archive";

const ACTIONS: { id: RowAction; label: string; icon: typeof EyeIcon }[] = [
  { id: "view", label: "View Details", icon: EyeIcon },
  { id: "transfer", label: "Transfer Stock", icon: ArrowUpDownIcon },
  { id: "adjust", label: "Adjust Stock", icon: SlidersHorizontalIcon },
  { id: "reorder", label: "Reorder Stock", icon: RotateCcwIcon },
  { id: "archive", label: "Archive Stock", icon: ArchiveIcon },
];

interface ProductRowActionsProps {
  item: InventoryItem;
  onAction: (action: RowAction, item: InventoryItem) => void;
}

export function ProductRowActions({ item, onAction }: ProductRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${item.name}`}
        className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted data-popup-open:bg-surface-muted"
      >
        <MoreHorizontalIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {ACTIONS.map(({ id, label, icon: Icon }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => onAction(id, item)}
            variant={id === "archive" ? "destructive" : "default"}
          >
            <Icon />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
