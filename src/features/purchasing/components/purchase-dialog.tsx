"use client";

import type { ComponentProps } from "react";
import { FormDialog } from "@/components/common/form-dialog";
import { cn } from "@/lib/utils";
import "../purchasing.css";

export function PurchaseDialog({
  className,
  ...props
}: ComponentProps<typeof FormDialog>) {
  return <FormDialog className={cn("purchase-dialog", className)} {...props} />;
}
