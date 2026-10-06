import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { FormField } from "@/components/form/form-field";
import { PasswordInput } from "@/components/form/password-input";
 
export interface PasswordFieldProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label: string;
  error?: string;
  /** Shown on the right of the error row, e.g. a "Forgot password" link. */
  action?: ReactNode;
  /** Rendered under the input, e.g. <PasswordRequirements />. */
  children?: ReactNode;
}
 
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, id, error, action, children, ...props }, ref) => (
    <FormField label={label} htmlFor={id} error={error} action={action}>
      <PasswordInput ref={ref} id={id} invalid={!!error} {...props} />
      {children}
    </FormField>
  ),
);
PasswordField.displayName = "PasswordField";