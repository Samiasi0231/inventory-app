import {
  Bell,
  Boxes,
  ChevronDown,
  CircleHelp,
  Download,
  FileText,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
 
const sidebar: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Sales", icon: ShoppingCart },
  { label: "Purchasing", icon: Truck },
  { label: "Inventory", icon: Boxes },
  { label: "Products", icon: Package },
  { label: "People", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];
 
const stats = [
  { label: "Net Sales", value: "₦5,000,000", delta: "+4.2%", up: true },
  { label: "Expenses", value: "₦1,250,000", delta: "-4.2%", up: false },
  { label: "Net Profit", value: "₦3,750,000", delta: "+4.2%", up: true },
  { label: "Stock Value", value: "₦8,400,000", delta: "-1.1%", up: false },
];
 
const alerts = [
  { title: "Indomie carton — low stock", detail: "Only 2 cartons left at Ikeja branch", tag: "Critical", tone: "red" },
  { title: "Paracetamol 500mg — expiry", detail: "12 packs expire in 14 days", tag: "Warning", tone: "amber" },
  { title: "Payment received", detail: "₦245,000 from Mama Tunde Stores", tag: "Paid", tone: "green" },
] as const;
 
const tagClass = {
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-700",
  green: "bg-green-50 text-green-700",
} as const;
 
/** Static, decorative product screenshot used in the hero. */
export function DashboardPreview() {
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none overflow-hidden rounded-t-2xl border border-white/50 bg-white text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
    >
      <div className="grid md:grid-cols-[190px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-neutral-100 p-4 md:block">
          <ul className="space-y-1">
            {sidebar.map((item) => (
              <li
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-xs",
                  item.active ? "bg-brand-50 font-semibold text-brand-700" : "text-neutral-600",
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </li>
            ))}
          </ul>
        </aside>
 
        {/* Main */}
        <div className="bg-neutral-50/70 p-4 sm:p-5">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-neutral-800">Dashboard</span>
            <div className="hidden h-8 flex-1 max-w-[260px] items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-[11px] text-neutral-400 sm:flex">
              <Search className="size-3.5" />
              Search
            </div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-md border border-neutral-200 bg-white text-neutral-500">
                <Bell className="size-3.5" />
              </span>
              <span className="grid size-8 place-items-center rounded-md border border-neutral-200 bg-white text-neutral-500">
                <CircleHelp className="size-3.5" />
              </span>
              <span className="flex h-8 items-center gap-1 rounded-md bg-brand-500 px-3 text-[11px] font-semibold text-white">
                <Plus className="size-3.5" />
                Quick Add
              </span>
            </div>
          </div>
 
          {/* Overview */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-800">Overview</span>
            <div className="flex items-center gap-2 text-[11px] text-neutral-600">
              <span className="flex h-7 items-center gap-1 rounded-md border border-neutral-200 bg-white px-2">
                Branch <ChevronDown className="size-3" />
              </span>
              <span className="flex h-7 items-center gap-1 rounded-md border border-neutral-200 bg-white px-2">
                Daily <ChevronDown className="size-3" />
              </span>
              <span className="flex h-7 items-center gap-1 rounded-md border border-neutral-200 bg-white px-2">
                <Download className="size-3" /> Export
              </span>
            </div>
          </div>
 
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-neutral-200 bg-white p-3">
                <p className="text-[10px] text-neutral-500">{stat.label}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-neutral-900">{stat.value}</span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[9px] font-semibold",
                      stat.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600",
                    )}
                  >
                    {stat.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
 
          <div className="mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
            {/* Sales overview */}
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-neutral-800">Sales Overview</p>
                  <p className="mt-1 text-xl font-bold text-neutral-900">
                    ₦240.8K <span className="ml-1 rounded bg-green-50 px-1.5 py-0.5 text-[9px] text-green-700">+8.4%</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-neutral-300" /> Expenses
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-brand-500" /> Revenue
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 400 120" className="mt-3 h-28 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="dash-revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#008c4b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#008c4b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 100 C50 92 80 80 120 84 S190 100 240 78 S320 70 360 62 S390 58 400 54"
                  fill="none"
                  stroke="#d4d4d4"
                  strokeWidth="2"
                />
                <path
                  d="M0 92 C40 82 60 52 100 60 S170 96 210 62 S290 22 330 42 S380 32 400 18 L400 120 L0 120 Z"
                  fill="url(#dash-revenue)"
                />
                <path
                  d="M0 92 C40 82 60 52 100 60 S170 96 210 62 S290 22 330 42 S380 32 400 18"
                  fill="none"
                  stroke="#008c4b"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
 
            {/* Alerts */}
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-neutral-800">Today&apos;s Alerts</p>
                <span className="text-[10px] font-medium text-brand-600">View All</span>
              </div>
              <ul className="mt-3 space-y-3">
                {alerts.map((alert) => (
                  <li key={alert.title} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-neutral-800">{alert.title}</p>
                      <p className="truncate text-[10px] text-neutral-500">{alert.detail}</p>
                    </div>
                    <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold", tagClass[alert.tone])}>
                      {alert.tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}