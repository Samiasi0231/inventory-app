"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, CircleHelp, Download, FolderSearch, LayoutGrid, Plus, Search, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pixel-exact copy of the design. Everything below is written in the design's own pixels
 * (a 786px-wide frame, measured from the Figma screenshot) and the whole frame is scaled to fit
 * whatever width it is given, so every proportion stays identical at any screen size.
 * The hero crops the bottom edge, so only the top ~265px of the design is visible.
 */
const DESIGN_WIDTH = 786;

const sidebar: { label: string; y: number }[] = [
  { label: "Dashboard", y: 62 },
  { label: "Sales", y: 88 },
  { label: "Purchasing", y: 114 },
  { label: "Inventory", y: 138 },
  { label: "Products", y: 162 },
  { label: "People", y: 186 },
  { label: "Reports", y: 210 },
  { label: "Settings", y: 234 },
];

const stats = [
  { label: "Net Sales", value: "₦55,000,000", delta: "+5.2%", up: true },
  { label: "Expenses", value: "₦55,000,000", delta: "-5.2%", up: false },
  { label: "Net Profit", value: "₦55,000,000", delta: "+6.2%", up: true },
  { label: "Stock Value", value: "₦55,000,000", delta: "-5.2%", up: false },
];

const alerts = [
  { title: "Ikeja - Low Stock Alert", detail: "Only 2 cartons of Indomie left in inventory" },
  { title: "Ikeja - Low Stock Alert", detail: "Only 2 cartons of Indomie left in inventory" },
  { title: "Lekki - Expiry Alert", detail: "12 packs of Paracetamol expire in 14 days" },
];

const yLabels = ["250K", "200K", "150K", "100K", "50K", "0"];
const PLOT_W = 295;
const PLOT_H = 130;

export function DashboardPreview() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [frameHeight, setFrameHeight] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    if (!wrap || !frame) return;
    const update = () => {
      setScale(wrap.clientWidth / DESIGN_WIDTH);
      setFrameHeight(frame.offsetHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none w-full select-none overflow-hidden"
      style={{ height: scale ? frameHeight * scale : undefined, visibility: scale ? "visible" : "hidden" }}
    >
      <div
        ref={frameRef}
        style={{ width: DESIGN_WIDTH, transform: `scale(${scale ?? 1})`, transformOrigin: "top left" }}
        className="flex overflow-hidden rounded-t-[14px] border border-b-0 border-white/50 bg-white text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
      >
        {/* Sidebar: 132px wide, items at fixed y positions */}
        <aside className="relative w-[132px] shrink-0 border-r border-neutral-200 bg-white">
          {sidebar.map((item) => (
            <div
              key={item.label}
              className="absolute left-[23px] flex h-4 items-center gap-[5px] text-[7.5px] leading-none text-neutral-700"
              style={{ top: item.y - 8 }}
            >
              <LayoutGrid className="size-2 shrink-0" strokeWidth={1.75} />
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main: 654px wide */}
        <div className="min-w-0 flex-1 bg-neutral-50 pb-[17px]">
          {/* Top bar — white, 43px tall */}
          <div className="relative h-[43px] bg-white">
            <span className="absolute left-[17px] top-[16px] text-[8.5px] font-semibold leading-[11px] text-neutral-900">
              Dashboard
            </span>
            <div className="absolute left-[165px] top-[10px] flex h-[23px] w-[219px] items-center gap-[6px] rounded-md border border-neutral-300 bg-white px-[9px] text-[8px] text-neutral-400">
              <Search className="size-[10px]" />
              Input
            </div>
            <span className="absolute left-[487px] top-[10px] grid size-[22px] place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700">
              <Bell className="size-[10px]" />
              <span className="absolute right-[5px] top-[4px] size-[4px] rounded-full bg-red-500 ring-1 ring-white" />
            </span>
            <span className="absolute left-[519px] top-[10px] grid size-[22px] place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700">
              <CircleHelp className="size-[10px]" />
            </span>
            <span className="absolute left-[550px] top-[9px] flex h-[25px] w-[86px] items-center justify-center gap-[5px] rounded-md bg-brand-600 text-[8px] font-semibold text-white">
              <Plus className="size-[10px]" />
              Quick Add
            </span>
          </div>

          <div className="px-[17px]">
            {/* Overview card: 34px tall, 18px under the top bar */}
            <div className="relative mt-[18px] flex h-[34px] items-center rounded-md bg-white px-[9px]">
           <span className="text-[11px] font-medium text-neutral-900">Overview</span>
              <span className="absolute left-[438px] top-[8px] flex h-[18px] w-[56px] items-center justify-center gap-[6px] rounded border border-neutral-300 text-[7.5px] text-neutral-700">
                Branch <ChevronDown className="size-[8px]" />
              </span>
              <span className="absolute left-[502px] top-[8px] flex h-[18px] w-[47px] items-center justify-center gap-[6px] rounded border border-neutral-300 text-[7.5px] text-neutral-700">
                Date <ChevronDown className="size-[8px]" />
              </span>
              <span className="absolute left-[565px] top-[11px] flex items-center gap-[4px] text-[7.5px] font-semibold leading-none text-brand-600">
                <Download className="size-[8px]" /> Export
              </span>
            </div>

            {/* Stats: 55px tall cards, 13px apart */}
            <div className="mt-[13px] grid grid-cols-4 gap-[13px]">
              {stats.map((stat) => (
                <div key={stat.label} className="relative h-[55px] rounded-md border border-neutral-100 bg-white">
                  <span className="absolute left-[10px] top-[11px] flex items-center gap-[4px] text-[7px] leading-[10px] text-neutral-600">
                    <FolderSearch className="size-[9px] text-brand-600" />
                    {stat.label}
                  </span>
                  <span className="absolute left-[10px] top-[30px] text-[12px] font-medium leading-[13px] text-neutral-900">
                    {stat.value}
                  </span>
                  <span
                    className={cn(
                      "absolute right-[10px] top-[29px] flex h-[13px] items-center gap-[2px] rounded-full px-[5px] text-[7px] font-semibold leading-none",
                      stat.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600",
                    )}
                  >
                    {stat.up ? <TrendingUp className="size-[6px]" /> : <TrendingDown className="size-[6px]" />}
                    {stat.delta}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-[15px] grid grid-cols-[356px_1fr] gap-[13px]">
              {/* Sales overview: 356px wide; plot is 295 × 130 at (27, 63) */}
              <div className="relative h-[210px] rounded-md bg-white">
       <span className="absolute left-[17px] top-[16px] text-[8px] leading-[10px] text-neutral-600">
Sales Overview</span>
                <span className="absolute left-[17px] top-[32px] flex items-center gap-[7px] text-[13.5px] font-bold leading-4 text-neutral-900">
                  ₦240.8K
                  <span className="flex items-center gap-[2px] rounded-[3px] bg-green-50 px-[3px] py-[1px] text-[6px] font-semibold leading-[8px] text-green-700">
                    24.6% <TrendingUp className="size-[5px]" />
                  </span>
                </span>
                <span className="absolute right-[18px] top-[39px] flex items-center gap-[14px] text-[6.5px] leading-none text-neutral-600">
                  <span className="flex items-center gap-[4px]">
                    <span className="size-[4px] rounded-full bg-amber-500" /> Expenses
                  </span>
                  <span className="flex items-center gap-[4px]">
                    <span className="size-[4px] rounded-full bg-brand-600" /> Revenue
                  </span>
                </span>

                {yLabels.map((label, index) => (
                  <span
                    key={label}
                    className="absolute left-[17px] text-[6.5px] font-medium leading-[8px] text-brand-600"
                    style={{ top: 56 + index * 26 }}
                  >
                    {label}
                  </span>
                ))}

                <svg
                  width={PLOT_W}
                  height={PLOT_H}
                  viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
                  className="absolute left-[44px] top-[63px] overflow-visible"
                >
                  <defs>
                    <linearGradient id="dash-revenue" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#008c4b" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#008c4b" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {yLabels.map((label, index) => (
                    <line key={label} x1="0" x2={PLOT_W} y1={index * 26} y2={index * 26} stroke="#e7e7e7" strokeWidth="1" />
                  ))}
                  <path
                    d="M0 122 C40 118 80 112 120 114 S180 104 215 80 S262 58 295 44"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M0 112 C30 108 55 94 85 100 S130 106 160 88 S198 46 222 24 S268 8 295 0 L295 130 L0 130 Z"
                    fill="url(#dash-revenue)"
                  />
                  <path
                    d="M0 112 C30 108 55 94 85 100 S130 106 160 88 S198 46 222 24 S268 8 295 0"
                    fill="none"
                    stroke="#008c4b"
                    strokeWidth="1.2"
                  />
                  <line x1="192" x2="209" y1="7" y2="7" stroke="#2563eb" strokeWidth="2" />
                </svg>
              </div>

              {/* Alerts: 251px wide */}
              <div className="relative h-[210px] rounded-md bg-white">
                <span className="absolute left-[17px] top-[17px] text-[11px] font-medium leading-3 text-neutral-900">
                  Today&apos;s Alerts
                </span>
                <span className="absolute right-[18px] top-[19px] text-[6.5px] font-semibold leading-[10px] text-brand-600">
                  View All
                </span>
                <ul className="absolute inset-x-[17px] top-[40px]">
                  {alerts.map((alert, index) => (
                    <li key={index} className="relative mb-[4px] h-[25px] border-b border-neutral-200">
                      <span className="absolute left-0 top-[1px] text-[7px] font-semibold leading-[9px] text-neutral-800">
                        {alert.title}
                      </span>
                      <span className="absolute left-0 top-[12px] text-[5.5px] leading-[7px] text-neutral-500">
                        {alert.detail}
                      </span>
                      <span className="absolute right-[10px] top-[9px] flex h-[11px] items-center rounded-full border border-red-200 bg-red-50 px-[6px] text-[5.5px] font-medium leading-none text-red-600">
                        Urgent
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}