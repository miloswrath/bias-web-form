"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

const VALID_SEMESTERS = [
  "Fall 2025",
  "Spring 2026",
  "Fall 2026",
  "Spring 2027",
  "Other",
] as const;
const VALID_INTERNSHIP = ["none", "one", "multiple"] as const;
const VALID_JOB_STATUS = ["yes", "no", "exploring"] as const;

export async function submitResponse(
  _prevState: unknown,
  formData: FormData
): Promise<{ error: string }> {
  const graduation_semester = formData.get("graduation_semester") as string;
  const field_of_study = (
    (formData.get("field_of_study") as string) ?? ""
  ).trim();
  const internship_experience = formData.get(
    "internship_experience"
  ) as string;
  const job_status = formData.get("job_status") as string;
  const role_types = formData.getAll("role_types") as string[];
  const biggest_concern =
    ((formData.get("biggest_concern") as string) ?? "").trim() || null;

  if (
    !graduation_semester ||
    !VALID_SEMESTERS.includes(
      graduation_semester as (typeof VALID_SEMESTERS)[number]
    )
  ) {
    return { error: "Please select a graduation semester." };
  }
  if (!field_of_study) {
    return { error: "Please enter your field of study." };
  }
  if (
    !internship_experience ||
    !VALID_INTERNSHIP.includes(
      internship_experience as (typeof VALID_INTERNSHIP)[number]
    )
  ) {
    return { error: "Please select your internship experience." };
  }
  if (
    !job_status ||
    !VALID_JOB_STATUS.includes(job_status as (typeof VALID_JOB_STATUS)[number])
  ) {
    return { error: "Please select your job status." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("responses").insert({
    graduation_semester,
    field_of_study,
    internship_experience,
    job_status,
    role_types,
    biggest_concern,
  });

  if (error) {
    return { error: `Failed to submit: ${error.message}` };
  }

  redirect("/results");
}
