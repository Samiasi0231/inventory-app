"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Border is green when the field has a value, grey when empty (matches the designs),
 * red on error. Relies on every input having a `placeholder`.
 */
const controlClass = (error?: string) =>
  cn(
    "w-full rounded-md border bg-white px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-100",
    error
      ? "border-red-500"
      : "border-emerald-600 placeholder-shown:border-gray-200 focus:border-emerald-600",
  );

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  fieldClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    { label, error, required, fieldClassName, className, ...props },
    ref,
  ) {
    const id = useId();
    return (
      <FormField
        label={label}
        htmlFor={id}
        required={required}
        error={error}
        className={fieldClassName}
      >
        <input
          id={id}
          ref={ref}
          className={cn(controlClass(error), "h-10", className)}
          {...props}
        />
      </FormField>
    );
  },
);

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  fieldClassName?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    { label, error, fieldClassName, className, ...props },
    ref,
  ) {
    const id = useId();
    return (
      <FormField
        label={label}
        htmlFor={id}
        error={error}
        className={fieldClassName}
      >
        <textarea
          id={id}
          ref={ref}
          className={cn(
            controlClass(error),
            "min-h-[84px] resize-y py-2",
            className,
          )}
          {...props}
        />
      </FormField>
    );
  },
);
