import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-medium tracking-[0.18px] whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-surface-muted text-ink-2",
        success: "bg-success-bg text-success-fg",
        danger: "bg-danger-bg text-danger-fg",
        warning: "bg-amber-50 text-amber-700",
        info: "bg-sky-50 text-sky-700",
        purple: "bg-purple-50 text-purple-700",
        pink: "bg-pink-50 text-pink-700",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  /** Renders a leading dot, as used by the status pills. */
  dot?: boolean
}

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && <span aria-hidden className="size-1 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
