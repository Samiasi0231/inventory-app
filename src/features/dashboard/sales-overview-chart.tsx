"use client";

import { useId, useState } from "react";
import type { SalesPoint } from "@/types/dashboard";
import { formatCurrencyCompact } from "@/lib/format";

const WIDTH = 600;
const HEIGHT = 200;
const PAD_X = 24;

/** Picks a round gridline step (1, 2, 2.5, 5 × 10ⁿ) that gives ~5 intervals. */
function niceStep(max: number) {
  if (max <= 0) return 1;
  const raw = max / 5;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const multiplier = [1, 2, 2.5, 5, 10].find((candidate) => normalized <= candidate) ?? 10;
  return multiplier * magnitude;
}

function formatAxis(value: number) {
  if (value === 0) return "₦0K";
  if (value >= 1_000_000) return `₦${+(value / 1_000_000).toFixed(1)}M`;
  return `₦${+(value / 1_000).toFixed(0)}K`;
}

export function SalesOverviewChart({ points }: { points: SalesPoint[] }) {
  const gradientId = useId();
  const [hovered, setHovered] = useState<number | null>(null);

  if (points.length === 0) return null;

  const max = Math.max(...points.map((point) => point.value));
  const step = niceStep(max);
  // One interval of headroom above the tallest point.
  const ceiling = step * (Math.floor(max / step) + 1);
  const tickCount = Math.round(ceiling / step);
  const yLabels = Array.from({ length: tickCount + 1 }, (_, index) => ceiling - index * step);

  const stepX = points.length > 1 ? (WIDTH - PAD_X * 2) / (points.length - 1) : 0;
  const coords = points.map((point, index) => ({
    x: points.length > 1 ? PAD_X + index * stepX : WIDTH / 2,
    y: HEIGHT - (point.value / ceiling) * HEIGHT,
  }));

  const line = coords.map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${coords[coords.length - 1].x},${HEIGHT} L${coords[0].x},${HEIGHT} Z`;
  const activePoint = hovered === null ? null : points[hovered];
  const activeCoord = hovered === null ? null : coords[hovered];

  return (
    <div className="flex gap-3">
      <div className="relative h-52 w-11 shrink-0 text-[10px] text-ink-3">
        {yLabels.map((value, index) => (
          <span
            key={value}
            className="absolute right-0 -translate-y-1/2 leading-none"
            style={{ top: `${(index / tickCount) * 100}%` }}
          >
            {formatAxis(value)}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative h-52">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            className="size-full overflow-visible text-primary"
            role="img"
            aria-label="Sales over time"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {yLabels.map((value, index) => (
              <line
                key={value}
                x1={0}
                x2={WIDTH}
                y1={(HEIGHT / tickCount) * index}
                y2={(HEIGHT / tickCount) * index}
                stroke="currentColor"
                strokeOpacity={0.25}
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <path d={area} fill={`url(#${gradientId})`} />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {coords.map(({ x }, index) => (
              <rect
                key={index}
                x={x - Math.max(stepX, 1) / 2}
                y={0}
                width={Math.max(stepX, 1)}
                height={HEIGHT}
                fill="transparent"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>

          {coords.map(({ x, y }, index) => (
            <span
              key={index}
              aria-hidden
              className={
                hovered === index
                  ? "pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-surface"
                  : "pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
              }
              style={{ left: `${(x / WIDTH) * 100}%`, top: `${(y / HEIGHT) * 100}%` }}
            />
          ))}

          {activePoint && activeCoord && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink-1 px-2 py-1 text-xs whitespace-nowrap text-surface shadow"
              style={{
                left: `${Math.min(Math.max((activeCoord.x / WIDTH) * 100, 10), 90)}%`,
                top: `calc(${(activeCoord.y / HEIGHT) * 100}% - 12px)`,
              }}
            >
              {activePoint.label}: {formatCurrencyCompact(activePoint.value)}
            </div>
          )}
        </div>

        <div className="relative mt-2 h-4 text-[10px] text-ink-3">
          {points.map((point, index) =>
            point.axisLabel ? (
              <span
                key={index}
                className="absolute -translate-x-1/2"
                style={{ left: `${(coords[index].x / WIDTH) * 100}%` }}
              >
                {point.axisLabel}
              </span>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}