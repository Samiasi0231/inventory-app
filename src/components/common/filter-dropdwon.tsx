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
          "flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3 text-xs font-medium text-primary shadow-[0_1px_2px_rgba(47,47,47,0.04)] transition-colors hover:border-primary",
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
            "absolute z-20 mt-1 min-w-full overflow-hidden rounded-lg border border-border/60 bg-white p-1 shadow-[0_10px_30px_rgba(47,47,47,0.12)]",
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
                "cursor-pointer rounded-md whitespace-nowrap px-3 py-2 text-xs text-ink-2 hover:bg-surface-muted",
                o === value && "bg-accent font-medium text-accent-foreground",
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
