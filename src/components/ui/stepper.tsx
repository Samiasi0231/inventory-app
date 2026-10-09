"use client"

import { CheckIcon } from "lucide-react"
import { cn } from "cn"

export interface StepperStep {
  id: string
  label: string
}

interface StepperProps {
  steps: StepperStep[]
  /** Zero-based index of the step currently being edited. */
  currentIndex: number
  /** Called when an already-completed step is clicked. Omit to make steps inert. */
  onStepSelect?: (index: number) => void
  className?: string
}

export function Stepper({ steps, currentIndex, onStepSelect, className }: StepperProps) {
  return (
    <ol className={cn("flex w-full items-center justify-between gap-2", className)}>
      {steps.map((step, index) => {
        const isComplete = index < currentIndex
        const isCurrent = index === currentIndex
        const isNavigable = isComplete && Boolean(onStepSelect)

        return (
          <li key={step.id} className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              disabled={!isNavigable}
              onClick={isNavigable ? () => onStepSelect?.(index) : undefined}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg outline-none",
                "focus-visible:ring-3 focus-visible:ring-ring/30",
                isNavigable ? "cursor-pointer" : "cursor-default"
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isComplete && !isCurrent && "border border-border text-ink-4"
                )}
              >
                {isComplete ? <CheckIcon className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-xs tracking-[0.18px] transition-colors",
                  isCurrent && "font-semibold text-primary",
                  isComplete && "font-medium text-primary",
                  !isComplete && !isCurrent && "text-ink-4"
                )}
              >
                {step.label}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
