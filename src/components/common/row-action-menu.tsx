"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

export interface RowActionItem {
  key: string;
  label: string;
  icon: ReactNode;
  onSelect: () => void;
}

const MENU_WIDTH = 170;
const ITEM_HEIGHT = 36;

interface Props {
  items: RowActionItem[];
  ariaLabel: string;
  disabled?: boolean;
}

/**
 * The "..." button + floating menu used at the end of every table row.
 * Rendered in a portal with fixed positioning so overflow containers never clip it;
 * flips upward when there isn't room below.
 */
export function RowActionsMenu({ items, ariaLabel, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const height = items.length * ITEM_HEIGHT + 8;
    const flip = rect.bottom + height + 8 > window.innerHeight;
    setPos({
      top: flip ? rect.top - height - 4 : rect.bottom + 4,
      left: Math.max(8, rect.right - MENU_WIDTH),
    });
  }, [open, items.length]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !triggerRef.current?.contains(t))
        close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <MoreHorizontal size={16} />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: MENU_WIDTH,
            }}
            className="z-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  item.onSelect();
                }}
                className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
