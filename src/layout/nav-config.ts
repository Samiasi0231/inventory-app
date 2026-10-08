import {
  ChartColumnIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  LayoutGridIcon,
  type LucideIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  /** Omitted for items that only group their children. */
  href?: string;
  children?: NavChild[];
}

/** Sidebar structure. Sections other than Inventory are not built yet. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutGridIcon, href: "/dashboard" },
  {
    label: "Inventory",
    icon: PackageIcon,
    href: "/inventory/products",
    children: [
      { label: "Products", href: "/inventory/products" },
      { label: "Stock History", href: "/inventory/stock-history" },
      { label: "Archived", href: "/inventory/archived" },
    ],
  },
  {
    label: "Transactions",
    icon: WalletIcon,
    href: "/sales/orders",
    children: [
      { label: "Sales Orders", href: "/sales/orders" },
      { label: "Purchase Orders", href: "/purchasing/orders" },
      { label: "Invoices", href: "/sales/invoices" },
      { label: "Payments", href: "/sales/payments" },
      { label: "Receipts", href: "/sales/receipts" },
    ],
  },
  { label: "Approvals", icon: ClipboardCheckIcon, href: "/approvals" },
  {
    label: "People",
    icon: UsersIcon,
    href: "/people",
    children: [
      { label: "Staff", href: "/people/staff" },
      { label: "Suppliers", href: "/people/suppliers" },
    ],
  },
  {
    label: "Activity & Audit",
    icon: FileTextIcon,
    href: "/activity",
    children: [
      { label: "Activity Log", href: "/activity/log" },
      { label: "Audit Trail", href: "/activity/audit" },
    ],
  },
  { label: "Reports", icon: ChartColumnIcon, href: "/reports" },
  { label: "Settings", icon: SettingsIcon, href: "/settings" },
];
