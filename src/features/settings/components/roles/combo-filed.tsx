"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

interface ComboFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Input with a dropdown of suggestions (matches the design's chevron fields).
 * Pick an option or type your own value.
 */
export function ComboField({ label, value, onChange, options, placeholder, disabled }: ComboFieldProps) {
  const id = useId();
  const listId = `${id}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const query = value.trim().toLowerCase();
  const visible = filtering ? options.filter((option) => option.toLowerCase().includes(query)) : options;

  const select = (option: string) => {
    onChange(option);
    setOpen(false);
    setFiltering(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-medium text-ink-1">
        {label}
      </label>
      <div ref={rootRef} className="relative">
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onFocus={() => {
            if (disabled) return;
            setFiltering(false);
            setOpen(true);
          }}
          onChange={(event) => {
            onChange(event.target.value);
            setFiltering(true);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          className="h-11 w-full rounded-lg border border-border bg-surface pl-3 pr-10 text-sm text-ink-1 outline-none transition-colors placeholder:text-ink-3 focus:border-ring disabled:bg-surface-muted disabled:text-ink-2"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Show ${label} options`}
          disabled={disabled}
          onClick={() => {
            setFiltering(false);
            setOpen((current) => !current);
          }}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-3 disabled:cursor-default"
        >
          <ChevronDownIcon className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && visible.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-surface p-1 shadow-md"
          >
            {visible.map((option) => {
              const selected = option === value;
              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => select(option)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-ink-1 transition-colors hover:bg-surface-muted"
                  >
                    {option}
                    {selected && <CheckIcon className="size-4 text-ink-3" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}