"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, LogOut, Menu, Settings, X } from "lucide-react";

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
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-0 sm:p-[6px]">
      <div className="mx-auto flex min-h-[calc(100vh-12px)] max-w-[1600px] overflow-hidden rounded-none border border-[#dedede] bg-white sm:rounded-[9px]">
        {/* Mobile header */}
        <header className="fixed inset-x-0 top-0 z-40 flex h-[58px] items-center justify-between border-b bg-white px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Settings size={18} />
            <span className="text-sm font-semibold">Settings</span>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-[230px] shrink-0 flex-col border-r border-[#dedede] bg-white transition-transform duration-200 lg:static lg:w-[200px] lg:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-[51px] items-center gap-2 border-b border-[#ededed] px-4">
            <ArrowLeft size={15} />
            <Link href="/" className="text-[11px] text-[#333]">
              Home
            </Link>
          </div>

          <div className="px-[13px] pt-[13px]">
            <h2 className="mb-[13px] text-[14px] font-semibold text-[#222]">
              Settings
            </h2>

            <nav className="space-y-[3px]">
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
                    className={`flex min-h-[35px] items-center rounded-[5px] px-[10px] text-[10px] transition-colors ${
                      active
                        ? "bg-[#e4fff2] font-medium text-[#008b50]"
                        : "text-[#303030] hover:bg-[#f6f6f6]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto flex items-center gap-[9px] border-t border-[#e8e8e8] px-[13px] py-[12px]">
            <div className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full bg-[#f2e2d4] text-[12px] font-semibold text-[#80583f]">
              F
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-medium text-[#292929]">
                Mrs. Funke Adeleke
              </p>
              <p className="text-[9px] text-[#888]">Owner</p>
            </div>

            <button
              type="button"
              aria-label="Sign out"
              className="text-[#888] hover:text-[#222]"
            >
              <LogOut size={13} />
            </button>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {menuOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          />
        )}

        {/* Page content */}
        <div className="min-w-0 flex-1 pt-[58px] lg:pt-0">{children}</div>
      </div>
    </div>
  );
}
