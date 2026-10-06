import type { ButtonHTMLAttributes, ReactNode } from "react";
 
export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}