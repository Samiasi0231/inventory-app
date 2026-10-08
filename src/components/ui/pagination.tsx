"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "cn"

/**
 * Builds the page window: always the first page, always the last, the current
 * page with a neighbour either side, and `null` where a gap was collapsed.
 */
function buildPageRange(current: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, totalPages, current])
  if (current - 1 > 1) pages.add(current - 1)
  if (current + 1 < totalPages) pages.add(current + 1)
  // Keep the leading run stable so the control does not jump about on page 1.
  if (current <= 3) {
    pages.add(2)
    pages.add(3)
  }
  if (current >= totalPages - 2) {
    pages.add(totalPages - 1)
    pages.add(totalPages - 2)
  }

  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const result: (number | null)[] = []
  let previous = 0
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push(null)
    result.push(page)
    previous = page
  }
  return result
}

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  /** Overrides the "Showing N of M entries" caption. */
  label?: string
  className?: string
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  label,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const shown = Math.min(pageSize, Math.max(0, total - (page - 1) * pageSize))
  const range = buildPageRange(page, totalPages)

  return (
    <div className={cn("flex w-full flex-col items-center gap-2.5 py-3", className)}>
      <p className="text-xs tracking-[0.18px] text-ink-3">
        {label ?? `Showing ${shown} of ${total} entries`}
      </p>

      <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeftIcon className="size-4" />
        </button>

        {range.map((entry, index) =>
          entry === null ? (
            <span
              key={`gap-${index}`}
              aria-hidden
              className="flex size-8 items-center justify-center text-xs text-[#48505e]"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? "page" : undefined}
              className={cn(
                "flex size-8 items-center justify-center text-xs font-medium tracking-[0.18px] transition-colors",
                entry === page
                  ? "rounded-lg bg-accent text-accent-foreground"
                  : "rounded-full text-[#48505e] hover:bg-surface-muted"
              )}
            >
              {entry}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </nav>
    </div>
  )
}
