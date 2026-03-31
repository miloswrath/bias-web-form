# Quickstart: Post-Undergraduate Plans Survey

**Branch**: `001-web-survey`
**Assumption**: Local Supabase dev server is already running.

---

## Step 1 — Apply the Database Migration

```bash
# From the repo root:
npx supabase db reset
```

This drops and recreates the local database, runs all migrations in `supabase/migrations/`,
and seeds it with sample data from `supabase/seed.sql`.

**Verify**: Open Supabase Studio at http://127.0.0.1:54323, navigate to
**Table Editor → responses**, and confirm the 5 seed rows are present.

---

## Step 2 — Set Local Environment Variables

Your `.env.local` currently points to the production Supabase instance. For local
development, override it in your shell before starting Next.js (direnv picks this up):

```bash
# Temporary shell override (or edit .env.local for the session):
export SUPABASE_URL="http://127.0.0.1:54321"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0Ww0r26yih-dakPJnef0nNeNk-zl4_MVKiOEBaY"
```

> **WARNING**: Never change `SUPABASE_URL` to the production URL while testing writes.
> The production URL is in `.env.local` for Azure deployment only.

---

## Step 3 — Start the Next.js Development Server

```bash
npm run dev
```

Wait for `✓ Ready on http://localhost:3000` in the terminal.

---

## Step 4 — Submit a Test Response (User Story 1)

1. Open http://localhost:3000 in your browser.
2. You should see the survey form with 6 questions.
3. Fill in all required fields:
   - Q1 (dropdown): select any semester
   - Q2 (text): type any field of study
   - Q3 (radio): select any internship option
   - Q4 (radio): select any job status
   - Q5 (checkboxes): check at least one role type
   - Q6 (text): leave blank or fill in (optional)
4. Click **Submit**.
5. You should be redirected to http://localhost:3000/results.

**Verify**: In Supabase Studio (http://127.0.0.1:54323 → Table Editor → responses),
confirm a new row was inserted with your submitted values and a recent `created_at` timestamp.

---

## Step 5 — Verify Results & Insights (User Story 2)

1. Open http://localhost:3000/results.
2. Confirm that all four charts render:
   - **Graduation semester distribution** (bar chart)
   - **Internship experience** (pie chart)
   - **Job status after graduation** (bar chart)
   - **Roles being pursued** (bar chart)
3. Confirm the total response count matches the number of rows in Supabase Studio.

**Empty state test**: Run `DELETE FROM responses;` in Supabase Studio's SQL Editor,
then refresh `/results`. Confirm a friendly empty-state message appears instead of broken charts.

---

## Step 6 — Validation Error Check

1. Return to http://localhost:3000.
2. Click **Submit** without filling in any fields.
3. Confirm that validation error messages appear for all required fields and no row is
   inserted into the database.

---

## Azure Deployment (Finalizing Hosting)

When ready to deploy to Azure:

1. **Create an Azure Static Web App** or **Azure App Service** configured for Node.js.
2. **Set environment variables** in Azure's application settings:
   - `SUPABASE_URL` → your production Supabase project URL
     (e.g., `https://ajihhonncdutpjtqasmr.supabase.co`)
   - `SUPABASE_ANON_KEY` → your production anon key (from `.env.local`)
3. **Apply migration to production**:
   ```bash
   npx supabase db push
   ```
   This pushes local migrations to the linked production Supabase project.
4. **Build and deploy**:
   ```bash
   npm run build
   ```
   Upload the `.next/` output per your Azure App Service configuration,
   or connect GitHub for CI/CD deployment.
5. Verify the production URL loads the survey form and submissions land in the production
   Supabase table (Supabase dashboard → Table Editor → responses).
