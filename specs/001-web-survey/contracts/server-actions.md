# Contract: Server Actions

**File**: `src/app/actions.ts`

## `submitResponse`

Persists a survey response to Supabase and redirects to `/results`.

### Signature

```typescript
"use server";

export async function submitResponse(formData: FormData): Promise<void>
```

### Input

Receives a native `FormData` object from the `<SurveyForm>` component.

| FormData key | Type | Required | Validation |
|---|---|---|---|
| `graduation_semester` | `string` | YES | Must be one of the 5 allowed values |
| `field_of_study` | `string` | YES | Non-empty after trim |
| `internship_experience` | `string` | YES | `"none"` \| `"one"` \| `"multiple"` |
| `job_status` | `string` | YES | `"yes"` \| `"no"` \| `"exploring"` |
| `role_types` | `string[]` (multi-value) | NO | Array of valid role type keys; may be empty |
| `biggest_concern` | `string` | NO | Optional free text |

### Behavior

1. Parse and validate all fields from `formData`. If validation fails, throw an error
   (caller displays via error boundary or `useFormState`).
2. Insert one row into the `responses` table via the server-side Supabase client.
3. On success: call `redirect('/results')` (Next.js `redirect()` from `next/navigation`).
4. On Supabase error: throw with the error message.

### Example Call (from SurveyForm.tsx)

```typescript
<form action={submitResponse}>
  {/* form fields */}
</form>
```

---

## Error States

| Condition | Behavior |
|-----------|----------|
| Missing required field | Validation error before DB insert |
| Invalid enum value | Validation error before DB insert |
| Supabase insert error | Re-throw; display generic error message to user |
| Redirect (success) | `redirect('/results')` — not an error |
