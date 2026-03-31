# Research: Post-Undergraduate Plans Survey

**Branch**: `001-web-survey` | **Date**: 2026-03-31

## Decision Log

### 1. Chart Rendering Approach

**Decision**: SVG rendered inline in React Server Components — no external charting library.

**Rationale**: The constitution (Principle I) prohibits adding new npm dependencies without
a constitution amendment. SVG charts cover all required visualization types (bar, pie) with
full Tailwind-compatible styling and zero runtime overhead. For ~200 responses the data
volumes are trivial; a charting library would add bundle weight with no benefit.

**Alternatives considered**:
- `recharts` / `chart.js` / `@visx/*` — ruled out (new dependency, constitution violation)
- `<canvas>` with native 2D API — more verbose than SVG for static charts; SVG preferred

**Implementation approach**:
- `BarChart.tsx`: Renders `<svg>` with proportional `<rect>` elements. Percentage calculated
  server-side from aggregated counts.
- `PieChart.tsx`: Renders `<svg>` with `<path>` arcs calculated from response counts.
  Uses `Math.PI` — no library needed.

---

### 2. Form Submission Pattern

**Decision**: Next.js Server Action (`"use server"` in `actions.ts`) called from a
`"use client"` `SurveyForm` component.

**Rationale**: Server Actions in Next.js 16 (App Router) are the idiomatic way to handle
form mutations. They run server-side, keeping Supabase credentials out of the browser.
No API route (`/api/*`) is needed, reducing file count.

**Alternatives considered**:
- Next.js Route Handler (`POST /api/responses`) — more boilerplate; no benefit over Server Action
- Direct client-side Supabase call — would expose `NEXT_PUBLIC_SUPABASE_ANON_KEY` in browser;
  also conflicts with constitution's intent to keep DB credentials server-side

---

### 3. Results Data Fetching

**Decision**: Server Component (`app/results/page.tsx`) fetches directly from Supabase
and passes aggregated data as props to chart components.

**Rationale**: No client-side data fetching needed for a read-only results page. Server
Components avoid exposing credentials and enable caching via Next.js's built-in fetch cache.
Aggregation runs in TypeScript on the server (group-by using `Array.reduce`) rather than
in SQL, to stay simple and maintainable.

**Alternatives considered**:
- Client component + SWR/React Query — new dependency; unnecessary for a static results view
- Supabase RPC / SQL aggregation — would require a stored procedure; overkill for <1000 rows

---

### 4. Environment Variable Strategy

**Decision**: Use `SUPABASE_URL` and `SUPABASE_ANON_KEY` (no `NEXT_PUBLIC_` prefix).
Local dev values override the prod values documented in quickstart.

**Rationale**: Since all Supabase access is server-side (Server Actions + Server Components),
credentials never need to reach the browser. The existing `.env.local` already uses these
names. The `export` prefix works because direnv loads the file into the shell environment,
making vars available as `process.env` in the Next.js runtime.

**Local dev values** (documented in quickstart.md):
- `SUPABASE_URL=http://127.0.0.1:54321`
- `SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0Ww0r26yih-dakPJnef0nNeNk-zl4_MVKiOEBaY`

---

### 5. Data Storage — Arrays vs Join Table

**Decision**: Store `role_types` (checkbox Q5) as a `text[]` PostgreSQL array column.

**Rationale**: The role_types field is a fixed, small set of options answered once per
response. A join table would add a second migration, a second table to query, and join
complexity — all for a field that will only ever be read in aggregate. A `text[]` column
is simpler, supported natively by Supabase/PostgREST, and avoids over-engineering.

**Alternatives considered**:
- Separate `response_role_types` join table — normalized but adds unnecessary complexity
- Comma-separated string — loses type safety and requires parsing; rejected

---

### 6. Routing

**Decision**: Two routes: `/` (survey form) and `/results` (insights page).

**Rationale**: Matches spec user stories exactly. After submission, redirect to `/results`
using Next.js `redirect()` from the Server Action (or client-side `router.push`).
