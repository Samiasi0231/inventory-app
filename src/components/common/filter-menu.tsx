"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, Filter as FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** An option whose stored value differs from what's shown (e.g. id → name), optionally with an icon. */
export interface FilterOption<T extends string = string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
}

/** One select inside the filter menu. */
export interface FilterGroup {
  id: string;
  /** Field heading (e.g. "Status"). */
  label?: ReactNode;
  value: string;
  options: readonly (string | FilterOption)[];
  /** The "no filter" value (e.g. "all"). */
  defaultValue: string;
  /** Text shown for the default option (e.g. "All statuses"). */
  defaultLabel?: string;
  onChange: (value: string) => void;
}

interface Props<T extends string> {
  /** Single list: pass value / options / onChange / defaultValue. */
  value?: T;
  options?: readonly (T | FilterOption<T>)[];
  onChange?: (value: T) => void;
  defaultValue?: T;
  defaultLabel?: string;
  /** Multiple lists in one menu. */
  groups?: readonly FilterGroup[];
  /** Optional shared reset handler. */
  onClear?: () => void;
  /** Optional shared apply handler. */
  onApply?: (values: Record<string, string>) => void;
  label?: ReactNode;
  icon?: ReactNode;
  className?: string;
  align?: "left" | "right";
}

function toItems(
  options: readonly (string | FilterOption)[],
): FilterOption[] {
  return options.map((option) =>
    typeof option === "string" ? { value: option } : option,
  );
}

/** Custom select with green hover and selected states. */
function SelectField({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-lg border bg-white px-3 pr-10 text-left text-base text-ink-2 outline-none transition-colors focus-visible:border-primary",
          open ? "border-primary" : "border-border",
        )}
      >
        {selected?.icon && (
          <span
            aria-hidden
            className="flex shrink-0 items-center text-primary [&>svg]:size-4"
          >
            {selected.icon}
          </span>
        )}

        <span className="truncate">
          {selected?.label ?? selected?.value}
        </span>
      </button>

      <ChevronDown
        size={16}
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 transition-transform",
          open && "rotate-180",
        )}
      />

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border/60 bg-white p-1 shadow-[0_10px_30px_rgba(47,47,47,0.12)]"
        >
          {options.map((item) => {
            const isSelected = item.value === value;

            return (
              <li key={item.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-ink-2 transition-colors",
                    "hover:bg-green-50 hover:text-green-700",
                    "focus-visible:bg-green-50 focus-visible:outline-none",
                    isSelected &&
                      "bg-green-100 font-medium text-green-800",
                  )}
                >
                  {item.icon && (
                    <span
                      aria-hidden
                      className={cn(
                        "flex shrink-0 items-center [&>svg]:size-3.5",
                        isSelected
                          ? "text-green-700"
                          : "text-ink-3 group-hover:text-green-700",
                      )}
                    >
                      {item.icon}
                    </span>
                  )}

                  <span className="truncate">
                    {item.label ?? item.value}
                  </span>

                  {isSelected && (
                    <Check className="ml-auto size-3.5 shrink-0 text-green-700" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Generic filter control with one select per group.
 * Selections remain drafts until Apply is clicked.
 */
export function FilterMenu<T extends string>({
  value,
  options,
  onChange,
  defaultValue,
  defaultLabel,
  groups,
  onClear,
  onApply,
  label,
  icon,
  className,
  align = "right",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const ref = useRef<HTMLDivElement>(null);

  const resolved: readonly FilterGroup[] =
    groups ??
    (value !== undefined && options && onChange
      ? [
          {
            id: "filter",
            value,
            options,
            defaultValue: defaultValue ?? "",
            defaultLabel,
            onChange: onChange as (next: string) => void,
          },
        ]
      : []);

  const activeCount = resolved.filter(
    (group) => group.value !== group.defaultValue,
  ).length;

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }

    // Start with the currently applied values whenever the panel opens.
    setDraft(
      Object.fromEntries(
        resolved.map((group) => [group.id, group.value]),
      ),
    );

    setOpen(true);
  }

  function clearAll() {
    if (onClear) {
      onClear();
    } else {
      resolved.forEach((group) => {
        if (group.value !== group.defaultValue) {
          group.onChange(group.defaultValue);
        }
      });
    }

    setOpen(false);
  }

  function apply() {
    const next = Object.fromEntries(
      resolved.map((group) => [
        group.id,
        draft[group.id] ?? group.value,
      ]),
    );

    if (onApply) {
      onApply(next);
    } else {
      resolved.forEach((group) => {
        if (next[group.id] !== group.value) {
          group.onChange(next[group.id]);
        }
      });
    }

    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg border bg-white px-3 text-xs font-medium text-primary shadow-[0_1px_2px_rgba(47,47,47,0.04)] transition-colors hover:border-primary",
          open || activeCount > 0
            ? "border-primary"
            : "border-border",
          className,
        )}
      >
        {icon ?? <FilterIcon size={14} />}

        {label ?? "Filter"}

        {activeCount > 0 && (
          <span className="grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] leading-4 text-white">
            {activeCount}
          </span>
        )}

        <ChevronDown
          size={14}
          className={cn(
            "transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Filters"
          className={cn(
            "absolute z-20 mt-1 flex w-[320px] max-w-[calc(100vw-2rem)] max-h-[80vh] flex-col gap-5 overflow-y-auto overscroll-contain rounded-xl border border-border/60 bg-white p-5 shadow-[0_10px_30px_rgba(47,47,47,0.12)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {resolved.map((group) => {
            const allItems = toItems(group.options);
            const items = allItems.filter(
              (item) => item.value !== group.defaultValue,
            );

            const defaultItem = allItems.find(
              (item) => item.value === group.defaultValue,
            );

            const defaultText =
              group.defaultLabel ??
              (typeof defaultItem?.label === "string"
                ? defaultItem.label
                : group.defaultValue);

            const selectId = `filter-${group.id}`;

            return (
              <div key={group.id} className="flex flex-col gap-2">
                {group.label && (
                  <label
                    htmlFor={selectId}
                    className="text-sm font-medium text-ink-2"
                  >
                    {group.label}
                  </label>
                )}

                <SelectField
                  id={selectId}
                  value={draft[group.id] ?? group.value}
                  onChange={(next) =>
                    setDraft((current) => ({
                      ...current,
                      [group.id]: next,
                    }))
                  }
                  options={[
                    {
                      value: group.defaultValue,
                      label: defaultText,
                    },
                    ...items,
                  ]}
                />
              </div>
            );
          })}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={clearAll}
              className="h-11 rounded-lg border border-border bg-white text-sm font-bold text-primary transition-colors hover:bg-green-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={apply}
              className="h-11 rounded-lg bg-primary text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
