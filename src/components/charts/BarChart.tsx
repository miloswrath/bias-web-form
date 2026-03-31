export interface ChartEntry {
  label: string;
  count: number;
}

interface BarChartProps {
  title: string;
  data: ChartEntry[];
  color?: string;
}

const LABEL_WIDTH = 160;
const BAR_AREA_WIDTH = 180;
const COUNT_WIDTH = 36;
const BAR_HEIGHT = 26;
const ROW_GAP = 10;
const PADDING = 16;
const SVG_WIDTH = LABEL_WIDTH + BAR_AREA_WIDTH + COUNT_WIDTH + PADDING * 2;

export function BarChart({ title, data, color = "#6366f1" }: BarChartProps) {
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count));
  const svgHeight = data.length * (BAR_HEIGHT + ROW_GAP) - ROW_GAP + PADDING * 2;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
        aria-label={title}
        role="img"
      >
        {data.map((entry, i) => {
          const y = PADDING + i * (BAR_HEIGHT + ROW_GAP);
          const barWidth =
            maxCount > 0 ? (entry.count / maxCount) * BAR_AREA_WIDTH : 0;

          return (
            <g key={entry.label}>
              {/* Label */}
              <text
                x={PADDING + LABEL_WIDTH - 8}
                y={y + BAR_HEIGHT / 2 + 1}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill="#4b5563"
              >
                {entry.label}
              </text>

              {/* Background track */}
              <rect
                x={PADDING + LABEL_WIDTH}
                y={y}
                width={BAR_AREA_WIDTH}
                height={BAR_HEIGHT}
                rx={4}
                fill="#f3f4f6"
              />

              {/* Value bar */}
              {barWidth > 0 && (
                <rect
                  x={PADDING + LABEL_WIDTH}
                  y={y}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={color}
                />
              )}

              {/* Count label */}
              <text
                x={PADDING + LABEL_WIDTH + BAR_AREA_WIDTH + 6}
                y={y + BAR_HEIGHT / 2 + 1}
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="600"
                fill="#374151"
              >
                {entry.count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
