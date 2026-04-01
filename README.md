# Post-Graduation Plans Survey

A small Next.js + Supabase app for collecting anonymous survey responses about post-undergraduate plans and showing aggregate results on a public results page.

## What It Does

- Collects anonymous survey responses from a public form
- Inserts responses into `public.responses` in Supabase
- Renders a public `/results` page with aggregate charts
- Uses server-side Supabase access with the anon key

## Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Supabase (`@supabase/supabase-js` v2)

## Project Structure

```text
src/app/page.tsx             Survey form page
src/app/actions.ts           Server action for form submission
src/app/results/page.tsx     Public results page
src/components/SurveyForm.tsx
src/lib/supabase.ts          Shared Supabase client factory
supabase/migrations/         Database schema and data migrations
supabase/seed.sql            Local reset seed data
```

## Prerequisites

- Node.js 20+
- `pnpm` or `npm`
- Supabase CLI

## Environment Variables

The app expects:

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

Notes:

- These are read on the server in `src/lib/supabase.ts`.
- This app does not use `NEXT_PUBLIC_` Supabase variables.
- The same anon key is used for inserts and reads.

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

If you use npm:

```bash
npm install
```

### 2. Start local Supabase

```bash
supabase start
```

### 3. Reset the local database

```bash
supabase db reset
```

This will:

- recreate the local database
- run all files in `supabase/migrations/`
- load `supabase/seed.sql`

### 4. Set local env vars

Use the local Supabase API URL and anon key:

```bash
export SUPABASE_URL="http://127.0.0.1:54321"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0Ww0r26yih-dakPJnef0nNeNk-zl4_MVKiOEBaY"
```

### 5. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm exec eslint .
pnpm exec tsc --noEmit
supabase db reset
supabase db push
```

## Database Notes

The main table is `public.responses`.

Key migrations:

- `20260331000000_create_responses.sql`: creates the table
- `20260401000001_add_30_response_records.sql`: inserts 30 additional records

For local development, `supabase/seed.sql` also inserts initial rows during `supabase db reset`.

## RLS and Public Access

This app expects anonymous users to be able to:

- `INSERT` into `public.responses`
- `SELECT` from `public.responses`

That requires all of the following on the database:

```sql
alter table public.responses enable row level security;
grant usage on schema public to anon;
grant select, insert on table public.responses to anon;
```

Policies must also exist:

```sql
create policy anon_insert
on public.responses
for insert
to anon
with check (true);

create policy anon_select
on public.responses
for select
to anon
using (true);
```

Important: `alter policy ...` only changes an existing policy. It does not create the policy, enable RLS, or grant table access.

## Deployment

Set these environment variables in your host:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
```

Then apply migrations to the target Supabase project:

```bash
supabase db push
```

Build the app:

```bash
pnpm build
```

## Verification Checklist

After setup:

1. Visit `/`
2. Submit a survey response
3. Confirm a row appears in `public.responses`
4. Visit `/results`
5. Confirm the charts render and response count is correct

## Troubleshooting

### Insert works but results page cannot read

Check these in order:

1. `anon` has both `SELECT` and `INSERT` grants on `public.responses`
2. RLS is enabled on `public.responses`
3. `anon_select` and `anon_insert` policies actually exist
4. `SUPABASE_URL` and `SUPABASE_ANON_KEY` point to the same project in every environment
5. PostgREST schema cache has been reloaded after schema/policy changes:

```sql
notify pgrst, 'reload schema';
```

### Error says relation is not in schema cache

This is usually not a React or Next.js problem. It usually means one of:

- the table does not exist in the target project
- the API schema exposure is wrong
- the schema cache is stale
- your app is pointed at a different Supabase project than you think

### Results page shows stale behavior

`src/app/results/page.tsx` is configured with:

```ts
export const dynamic = "force-dynamic";
```

That forces request-time reads so `/results` does not get stuck with a build-time data error.
