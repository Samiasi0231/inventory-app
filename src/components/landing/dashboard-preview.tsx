import {
  Bell,
  ChevronDown,
  CircleHelp,
  Download,
  FolderSearch,
  LayoutGrid,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebar = ["Dashboard", "Sales", "Purchasing", "Inventory", "Products", "People", "Reports", "Settings"];

const stats = [
  { label: "Net Sales", value: "₦55,000,000", delta: "+5.2%", up: true },
  { label: "Expenses", value: "₦55,000,000", delta: "-5.2%", up: false },
  { label: "Net Profit", value: "₦55,000,000", delta: "+6.2%", up: true },
  { label: "Stock Value", value: "₦55,000,000", delta: "-5.2%", up: false },
];

const alerts = [
  { title: "Ikeja - Low Stock Alert", detail: "Only 2 cartons of Indomie left in inventory", tag: "Urgent" },
  { title: "Lekki - Expiry Alert", detail: "12 packs of Paracetamol expire in 14 days", tag: "Urgent" },
  { title: "Abuja - Low Stock Alert", detail: "Only 5 bags of Premium Rice left in inventory", tag: "Urgent" },
];

const yLabels = ["250K", "200K", "150K", "100K", "50K", "0"];

/** Static, decorative product screenshot used in the hero. The hero crops its bottom edge. */
export function DashboardPreview() {
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none overflow-hidden rounded-t-2xl border border-b-0 border-white/50 bg-white text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
    >
      <div className="grid md:grid-cols-[176px_1fr]">
        {/* Sidebar */}
        <aside className="hidden bg-white px-4 pt-20 md:block">
          <ul>
            {sidebar.map((label) => (
              <li key={label} className="flex h-9 items-center gap-2 text-xs text-neutral-700">
                <LayoutGrid className="size-3.5 shrink-0" />
                {label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div className="min-w-0 bg-neutral-50 p-4 sm:p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-neutral-900">Dashboard</span>
            <div className="hidden h-9 max-w-[310px] flex-1 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-xs text-neutral-400 sm:flex">
              <Search className="size-4" />
              Input
            </div>
            <div className="flex items-center gap-2">
              <span className="relative grid size-9 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-600">
                <Bell className="size-4" />
                <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-red-500" />
              </span>
              <span className="grid size-9 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-600">
                <CircleHelp className="size-4" />
              </span>
              <span className="flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-xs font-semibold text-white">
                <Plus className="size-4" />
                Quick Add
              </span>
            </div>
          </div>

          {/* Overview */}
          <div className="mt-5 flex items-center justify-between rounded-lg bg-white px-4 py-3">
            <span className="text-sm font-semibold text-neutral-900">Overview</span>
            <div className="flex items-center gap-3 text-[11px] text-neutral-700">
              <span className="flex h-7 items-center gap-2 rounded-md border border-neutral-300 px-2.5">
                Branch <ChevronDown className="size-3" />
              </span>
              <span className="flex h-7 items-center gap-2 rounded-md border border-neutral-300 px-2.5">
                Date <ChevronDown className="size-3" />
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-brand-600">
                <Download className="size-3.5" /> Export
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-neutral-100 bg-white p-3">
                <p className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                  <FolderSearch className="size-3.5 text-brand-600" />
                  {stat.label}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-neutral-900">{stat.value}</span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                      stat.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600",
                    )}
                  >
                    {stat.up ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                    {stat.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
            {/* Sales overview */}
            <div className="rounded-lg bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] text-neutral-600">Sales Overview</p>
                  <p className="mt-1 flex items-center gap-2 text-xl font-bold text-neutral-900">
                    ₦240.8K
                    <span className="flex items-center gap-0.5 rounded-full bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold text-green-700">
                      <TrendingUp className="size-2.5" />
                      8.4%
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-neutral-600">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-amber-500" /> Expenses
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-brand-600" /> Revenue
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <div className="flex h-28 flex-col justify-between text-[9px] text-neutral-500">
                  {yLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <svg viewBox="0 0 400 120" className="h-28 min-w-0 flex-1" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="dash-revenue" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#008c4b" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#008c4b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 24, 48, 72, 96, 120].map((y) => (
                    <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#e5e5e5" strokeDasharray="3 4" />
                  ))}
                  <path
                    d="M0 100 C50 92 80 80 120 84 S190 100 240 78 S320 70 360 62 S390 58 400 54"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 92 C40 82 60 52 100 60 S170 96 210 62 S290 22 330 42 S380 32 400 18 L400 120 L0 120 Z"
                    fill="url(#dash-revenue)"
                  />
                  <path
                    d="M0 92 C40 82 60 52 100 60 S170 96 210 62 S290 22 330 42 S380 32 400 18"
                    fill="none"
                    stroke="#008c4b"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-lg bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900">Today&apos;s Alerts</p>
                <span className="text-[10px] font-semibold text-brand-600">View All</span>
              </div>
              <ul className="mt-3">
                {alerts.map((alert) => (
                  <li
                    key={alert.title}
                    className="flex items-center justify-between gap-2 border-b border-neutral-200 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-neutral-800">{alert.title}</p>
                      <p className="mt-0.5 truncate text-[9px] text-neutral-500">{alert.detail}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-medium text-red-600">
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