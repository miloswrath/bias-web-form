# Feature Specification: Post-Undergraduate Plans Survey

**Feature Branch**: `001-web-survey`
**Created**: 2026-03-31
**Status**: Draft
**Input**: Web survey capturing post-undergraduate plans, linked to Supabase, with a results/insights page.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit Survey Response (Priority: P1)

A student visits the survey page, answers 6 questions about their post-graduation plans using
a mix of text inputs, radio buttons, a dropdown, and checkboxes, then submits. Their response
is saved and they are redirected to a thank-you or results page.

**Why this priority**: This is the core deliverable — without submission working end-to-end,
nothing else matters. It is also independently demonstrable as an MVP.

**Independent Test**: Navigate to the survey page, fill in all fields, click Submit, and
verify the response appears in the local Supabase `responses` table via Supabase Studio
(http://127.0.0.1:54323).

**Acceptance Scenarios**:

1. **Given** a visitor on the survey page, **When** they complete all required fields and
   submit, **Then** a new row is inserted into the database and the user sees a confirmation.
2. **Given** a visitor who submits without filling required fields, **When** they click
   Submit, **Then** validation messages appear and no row is inserted.
3. **Given** a visitor who submits valid data, **When** the response is saved, **Then**
   they are navigated to the results/insights page.

---

### User Story 2 - View Survey Results & Insights (Priority: P2)

A visitor navigates to the results page and sees aggregated, visual insights from all
collected survey responses — charts or summaries covering graduation timelines, job
readiness, internship experience, and career paths.

**Why this priority**: Required by the spec ("results page that gives general feedback").
Delivers standalone value once at least one response exists.

**Independent Test**: With seed data in the local database, visit `/results` and verify
that charts render correctly and reflect the seeded data. Verify empty-state displays when
no data exists.

**Acceptance Scenarios**:

1. **Given** responses exist in the database, **When** a visitor opens the results page,
   **Then** at least three distinct visual summaries are displayed.
2. **Given** no responses exist, **When** a visitor opens the results page, **Then** a
   friendly empty-state message is shown instead of broken charts.

---

### Edge Cases

- What happens when a user submits the form twice?
  Allowed — each submission is a separate anonymous row; no deduplication required.
- How does the system handle a database connection failure during submission?
  Display a user-friendly error message; do not silently discard the form data.
- What if the results page is viewed before any responses exist?
  Show a clear empty-state message rather than rendering broken or empty charts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a survey form with exactly 6 questions covering post-graduation plans.
- **FR-002**: Survey MUST include at least one of each input type: text input, radio button group,
  dropdown list, and checkbox group.
- **FR-003**: System MUST validate that all required fields are completed before allowing submission.
- **FR-004**: System MUST persist each submitted response as a single anonymous row in the database.
- **FR-005**: System MUST display a confirmation state to the user after a successful submission.
- **FR-006**: System MUST provide a results page with visual aggregations of all stored responses.
- **FR-007**: Results page MUST include at least three distinct visualizations relevant to the survey questions.
- **FR-008**: Results page MUST display a user-friendly empty-state when no responses exist.

### Survey Questions

Questions ordered from easier to harder to answer:

| # | Question | Input Type | Options |
|---|----------|------------|---------|
| 1 | What is your expected graduation semester? | Dropdown | Fall 2025, Spring 2026, Fall 2026, Spring 2027, Other |
| 2 | What is your primary field of study? | Text input | Free text |
| 3 | Have you completed any internships? | Radio | Yes — one, Yes — multiple, No |
| 4 | Do you have a job or offer lined up after graduation? | Radio | Yes, No, Still exploring |
| 5 | What type of role are you pursuing? (select all that apply) | Checkboxes | Full-time employment, Graduate school, Entrepreneurship, Freelance / consulting, Not sure yet |
| 6 | What is your biggest concern about post-graduation? | Text input | Free text (optional) |

### Key Entities

- **Response**: One row per anonymous survey submission. Stores answers to all 6 questions
  plus a creation timestamp. No user identity is captured.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can complete and submit the survey in under 3 minutes.
- **SC-002**: 100% of submitted responses appear in the database within 5 seconds of submission.
- **SC-003**: The results page loads and renders all visualizations within 3 seconds when
  fewer than 1,000 responses exist.
- **SC-004**: All required-field validations prevent submission and surface clear error messages,
  with zero silent failures.
- **SC-005**: The results page remains usable (empty-state shown) when zero responses exist.

## Assumptions

- Submissions are anonymous — no login or user identity is required or stored.
- The local Supabase dev server is running at http://127.0.0.1:54321 during development and testing.
- Desktop-first layout is acceptable; mobile responsiveness is desirable but not a graded requirement.
- "Visualizations" means interactive or rendered charts (e.g., bar charts, pie charts) displayed
  on the results page — server-rendered static images are out of scope.
- The results page is publicly accessible with no authentication gate.
- Azure hosting setup (environment variables, connection strings) will be documented in
  quickstart.md as a deployment step, not implemented as a functional requirement here.
- Question 6 (biggest concern) is optional; all other questions are required.
