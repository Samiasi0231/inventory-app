import type { ChartPoint } from "./types";

export function groupWeekly(points: ChartPoint[]): ChartPoint[] {
  const weeks: ChartPoint[] = [];
  for (let index = 0; index < points.length; index += 7) {
    const days = points.slice(index, index + 7);
    weeks.push({
      label: `${days[0].label}–${days[days.length - 1].label}`,
      value: days.reduce((total, day) => total + day.value, 0),
    });
  }
  return weeks;
}

export function formatAxisCurrency(value: number) {
  if (value >= 1_000_000) return `₦${value / 1_000_000}M`;
  if (value >= 1000) return `₦${value / 1000}K`;
  return `₦${value}`;
}
