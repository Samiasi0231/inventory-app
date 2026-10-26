"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { CalendarIcon } from "lucide-react";
import { TextInput } from "@/components/form/app-fields";
import { formatReviewDate } from "./review";

export const PurchaseDateInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<typeof TextInput> & {
    displayValue?: string;
    showIcon?: boolean;
  }
>(
  (
    {
      displayValue = "",
      placeholder = "Select Date",
      showIcon = true,
      ...props
    },
    ref,
  ) => (
    <div className="purchase-date-input">
      <TextInput ref={ref} type="date" {...props} />
      <span aria-hidden="true">
        {formatReviewDate(displayValue, placeholder)}
      </span>
      {showIcon && (
        <CalendarIcon aria-hidden="true" size={20} strokeWidth={1.5} />
      )}
    </div>
  ),
);
PurchaseDateInput.displayName = "PurchaseDateInput";
