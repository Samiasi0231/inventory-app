import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  /** Primary call to action, e.g. an "Add Product" button. */
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-ink-4">
          <Icon className="size-6" />
        </span>
      )}
      <div className="space-y-1">
        <p className="text-base font-semibold text-ink-1">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-ink-3">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
