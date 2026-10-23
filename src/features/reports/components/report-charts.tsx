import type { CSSProperties } from "react";
import type {
  ChartInterval,
  ChartPoint,
  DonutItem,
  RankedItem,
} from "../types";

export function IntervalSelect({
  options,
  value,
  onChange,
}: {
  options: ChartInterval[];
  value: ChartInterval;
  onChange: (value: ChartInterval) => void;
}) {
  return (
    <div className="report-interval" aria-label="Chart interval" role="group">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function LineChart({
  points,
  ticks,
  max,
  height = 138,
  partialLastPoint = false,
  label,
}: {
  points: ChartPoint[];
  ticks: string[];
  max: number;
  height?: number;
  partialLastPoint?: boolean;
  label: string;
}) {
  const coordinates = points.map((point, index) => ({
    x: points.length === 1 ? 500 : 12 + (index * 972) / (points.length - 1),
    y: height - (point.value / max) * height,
  }));
  const previousPoint = coordinates[coordinates.length - 2];
  const lastPoint = coordinates[coordinates.length - 1];
  const solidPoints = partialLastPoint ? coordinates.slice(0, -1) : coordinates;
  return (
    <div className="report-chart-scroll">
      <div
        className="report-line-chart"
        style={{ "--plot-height": `${height}px` } as CSSProperties}
      >
        <div className="report-y-axis" aria-hidden="true">
          {ticks.map((tick, index) => (
            <span
              key={tick}
              style={{ top: `${(index / (ticks.length - 1)) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
        <div className="report-plot">
          <svg
            viewBox={`0 0 1000 ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={label}
          >
            {ticks.map((tick, index) => (
              <line
                key={tick}
                x1="0"
                x2="1000"
                y1={(index / (ticks.length - 1)) * height}
                y2={(index / (ticks.length - 1)) * height}
                className={
                  index === ticks.length - 1
                    ? "report-baseline"
                    : "report-gridline"
                }
              />
            ))}
            <polyline
              points={solidPoints
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              className="report-trend"
            />
            {partialLastPoint && previousPoint && lastPoint && (
              <line
                x1={previousPoint.x}
                y1={previousPoint.y}
                x2={lastPoint.x}
                y2={lastPoint.y}
                className="report-trend report-partial"
              />
            )}
            {coordinates.map((point, index) => (
              <circle
                key={points[index].label}
                cx={point.x}
                cy={point.y}
                r="3.5"
                className={
                  partialLastPoint && index === coordinates.length - 1
                    ? "report-point report-point-open"
                    : "report-point"
                }
              >
                <title>{`${points[index].label}: ${points[index].value.toLocaleString("en-NG")}`}</title>
              </circle>
            ))}
          </svg>
          <div className="report-x-axis">
            {points.map((point) => (
              <span key={point.label}>{point.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BarChart({
  items,
  spacing = "normal",
}: {
  items: RankedItem[];
  spacing?: "normal" | "wide" | "compact";
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <ul className={`report-bars report-bars-${spacing}`}>
      {items.map((item) => (
        <li key={item.label}>
          <span>{item.label}</span>
          <div className="report-bar-track">
            <div style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <small>{item.displayValue}</small>
        </li>
      ))}
    </ul>
  );
}

export function DonutChart({
  items,
  value,
  detail,
  roundLegend = false,
}: {
  items: DonutItem[];
  value?: string;
  detail?: string;
  roundLegend?: boolean;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const segments: string[] = [];
  for (const item of items) {
    const start = offset;
    offset += total > 0 ? (item.value / total) * 100 : 0;
    segments.push(`${item.color} ${start}% ${offset}%`);
  }
  return (
    <div className="report-donut-layout">
      <div
        className="report-donut"
        role="img"
        aria-label={items
          .map((item) => `${item.label}: ${item.displayValue}`)
          .join(", ")}
        style={{
          background:
            total > 0
              ? `conic-gradient(from 4deg, ${segments.join(", ")})`
              : "#f1f1f1",
        }}
      >
        <div>
          {value && <strong>{value}</strong>}
          {detail && <span>{detail}</span>}
        </div>
      </div>
      <ul
        className={
          roundLegend ? "report-legend report-legend-round" : "report-legend"
        }
      >
        {items.map((item) => (
          <li key={item.label}>
            <i style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
            <small>{item.displayValue}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
