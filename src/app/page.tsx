import { SurveyForm } from "@/components/SurveyForm";

export default function SurveyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Post-Graduation Plans Survey
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            All responses are anonymous. Fields marked{" "}
            <span className="text-red-500">*</span> are required.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <SurveyForm />
        </div>
      </div>
    </main>
  );
}
