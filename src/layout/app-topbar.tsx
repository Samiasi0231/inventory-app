"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { BellIcon, CircleHelpIcon, MenuIcon, SearchIcon } from "lucide-react";
import { NAV_ITEMS } from "@/layout/nav-config";
import { cn } from "@/lib/utils";

const TOPBAR_ACTION_SLOT_ID = "topbar-action-slot";

const subscribeNoop = () => () => {};

/** Lets a page render its primary action into the shell's topbar. */
export function TopbarAction({ children }: { children: React.ReactNode }) {
  // The slot only exists in the DOM, so wait for hydration before portalling.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  const slot = document.getElementById(TOPBAR_ACTION_SLOT_ID);
  return slot ? createPortal(children, slot) : null;
}

/** The parent section plus the current page, e.g. "Inventory / Products". */
function useBreadcrumb() {
  const pathname = usePathname();

  for (const item of NAV_ITEMS) {
    const child = item.children?.find((entry) => pathname.startsWith(entry.href));
    if (child) return { section: item.label, page: child.label };
    if (item.href && pathname.startsWith(item.href)) {
      return { section: null, page: item.label };
    }
  }
  return { section: null, page: "Dashboard" };
}

interface AppTopbarProps {
  onOpenSidebar: () => void;
  className?: string;
}

export function AppTopbar({ onOpenSidebar, className }: AppTopbarProps) {
  const { section, page } = useBreadcrumb();

  return (
    <header
      className={cn(
        "flex h-20 shrink-0 items-center justify-between gap-4 bg-surface px-4 py-4 lg:px-8",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2 lg:w-60">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          className="-ml-1 rounded-lg p-2 text-ink-2 transition-colors hover:bg-surface-muted lg:hidden"
        >
          <MenuIcon className="size-5" />
        </button>
        <p className="flex min-w-0 items-center gap-1 truncate">
          {section && (
            <span className="text-xs tracking-[0.18px] text-ink-3">{section} /</span>
          )}
          <span className="truncate text-base font-semibold text-ink-1">{page}</span>
        </p>
      </div>

      {/* Held back to lg: below that the breadcrumb and actions need the room. */}
      <div className="hidden h-[42px] w-full max-w-[460px] items-center gap-2 rounded-lg border border-border px-4 py-2 lg:flex">
        <SearchIcon className="size-5 shrink-0 text-ink-4" />
        <input
          type="search"
          placeholder="Search Anything"
          aria-label="Search anything"
          className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative hidden size-[42px] items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:bg-surface-muted sm:flex"
        >
          <BellIcon className="size-5" />
          <span
            aria-hidden
            className="absolute top-2.5 right-3 size-2 rounded-full bg-destructive ring-2 ring-surface"
          />
        </button>
        <button
          type="button"
          aria-label="Help"
          className="hidden size-[42px] items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:bg-surface-muted sm:flex"
        >
          <CircleHelpIcon className="size-6" />
        </button>
        <div id={TOPBAR_ACTION_SLOT_ID} className="contents" />
      </div>
    </header>
  );
}
