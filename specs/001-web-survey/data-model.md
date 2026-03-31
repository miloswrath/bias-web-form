# Data Model: Post-Undergraduate Plans Survey

**Branch**: `001-web-survey` | **Date**: 2026-03-31

## Entity: Response

One row per anonymous survey submission.

### Fields

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `id` | `uuid` | NO | PRIMARY KEY, default `gen_random_uuid()` | Unique row identifier |
| `graduation_semester` | `text` | NO | CHECK in (`Fall 2025`, `Spring 2026`, `Fall 2026`, `Spring 2027`, `Other`) | Q1 — dropdown |
| `field_of_study` | `text` | NO | min length 1 | Q2 — free text |
| `internship_experience` | `text` | NO | CHECK in (`none`, `one`, `multiple`) | Q3 — radio |
| `job_status` | `text` | NO | CHECK in (`yes`, `no`, `exploring`) | Q4 — radio |
| `role_types` | `text[]` | NO | default `'{}'` | Q5 — checkboxes (array of selected values) |
| `biggest_concern` | `text` | YES | — | Q6 — optional free text |
| `created_at` | `timestamptz` | NO | default `now()` | Insertion timestamp |

### Valid Values for Enum-like Fields

**`graduation_semester`**:
- `"Fall 2025"` | `"Spring 2026"` | `"Fall 2026"` | `"Spring 2027"` | `"Other"`

**`internship_experience`**:
- `"none"` | `"one"` | `"multiple"`

**`job_status`**:
- `"yes"` | `"no"` | `"exploring"`

**`role_types`** (array elements):
- `"full_time"` | `"grad_school"` | `"entrepreneurship"` | `"freelance"` | `"unsure"`

### Relationships

No foreign keys. All submissions are standalone anonymous rows.

## Migration

File: `supabase/migrations/20260331000000_create_responses.sql`

```sql
CREATE TABLE responses (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  graduation_semester    text        NOT NULL
                           CHECK (graduation_semester IN (
                             'Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027', 'Other'
                           )),
  field_of_study         text        NOT NULL CHECK (char_length(field_of_study) >= 1),
  internship_experience  text        NOT NULL
                           CHECK (internship_experience IN ('none', 'one', 'multiple')),
  job_status             text        NOT NULL
                           CHECK (job_status IN ('yes', 'no', 'exploring')),
  role_types             text[]      NOT NULL DEFAULT '{}',
  biggest_concern        text,
  created_at             timestamptz NOT NULL DEFAULT now()
);
```

## Seed Data

File: `supabase/seed.sql` — populate with 5–10 representative rows to allow results
page verification without manually submitting the form. Example (5 rows):

```sql
INSERT INTO responses
  (graduation_semester, field_of_study, internship_experience, job_status, role_types, biggest_concern)
VALUES
  ('Spring 2026', 'Business Analytics', 'multiple', 'yes',       ARRAY['full_time'],                    'Finding work-life balance'),
  ('Fall 2026',   'Computer Science',   'one',      'exploring',  ARRAY['full_time', 'grad_school'],     NULL),
  ('Spring 2026', 'Marketing',          'none',     'no',         ARRAY['unsure'],                       'Student loan debt'),
  ('Spring 2027', 'Finance',            'one',      'yes',        ARRAY['full_time', 'freelance'],        'Relocating to a new city'),
  ('Fall 2025',   'Information Systems','multiple', 'yes',        ARRAY['full_time'],                    NULL);
```

## Results Aggregation (Server-Side TypeScript)

The results page computes the following from all rows fetched via `supabase.from('responses').select('*')`:

| Visualization | Aggregation |
|---------------|-------------|
| Graduation semester distribution | Count rows grouped by `graduation_semester` |
| Internship experience breakdown | Count rows grouped by `internship_experience` |
| Job status distribution | Count rows grouped by `job_status` |
| Role types being pursued | Flatten `role_types[]` arrays; count occurrences of each value |
