"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "@/layout/nav-config";
import { cn } from "@/lib/utils";
import type { User } from "@/types/shared";

/** Placeholder until the session exposes the signed-in user. */
const CURRENT_USER: User = {
  id: "usr_demo",
  name: "Mrs. Funke Adeleke",
  role: "owner",
};

const ROLE_LABELS: Record<User["role"], string> = {
  owner: "Owner",
  manager: "Manager",
  inventory_manager: "Inventory Manager",
  staff: "Staff",
};

function isItemActive(item: NavItem, pathname: string) {
  if (item.children?.some((child) => pathname.startsWith(child.href))) return true;
  return item.href ? pathname.startsWith(item.href) : false;
}

function NavSection({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isItemActive(item, pathname);
  const [expanded, setExpanded] = useState(active);
  const Icon = item.icon;

  const headerClasses = cn(
    "flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left transition-colors",
    active ? "bg-accent text-accent-foreground" : "text-ink-1 hover:bg-surface-muted",
  );

  const labelClasses = cn(
    "flex-1 truncate text-sm tracking-[0.14px]",
    active ? "font-semibold" : "font-medium",
  );

  if (!item.children) {
    return (
      <Link href={item.href ?? "#"} className={headerClasses}>
        <Icon className="size-5 shrink-0" />
        <span className={labelClasses}>{item.label}</span>
      </Link>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className={headerClasses}
      >
        <Icon className="size-5 shrink-0" />
        <span className={labelClasses}>{item.label}</span>
        <ChevronDownIcon
          className={cn("size-4 shrink-0 transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded &&
        item.children.map((child) => {
          const childActive = pathname.startsWith(child.href);
          const ChildIcon = child.icon;
          return (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-xs tracking-[0.18px] transition-colors",
                childActive
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "font-medium text-ink-1 hover:bg-surface-muted",
              )}
            >
              <ChildIcon className="size-5 shrink-0" />
              {child.label}
            </Link>
          );
        })}
    </div>
  );
}

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col border-r-[0.5px] border-border bg-surface",
        className,
      )}
    >
      <div className="flex h-20 items-center gap-2 px-4">
        <Image src="/riinox-mark.png" alt="" width={28} height={28} priority />
        <span className="text-xl font-bold text-ink-1">RIINOX</span>
      </div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {NAV_ITEMS.map((item) => (
          <NavSection key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-1 text-sm font-semibold text-surface"
          >
            {CURRENT_USER.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium tracking-[0.18px] text-ink-1">
              {CURRENT_USER.name}
            </p>
            <p className="truncate text-[10px] tracking-[0.2px] text-ink-3">
              {ROLE_LABELS[CURRENT_USER.role]}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          className="shrink-0 rounded-md p-1 text-ink-3 transition-colors hover:bg-surface-muted hover:text-ink-1"
        >
          <LogOutIcon className="size-4" />
        </button>
      </div>
    </aside>
  );
}
