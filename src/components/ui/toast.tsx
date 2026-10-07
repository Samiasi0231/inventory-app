"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, XIcon } from "lucide-react"
import { cn } from "cn"

export type ToastType = "success" | "error" | "info"

const toastIcons: Record<ToastType, typeof InfoIcon> = {
  success: CircleCheckIcon,
  error: CircleAlertIcon,
  info: InfoIcon,
}

const toastAccent: Record<ToastType, string> = {
  success: "text-success-fg",
  error: "text-danger-fg",
  info: "text-ink-3",
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toast) => {
    const type = (toast.type as ToastType) ?? "info"
    const Icon = toastIcons[type] ?? InfoIcon

    return (
      <ToastPrimitive.Root
        key={toast.id}
        toast={toast}
        className={cn(
          "absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] w-[360px] max-w-[calc(100vw-2rem)]",
          "rounded-xl bg-popover p-4 shadow-lg ring-1 ring-black/5",
          "[transform:translateY(calc(var(--toast-offset-y)*-1))] transition-all duration-200",
          "data-[starting-style]:translate-y-4 data-[starting-style]:opacity-0",
          "data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0"
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn("mt-0.5 size-5 shrink-0", toastAccent[type])} />
          <div className="flex-1 space-y-0.5">
            <ToastPrimitive.Title className="text-sm font-semibold text-ink-1" />
            <ToastPrimitive.Description className="text-xs leading-relaxed text-ink-3" />
          </div>
          <ToastPrimitive.Close
            aria-label="Dismiss notification"
            className="-m-1 rounded-md p-1 text-ink-4 transition-colors hover:bg-surface-muted hover:text-ink-2"
          >
            <XIcon className="size-4" />
          </ToastPrimitive.Close>
        </div>
      </ToastPrimitive.Root>
    )
  })
}

/** Mounted once near the root. */
export function Toaster() {
  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="fixed right-6 bottom-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)]">
        <ToastList />
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  )
}

export const ToastProvider = ToastPrimitive.Provider
export const useToast = ToastPrimitive.useToastManager
