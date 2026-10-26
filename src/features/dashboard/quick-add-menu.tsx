"use client";

import { PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuickAddMenuProps {
  onAddProduct: () => void;
  onAddSalesOrder: () => void;
  onAddPurchaseOrder: () => void;
}

/** The dashboard's topbar action; other screens render a single primary button instead. */
export function QuickAddMenu({ onAddProduct, onAddSalesOrder, onAddPurchaseOrder }: QuickAddMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-white transition-colors hover:bg-primary/90 active:bg-primary">
        <PlusIcon className="size-5" />
        Quick Add
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onAddProduct}>Add Product</DropdownMenuItem>
        <DropdownMenuItem onClick={onAddSalesOrder}>Add Sales Order</DropdownMenuItem>
        <DropdownMenuItem onClick={onAddPurchaseOrder}>Add Purchase Order</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}