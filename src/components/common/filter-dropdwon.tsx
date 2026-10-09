"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props<T extends string> {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  /** Shown instead of the current value (e.g. "Filter") */
  label?: ReactNode;
  icon?: ReactNode;
  className?: string;
  align?: "left" | "right";
}

export function FilterDropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  icon,
  className,
  align = "right",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border border-emerald-600 bg-white px-3 text-xs text-emerald-700",
          className,
        )}
      >
        {icon}
        {label ?? value}
        <ChevronDown size={14} />
      </button>
      {open && (
        <ul
          className={cn(
            "absolute z-20 mt-1 min-w-full overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {options.map((o) => (
            <li
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={cn(
                "cursor-pointer whitespace-nowrap px-3 py-2 text-xs hover:bg-emerald-50",
                o === value && "bg-emerald-50 font-medium text-emerald-800",
              )}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
