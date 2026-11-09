/** Shared display formatters. */

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactNairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** "₦55,000.00" — exact amounts, e.g. table cells. */
export function formatCurrency(value: number) {
  return nairaFormatter.format(value);
}

/** "₦650,400,000" — rounded, for summary figures. */
export function formatCurrencyCompact(value: number) {
  return compactNairaFormatter.format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
}

/** "+5.2%" / "-5.2%", always signed. */
export function formatPercentDelta(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG")}`;

/** Safely converts an ISO date string into a Date object. */
function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

/** "06 Nov 2026" */
export const formatDate = (iso: string | null | undefined) => {
  const date = parseDate(iso);
  if (!date) return "--";

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

/** "November 2026" */
export const formatMonthYear = (iso: string | null | undefined) => {
  const date = parseDate(iso);
  if (!date) return "--";

  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    year: "numeric",
  }).format(date);
};