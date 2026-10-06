import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form/form-field";
import { fieldClass, fieldErrorClass } from "@/lib/filed-styles";
import { cn } from "@/lib/utils";
 
export interface TextFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
  /** Rendered between the input and the error message (helper text, links…). */
  hint?: ReactNode;
}
 
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, error, hint, className, ...props }, ref) => (
    <FormField label={label} htmlFor={id} error={error}>
      <Input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={cn(fieldClass, error && fieldErrorClass, className)}
        {...props}
      />
      {hint}
    </FormField>
  ),
);
TextField.displayName = "TextField";