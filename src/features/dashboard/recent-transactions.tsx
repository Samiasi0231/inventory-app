"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type {
  DashboardTransaction,
  TransactionStatus,
  TransactionType,
} from "@/types/dashboard";

const TYPE_STYLES: Record<TransactionType, { label: string; className: string }> = {
  sale: { label: "Sale", className: "border-green-200 bg-green-50 text-green-700" },
  refund: { label: "Refund", className: "border-red-200 bg-red-50 text-destructive" },
  purchase: { label: "Purchase", className: "border-purple-200 bg-purple-50 text-purple-700" },
  expense: { label: "Operational Expenses", className: "border-orange-200 bg-orange-50 text-orange-700" },
};

const STATUS_STYLES: Record<TransactionStatus, { label: string; dot: string; text: string }> = {
  pending: { label: "Pending", dot: "bg-amber-500", text: "text-amber-700" },
  successful: { label: "Successful", dot: "bg-green-600", text: "text-green-700" },
  failed: { label: "Failed", dot: "bg-destructive", text: "text-destructive" },
};

/** Where "View details" goes for each transaction type. Adjust to your routes. */
const DETAIL_ROUTES: Record<TransactionType, string> = {
  sale: "/sales/orders",
  refund: "/sales/orders",
  purchase: "/purchasing/orders",
  expense: "/purchasing/orders",
};

const HEADERS = ["Ref", "Type", "Amount", "Status", "Branch", "Date & Time", "Actions"];

const amountFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** "Today, 10:42am" / "Yesterday, 8:15pm" / "12 Oct, 3:05pm". */
function formatWhen(iso: string) {
  const date = new Date(iso);
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const daysAgo = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000);

  const time = date
    .toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\s/g, "")
    .toLowerCase();

  if (daysAgo === 0) return `Today, ${time}`;
  if (daysAgo === 1) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}, ${time}`;
}

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
  total: number;
  viewAllHref?: string;
}

export function RecentTransactions({
  transactions,
  total,
  viewAllHref = "/sales/orders",
}: RecentTransactionsProps) {
  const router = useRouter();

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-ink-1">Recent Transactions</h2>
        <Link href={viewAllHref} className="text-xs font-semibold text-primary hover:underline">
          View All
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-3">
          Sales, refunds and purchases will appear here as they happen.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="bg-surface-muted text-xs font-medium text-ink-3">
                  {HEADERS.map((header, index) => (
                    <th
                      key={header}
                      scope="col"
                      className={cn(
                        "px-4 py-3 font-medium",
                        index === 0 && "rounded-l-lg",
                        index === HEADERS.length - 1 && "rounded-r-lg text-right",
                      )}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((transaction) => {
                  const type = TYPE_STYLES[transaction.type];
                  const status = STATUS_STYLES[transaction.status];
                  return (
                    <tr key={transaction.id} className="text-xs text-ink-1">
                      <td className="px-4 py-4 font-medium">{transaction.reference}</td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
                            type.className,
                          )}
                        >
                          {type.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{amountFormatter.format(transaction.amount)}</td>
                      <td className="px-4 py-4">
                        <span className={cn("flex items-center gap-1.5 font-medium", status.text)}>
                          <span aria-hidden className={cn("size-1.5 rounded-full", status.dot)} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{transaction.branch}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{formatWhen(transaction.occurredAt)}</td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label={`Actions for ${transaction.reference}`}
                            className="rounded-md p-1 text-ink-3 transition-colors hover:bg-surface-muted hover:text-ink-1"
                          >
                            <MoreHorizontalIcon className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => router.push(DETAIL_ROUTES[transaction.type])}>
                              View details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-ink-3">
            Showing {transactions.length} of {total} entries
          </p>
        </>
      )}
    </section>
  );
}