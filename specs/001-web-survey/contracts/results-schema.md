# Contract: Results Aggregation Schema

**File**: `src/app/results/page.tsx` (Server Component)

## Purpose

Defines the TypeScript types produced by server-side aggregation of all `responses` rows,
consumed by chart components.

## Types

```typescript
// A single category + count for bar/pie charts
export interface ChartEntry {
  label: string;  // Human-readable label (e.g., "Spring 2026")
  count: number;  // Number of responses in this category
}

// Full aggregated data passed to the results page
export interface ResultsData {
  totalResponses: number;
  graduationSemester: ChartEntry[];  // 5 entries (one per dropdown option)
  internshipExperience: ChartEntry[]; // 3 entries
  jobStatus: ChartEntry[];            // 3 entries
  roleTypes: ChartEntry[];            // up to 5 entries
}
```

## Label Mappings

Internal DB values → display labels:

**`internship_experience`**:
- `"none"` → `"No internships"`
- `"one"` → `"One internship"`
- `"multiple"` → `"Multiple internships"`

**`job_status`**:
- `"yes"` → `"Job/offer lined up"`
- `"no"` → `"Nothing lined up yet"`
- `"exploring"` → `"Still exploring"`

**`role_types`** (array elements):
- `"full_time"` → `"Full-time employment"`
- `"grad_school"` → `"Graduate school"`
- `"entrepreneurship"` → `"Entrepreneurship"`
- `"freelance"` → `"Freelance / consulting"`
- `"unsure"` → `"Not sure yet"`

## Chart Component Contracts

### `BarChart`

```typescript
interface BarChartProps {
  title: string;
  data: ChartEntry[];
  colorClass?: string; // Tailwind bg class, e.g. "bg-indigo-500"
}
```

Renders a horizontal SVG bar chart. Each bar's width is proportional to
`entry.count / maxCount * 100%`.

### `PieChart`

```typescript
interface PieChartProps {
  title: string;
  data: ChartEntry[];
}
```

Renders an SVG pie chart with labeled slices. Slice arc calculated from
`entry.count / totalResponses * 2π`.

## Visualizations on Results Page

| # | Chart | Type | Data field |
|---|-------|------|------------|
| 1 | Graduation semester distribution | BarChart | `graduationSemester` |
| 2 | Internship experience | PieChart | `internshipExperience` |
| 3 | Job status after graduation | BarChart | `jobStatus` |
| 4 | Roles being pursued | BarChart | `roleTypes` |
