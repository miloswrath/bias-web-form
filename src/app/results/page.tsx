import { createClient } from "@/lib/supabase";
import { BarChart, ChartEntry } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import Link from "next/link";

interface ResponseRow {
  graduation_semester: string;
  internship_experience: string;
  job_status: string;
  role_types: string[];
}

function countBy(items: string[], labelMap?: Record<string, string>): ChartEntry[] {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([key, count]) => ({ label: labelMap?.[key] ?? key, count }))
    .sort((a, b) => b.count - a.count);
}

const INTERNSHIP_LABELS: Record<string, string> = {
  none: "No internships",
  one: "One internship",
  multiple: "Multiple internships",
};

const JOB_STATUS_LABELS: Record<string, string> = {
  yes: "Job / offer lined up",
  no: "Nothing lined up",
  exploring: "Still exploring",
};

const ROLE_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time employment",
  grad_school: "Graduate school",
  entrepreneurship: "Entrepreneurship",
  freelance: "Freelance / consulting",
  unsure: "Not sure yet",
};

export default async function ResultsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("responses")
    .select(
      "graduation_semester, internship_experience, job_status, role_types"
    );

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="rounded-xl bg-red-50 border border-red-200 p-8 text-center max-w-md">
          <h1 className="text-lg font-semibold text-red-700 mb-2">
            Could not load results
          </h1>
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      </main>
    );
  }

  const rows = (data ?? []) as ResponseRow[];

  if (rows.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-12 text-center max-w-md">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            No responses yet
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Be the first to fill out the survey!
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Take the Survey
          </Link>
        </div>
      </main>
    );
  }

  const graduationData = countBy(rows.map((r) => r.graduation_semester));
  const internshipData = countBy(
    rows.map((r) => r.internship_experience),
    INTERNSHIP_LABELS
  );
  const jobStatusData = countBy(
    rows.map((r) => r.job_status),
    JOB_STATUS_LABELS
  );
  const roleTypesData = countBy(
    rows.flatMap((r) => r.role_types),
    ROLE_TYPE_LABELS
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Survey Results</h1>
            <p className="mt-1 text-sm text-gray-500">
              Based on{" "}
              <span className="font-semibold text-indigo-600">
                {rows.length} {rows.length === 1 ? "response" : "responses"}
              </span>
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            ← Take Survey
          </Link>
        </div>

        {/* Charts grid */}
        <div className="space-y-6">
          <BarChart
            title="Graduation Semester"
            data={graduationData}
            color="#6366f1"
          />
          <PieChart title="Internship Experience" data={internshipData} />
          <BarChart
            title="Job Status After Graduation"
            data={jobStatusData}
            color="#22d3ee"
          />
          <BarChart
            title="Roles Being Pursued"
            data={roleTypesData}
            color="#f59e0b"
          />
        </div>
      </div>
    </main>
  );
}
