"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";

interface FormSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function FormSelect({
  label,
  value,
  options,
  onChange,
  error,
  required,
  placeholder = "Select",
  className,
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <FormField
      label={label}
      htmlFor={id}
      required={required}
      error={error}
      className={className}
    >
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 text-sm outline-none",
            error
              ? "border-red-500"
              : value
                ? "border-emerald-600"
                : "border-gray-200",
          )}
        >
          <span className={cn(value ? "text-gray-800" : "text-gray-400")}>
            {value || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-gray-500 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-emerald-600 bg-white py-1 shadow-lg"
          >
            {options.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={opt === value}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer px-3 py-2 text-xs text-gray-800 hover:bg-emerald-50",
                  opt === value && "bg-emerald-50 font-medium",
                )}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
}
