
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type SettingsLayoutProps = {
  children: ReactNode;
};

const navigation = [
  { label: "Business Profile", href: "/settings/business-profile" },
  { label: "Branches & Location", href: "/settings/branches-location" },
  { label: "Roles & Permissions", href: "/settings/roles-permissions" },
  { label: "Approval Rules", href: "/settings/approval-rules" },
  { label: "Products & Inventory", href: "/settings/products-inventory" },
  { label: "Sales & Purchasing", href: "/settings/sales-purchasing" },
  { label: "Tax & Payments", href: "/settings/tax-payments" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Security & Account", href: "/settings/security-account" },
  { label: "Archive", href: "/settings/archive" },
  { label: "Subscription & Billing", href: "/settings/subscription-billing" },
];

export default function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPage = navigation.find(
    (item) =>
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
  );

  const title = currentPage?.label ?? "Settings";

  
return (
  <div className="min-h-screen bg-[#f1f1f1] sm:p-[6px]">
    <div className="mx-auto flex min-h-[calc(100vh-12px)] w-full overflow-hidden border border-[#dedede] bg-white sm:rounded-[9px]">

{/* Mobile navigation bar */}
<header className="fixed inset-x-0 top-0 z-40 flex h-[58px] items-center justify-between border-b border-[#dedede] bg-white px-4 lg:hidden">
  <Link
    href="/settings"
    className="text-sm font-semibold text-[#222]"
  >
    Settings
  </Link>

  <button
    type="button"
    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
    aria-expanded={menuOpen}
    onClick={() => setMenuOpen((open) => !open)}
    className="rounded-md p-2 text-[#333] hover:bg-gray-100"
  >
    {menuOpen ? (
      <X className="size-5" />
    ) : (
      <Menu className="size-5" />
    )}
  </button>
</header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex h-screen w-[240px] shrink-0 flex-col border-r border-[#e8e8e8] bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-[220px] lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[58px] shrink-0 items-center gap-2 border-b border-[#ededed] px-5">
          <ArrowLeft className="size-4 shrink-0 text-[#555]" />
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-xs font-medium text-[#333] hover:text-[#008b50]"
          >
            Back to Home
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-[#929792]">
            Workspace Settings
          </h2>

          <nav
            aria-label="Settings navigation"
            className="flex flex-col gap-1"
          >
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-10 items-center rounded-md px-3 text-xs transition-colors ${
                    active
                      ? "bg-[#e4fff2] font-semibold text-[#008b50]"
                      : "text-[#444944] hover:bg-[#f5f7f5]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-[#e8e8e8] px-4 py-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f2e2d4] text-sm font-semibold text-[#80583f]">
            F
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#292929]">
              Mrs. Funke Adeleke
            </p>
            <p className="mt-1 text-[11px] text-[#888]">Owner</p>
          </div>

          <button
            type="button"
            aria-label="Sign out"
            className="shrink-0 rounded-md p-2 text-[#888] hover:bg-gray-100 hover:text-[#222]"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
        />
      )}

      {/* Main content */}
   {/* Main content */}
<main className="min-w-0 flex-1 pt-[58px] lg:pt-0">
  {children}
</main>
    </div>
  </div>
);

}
