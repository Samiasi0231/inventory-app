"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types/shared";

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

const SETTINGS_NAV = [
  { label: "Business Profile", href: "/settings" },
  { label: "Branches & Location", href: "/settings/locations" },
  { label: "Roles & Permissions", href: "/settings/roles" },
  { label: "Approval Rules", href: "/settings/approval-rules" },
  { label: "Products & Inventory", href: "/settings/products" },
  { label: "Sales & Purchasing", href: "/settings/sales" },
  { label: "Tax & Payments", href: "/settings/tax" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Security & Account", href: "/settings/security" },
  { label: "Archive", href: "/settings/archive" },
  { label: "Subscription & Billing", href: "/settings/billing" },
];

interface SettingsShellProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export function SettingsShell({ title, description, action, children }: SettingsShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-dvh min-w-0 overflow-hidden bg-surface">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border/60 lg:flex">
        <div className="p-5 pb-4">
          <Link
            href="/dashboard"
            className="flex w-fit items-center gap-2 text-sm text-ink-2 transition-colors hover:text-primary"
          >
            <ArrowLeftIcon className="size-4" />
            Home
          </Link>
          <h2 className="mt-3 text-xl font-semibold text-ink-1">Settings</h2>
        </div>

        <nav aria-label="Settings sections" className="flex flex-1 flex-col gap-1 px-3">
          {SETTINGS_NAV.map((entry) => {
            const active =
              entry.href === "/settings"
                ? pathname === "/settings"
                : pathname.startsWith(entry.href);
            return (
              <Link
                key={entry.href}
                href={entry.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-ink-1 hover:bg-surface-muted",
                )}
              >
                {entry.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 border-t border-border/60 px-4 py-5">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-1 text-sm font-semibold text-surface"
          >
            {CURRENT_USER.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-ink-1">{CURRENT_USER.name}</p>
            <p className="text-xs text-ink-3">{ROLE_LABELS[CURRENT_USER.role]}</p>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            onClick={() => router.push("/signin")}
            className="rounded-md p-1.5 text-ink-3 transition-colors hover:bg-surface-muted hover:text-ink-1"
          >
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <SettingsNavSelect />

        <header className="flex flex-col gap-4 border-b border-border/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-ink-1">{title}</h1>
            <p className="mt-1 text-sm text-ink-3">{description}</p>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-surface-muted/60 p-6">{children}</div>
      </div>
    </div>
  );
}

function SettingsNavSelect() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="border-b border-border/60 p-4 lg:hidden">
      <label htmlFor="settings-area" className="sr-only">
        Settings area
      </label>
      <select
        id="settings-area"
        value={SETTINGS_NAV.find((entry) => pathname.startsWith(entry.href))?.href ?? "/settings"}
        onChange={(event) => router.push(event.target.value)}
        className="h-[42px] w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink-1"
      >
        {SETTINGS_NAV.map((entry) => (
          <option key={entry.href} value={entry.href}>
            {entry.label}
          </option>
        ))}
      </select>
    </div>
  );
}
