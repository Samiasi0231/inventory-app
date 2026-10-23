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
    <div className="settings-shell">
      <aside className="settings-sidebar">
        <div className="settings-sidebar-heading">
          <Link
            href="/dashboard"
            className="settings-home"
          >
            <ArrowLeftIcon className="size-4" />
            Home
          </Link>
          <h2 className="settings-sidebar-title">Settings</h2>
        </div>

        <nav aria-label="Settings sections" className="settings-navigation">
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
                  "settings-nav-link",
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

        <div className="settings-persona">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-1 text-sm font-semibold text-surface"
          >
            {CURRENT_USER.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-ink-1">{CURRENT_USER.name}</p>
            <p className="text-[10px] text-ink-3">{ROLE_LABELS[CURRENT_USER.role]}</p>
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

      <div className="settings-main">
        <SettingsNavSelect />

        <header className="settings-header">
          <div className="min-w-0">
            <h1 className="settings-page-title">{title}</h1>
            <p className="settings-page-description">{description}</p>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>

        <div className="settings-content">{children}</div>
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
        value={SETTINGS_NAV.find((entry) => entry.href === "/settings" ? pathname === entry.href : pathname.startsWith(entry.href))?.href ?? "/settings"}
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
