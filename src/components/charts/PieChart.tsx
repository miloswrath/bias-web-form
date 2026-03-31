import { ChartEntry } from "./BarChart";

interface PieChartProps {
  title: string;
  data: ChartEntry[];
}

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#34d399", "#f87171"];
const CX = 90;
const CY = 90;
const R = 72;

function polarToCartesian(angle: number) {
  return {
    x: CX + R * Math.cos(angle - Math.PI / 2),
    y: CY + R * Math.sin(angle - Math.PI / 2),
  };
}

function slicePath(startAngle: number, endAngle: number): string {
  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${CX} ${CY}`,
    `L ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
    `A ${R} ${R} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export function PieChart({ title, data }: PieChartProps) {
  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return null;

  const cumulativeAngles = data.reduce<number[]>((acc, entry) => {
    const prev = acc[acc.length - 1] ?? 0;
    return [...acc, prev + (entry.count / total) * 2 * Math.PI];
  }, []);

  const slices = data.map((entry, i) => {
    const startAngle = i === 0 ? 0 : cumulativeAngles[i - 1]!;
    const endAngle = cumulativeAngles[i]!;
    const path = slicePath(startAngle, endAngle);
    const color = COLORS[i % COLORS.length];
    return { ...entry, path, color };
  });

  const LEGEND_TOP = 196;
  const LEGEND_ROW_H = 22;
  const svgHeight = LEGEND_TOP + slices.length * LEGEND_ROW_H + 12;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
      <svg
        width="100%"
        viewBox={`0 0 180 ${svgHeight}`}
        aria-label={title}
        role="img"
      >
        {/* Pie slices */}
        {slices.map((slice) => (
          <path key={slice.label} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth={1.5} />
        ))}

        {/* Center count */}
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="18"
          fontWeight="700"
          fill="#111827"
        >
          {total}
        </text>
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="#6b7280"
        >
          responses
        </text>

        {/* Legend */}
        {slices.map((slice, i) => {
          const y = LEGEND_TOP + i * LEGEND_ROW_H;
          const pct = Math.round((slice.count / total) * 100);
          return (
            <g key={slice.label}>
              <rect x={4} y={y} width={12} height={12} rx={2} fill={slice.color} />
              <text x={22} y={y + 6} dominantBaseline="middle" fontSize="11" fill="#374151">
                {slice.label} ({pct}%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
