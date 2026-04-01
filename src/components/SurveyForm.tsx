"use client";

import { useActionState } from "react";
import { submitResponse } from "@/app/actions";

const GRADUATION_SEMESTERS = [
  "Fall 2025",
  "Spring 2026",
  "Fall 2026",
  "Spring 2027",
  "Other",
];

const ROLE_TYPE_OPTIONS = [
  { value: "full_time", label: "Full-time employment" },
  { value: "grad_school", label: "Graduate school" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "freelance", label: "Freelance / consulting" },
  { value: "unsure", label: "Not sure yet" },
];

export function SurveyForm() {
  const [state, formAction, isPending] = useActionState(submitResponse, null);

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Q1 — Dropdown */}
      <fieldset>
        <label
          htmlFor="graduation_semester"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          1. What is your expected graduation semester?{" "}
          <span className="text-red-500">*</span>
        </label>
        <select
          id="graduation_semester"
          name="graduation_semester"
          required
          defaultValue=""
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="" disabled>
            Select a semester…
          </option>
          {GRADUATION_SEMESTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Q2 — Text input */}
      <fieldset>
        <label
          htmlFor="field_of_study"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          2. What is your primary field of study?{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          id="field_of_study"
          name="field_of_study"
          type="text"
          required
          placeholder="e.g., Business Analytics, Computer Science…"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </fieldset>

      {/* Q3 — Radio */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          3. Have you completed any internships?{" "}
          <span className="text-red-500">*</span>
        </legend>
        <div className="space-y-2">
          {[
            { value: "none", label: "No internships" },
            { value: "one", label: "Yes — one internship" },
            { value: "multiple", label: "Yes — multiple internships" },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="internship_experience"
                value={value}
                required
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Q4 — Radio */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          4. Do you have a job or offer lined up after graduation?{" "}
          <span className="text-red-500">*</span>
        </legend>
        <div className="space-y-2">
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "exploring", label: "Still exploring" },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="job_status"
                value={value}
                required
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Q5 — Checkboxes */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          5. What type of role are you pursuing? (select all that apply)
        </legend>
        <div className="space-y-2">
          {ROLE_TYPE_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="role_types"
                value={value}
                className="h-4 w-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Q6 — Optional text */}
      <fieldset>
        <label
          htmlFor="biggest_concern"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          6. What is your biggest concern about post-graduation?{" "}
          <span className="text-xs text-gray-400">(optional)</span>
        </label>
        <textarea
          id="biggest_concern"
          name="biggest_concern"
          rows={3}
          placeholder="Share anything on your mind…"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Submitting…" : "Submit Survey"}
      </button>
    </form>
  );
}
