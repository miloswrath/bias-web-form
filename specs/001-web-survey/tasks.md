---
description: "Task list for Post-Undergraduate Plans Survey"
---

# Tasks: Post-Undergraduate Plans Survey

**Input**: Design documents from `specs/001-web-survey/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: No test tasks — unit tests are optional per constitution and were not requested in the spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to ([US1], [US2])
- Exact file paths included in all descriptions

---

## Phase 1: Setup

**Purpose**: Database schema and environment configuration. No story-specific code yet.

- [x] T001 Create Supabase migration file at `supabase/migrations/20260331000000_create_responses.sql` using the SQL from `specs/001-web-survey/data-model.md` (CREATE TABLE responses with uuid PK, graduation_semester, field_of_study, internship_experience, job_status, role_types text[], biggest_concern, created_at)
- [x] T002 [P] Populate `supabase/seed.sql` with 5 sample responses per the INSERT block in `specs/001-web-survey/data-model.md`
- [x] T003 [P] Add a comment block to `.env.local` documenting the local Supabase dev credentials (`SUPABASE_URL=http://127.0.0.1:54321` and the local anon key from `specs/001-web-survey/quickstart.md`) so developers can switch easily

---

## Phase 2: Foundational

**Purpose**: Shared infrastructure that MUST be complete before any user story can be implemented.

⚠️ **CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Create server-side Supabase client factory in `src/lib/supabase.ts` — export a `createClient()` function that instantiates `@supabase/supabase-js` using `process.env.SUPABASE_URL` and `process.env.SUPABASE_ANON_KEY` (server-side only; no `NEXT_PUBLIC_` prefix)
- [x] T005 Apply migration locally by running `npx supabase db reset` from the repo root, then open Supabase Studio at http://127.0.0.1:54323 and confirm the `responses` table exists with the 5 seed rows

**Checkpoint**: Foundation ready — both user stories can now be implemented.

---

## Phase 3: User Story 1 — Submit Survey Response (Priority: P1) 🎯 MVP

**Goal**: A visitor fills in all 6 questions and submits; their response is persisted to the
local Supabase database and they are redirected to `/results`.

**Independent Test**: Navigate to http://localhost:3000, complete the form, click Submit,
verify the new row in Supabase Studio (http://127.0.0.1:54323 → Table Editor → responses),
and confirm redirect to `/results`.

### Implementation for User Story 1

- [x] T006 [US1] Implement the `submitResponse` Server Action in `src/app/actions.ts` — mark file `"use server"`, accept `FormData`, parse and validate all fields per `specs/001-web-survey/contracts/server-actions.md`, insert one row via `createClient()` from `src/lib/supabase.ts`, then call `redirect('/results')` on success
- [x] T007 [US1] Create the `SurveyForm` client component in `src/components/SurveyForm.tsx` — mark file `"use client"`, render a `<form action={submitResponse}>` with all 6 questions using the exact input types from `specs/001-web-survey/data-model.md` (Q1 dropdown, Q2 text, Q3 radio, Q4 radio, Q5 checkboxes, Q6 optional text), include HTML5 `required` on all required fields and a Submit button
- [x] T008 [US1] Replace `src/app/page.tsx` with the survey page — remove the Next.js boilerplate, render the page title "Post-Undergraduate Plans" and import/render `<SurveyForm />` from `src/components/SurveyForm.tsx`

**Checkpoint**: User Story 1 is fully functional and independently testable.
Submit the form → row appears in Supabase Studio → redirected to `/results` (may 404 until US2).

---

## Phase 4: User Story 2 — View Survey Results & Insights (Priority: P2)

**Goal**: A visitor opens `/results` and sees four aggregated visual charts plus a total
response count. If no responses exist, a friendly empty-state message is shown.

**Independent Test**: With seed data applied (`npx supabase db reset`), visit
http://localhost:3000/results and confirm all four charts render with non-zero bars/slices.
Then delete all rows via SQL Editor and confirm the empty-state message appears.

### Implementation for User Story 2

- [x] T009 [P] [US2] Create the `BarChart` SVG component in `src/components/charts/BarChart.tsx` — accept `{ title: string; data: ChartEntry[]; colorClass?: string }` per `specs/001-web-survey/contracts/results-schema.md`; render a `<svg>` with one horizontal `<rect>` per entry, width proportional to `count / maxCount * 100%`, with the label and count displayed
- [x] T010 [P] [US2] Create the `PieChart` SVG component in `src/components/charts/PieChart.tsx` — accept `{ title: string; data: ChartEntry[] }` per `specs/001-web-survey/contracts/results-schema.md`; render a `<svg>` with `<path>` arc slices calculated from `count / total * 2π` using `Math.sin`/`Math.cos`; include a color legend
- [x] T011 [US2] Create the results page Server Component at `src/app/results/page.tsx` — fetch all rows from `responses` via `createClient()`, compute `ResultsData` aggregations per `specs/001-web-survey/contracts/results-schema.md` (group-by graduation_semester, internship_experience, job_status; flatten role_types arrays), render the total count, then conditionally: if `totalResponses === 0` show an empty-state message, otherwise render four chart components (`BarChart` for graduation semester, `PieChart` for internship experience, `BarChart` for job status, `BarChart` for role types) with the label mappings from the contracts doc

**Checkpoint**: User Stories 1 and 2 are both independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation before submission.

- [x] T012 [P] Update `src/app/layout.tsx` to set the page `<title>` to "Post-Graduation Plans Survey" and remove the default Next.js metadata; optionally remove unused SVG assets from `public/` (next.svg, vercel.svg, file.svg, globe.svg, window.svg) if not referenced
- [x] T013 Run `npm run lint` from the repo root and fix all ESLint errors until the command exits with code 0
- [ ] T014 Complete the end-to-end validation in `specs/001-web-survey/quickstart.md` steps 1–6: reset DB, override env vars, start dev server, submit a response, verify in Studio, view results page, test empty-state

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001, T002, T003 can all start immediately; T002 and T003 are parallel
- **Foundational (Phase 2)**: T004 depends on nothing; T005 depends on T001 (migration must exist before `db reset`)
- **User Story 1 (Phase 3)**: All depend on Foundational phase completion
  - T006 depends on T004 (needs `createClient`)
  - T007 depends on T006 (imports `submitResponse`)
  - T008 depends on T007 (imports `SurveyForm`)
- **User Story 2 (Phase 4)**: All depend on Foundational phase completion
  - T009 and T010 are parallel (different files, no cross-dependency)
  - T011 depends on T009 and T010 (imports both chart components) and T004 (uses `createClient`)
- **Polish (Phase 5)**: T012 and T013 can run in parallel after Phase 4; T014 requires everything complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependency on US2
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — T009/T010 independent of US1; T011 independent of US1

### Parallel Opportunities

```bash
# Phase 1 — run together:
Task: "Populate supabase/seed.sql with sample responses"          # T002
Task: "Document local Supabase credentials in .env.local"         # T003

# Phase 4 — run together:
Task: "Create BarChart SVG component in src/components/charts/"   # T009
Task: "Create PieChart SVG component in src/components/charts/"   # T010

# Phase 5 — run together:
Task: "Update layout.tsx title and clean up public/ assets"       # T012
Task: "Run npm run lint and fix all errors"                       # T013
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T005)
3. Complete Phase 3: User Story 1 (T006–T008)
4. **STOP and VALIDATE**: Submit a response → verify row in Supabase Studio
5. Proceed to User Story 2 once US1 is confirmed working

### Incremental Delivery

1. Setup + Foundational → schema live locally
2. User Story 1 → Form submits and saves → **MVP demonstrated**
3. User Story 2 → Results page with 4 charts → **Full feature complete**
4. Polish → Lint clean, quickstart validated → **Ready for submission**

---

## Notes

- [P] tasks = different files, no blocking dependencies between them
- [US1]/[US2] labels map tasks to spec user stories for traceability
- No test tasks — unit tests are optional per constitution (Principle II) and not requested
- `createClient()` in `src/lib/supabase.ts` is the ONLY place Supabase is instantiated; all other files import from there
- All Supabase access is server-side only — no client components call Supabase directly
- SVG chart math: bar width = `(count / maxCount) * MAX_SVG_WIDTH`; pie arc uses `Math.atan2`-style calculation with `cx + r * Math.cos(angle)`, `cy + r * Math.sin(angle)`
