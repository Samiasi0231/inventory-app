import {
  ArchiveIcon,
  ChartColumnIcon,
  ClipboardCheckIcon,
  FileMinusIcon,
  FileTextIcon,
  HistoryIcon,
  LayoutGridIcon,
  type LucideIcon,
  PackageIcon,
  ReceiptIcon,
  SettingsIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

export interface NavChild {
  label: string;
  href: string;
  icon: LucideIcon;
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
      { label: "Products", href: "/inventory/products", icon: TrendingUpIcon },
      { label: "Stock History", href: "/inventory/stock-history", icon: HistoryIcon },
      { label: "Archived", href: "/inventory/archived", icon: ArchiveIcon },
    ],
  },
  {
    label: "Sales",
    icon: TrendingUpIcon,
    href: "/sales/new",
    children: [
      { label: "New Sales", href: "/sales/new", icon: ShoppingCartIcon },
      { label: "Invoices", href: "/sales/invoices", icon: FileTextIcon },
      { label: "Sales History", href: "/sales/history", icon: HistoryIcon },
      { label: "Receipts", href: "/sales/receipts", icon: ReceiptIcon },
      { label: "Credit Notes", href: "/sales/credit-notes", icon: FileMinusIcon },
    ],
  },
  {
    label: "Purchasing",
    icon: ShoppingCartIcon,
    href: "/purchasing/orders",
    children: [
      { label: "Purchase Orders", href: "/purchasing/orders", icon: FileTextIcon },
      { label: "Receive Stock", href: "/purchasing/receive", icon: TruckIcon },
      { label: "Payments", href: "/purchasing/payments", icon: WalletIcon },
    ],
  },
  { label: "Approvals", icon: ClipboardCheckIcon, href: "/approvals" },
  {
    label: "People",
    icon: UsersIcon,
    href: "/people",
    children: [
      { label: "Staff", href: "/people/staff", icon: UsersIcon },
      { label: "Customers", href: "/people/customers", icon: UsersIcon },
      { label: "Suppliers", href: "/people/suppliers", icon: TruckIcon },
    ],
  },
  {
    label: "Activity & Audit",
    icon: FileTextIcon,
    href: "/activity",
    children: [
      { label: "Activity Log", href: "/activity/log", icon: HistoryIcon },
      { label: "Audit Trail", href: "/activity/audit", icon: FileTextIcon },
    ],
  },
  { label: "Reports", icon: ChartColumnIcon, href: "/reports" },
  { label: "Settings", icon: SettingsIcon, href: "/settings" },
];
