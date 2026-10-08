"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form controls for the application screens. The auth screens use the denser
 * `fieldClass` in `lib/filed-styles.ts`.
 */

export const controlClass =
  "h-[42px] w-full rounded-lg border border-border bg-surface px-4 text-sm text-ink-1 outline-none transition-colors " +
  "placeholder:text-ink-4 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 " +
  "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-70";

export const controlErrorClass =
  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15";

interface FieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm text-ink-2">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-4">{hint}</p>
      ) : null}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<"input"> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(controlClass, invalid && controlErrorClass, className)}
      {...props}
    />
  ),
);
TextInput.displayName = "TextInput";

export const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea"> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      controlClass,
      "h-auto min-h-[96px] resize-y py-3 leading-relaxed",
      invalid && controlErrorClass,
      className,
    )}
    {...props}
  />
));
TextareaInput.displayName = "TextareaInput";

export const SelectInput = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<"select"> & { invalid?: boolean }
>(({ className, invalid, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlClass,
        // An empty value is the placeholder option, so draw it as placeholder text.
        "appearance-none pr-10 has-[option[value='']:checked]:text-ink-4",
        invalid && controlErrorClass,
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDownIcon
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-3"
    />
  </div>
));
SelectInput.displayName = "SelectInput";
