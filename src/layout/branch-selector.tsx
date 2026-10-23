"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranch } from "@/context/branch-context";
import { cn } from "@/lib/utils";

/** Scopes the current screen to one branch. */
export function BranchSelector({ className }: { className?: string }) {
  const { branches, activeBranch, setActiveBranchId } = useBranch();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(47,47,47,0.04)]",
          "text-sm font-bold tracking-[0.14px] text-ink-2 transition-colors hover:bg-surface-muted",
          className,
        )}
      >
        {activeBranch.name}
        <ChevronDownIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {branches.map((branch) => (
          <DropdownMenuItem key={branch.id} onClick={() => setActiveBranchId(branch.id)}>
            <CheckIcon
              className={cn("size-4", branch.id === activeBranch.id ? "opacity-100" : "opacity-0")}
            />
            {branch.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
