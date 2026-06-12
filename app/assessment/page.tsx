import type { Metadata } from "next";
import { AssessmentQuiz } from "@/components/forms/assessment-quiz";

export const metadata: Metadata = {
  title: "Fitness Assessment Quiz",
  description:
    "Answer a few questions about your goals and get a personalised program recommendation from IronForge Fitness.",
};

export default function AssessmentPage() {
  return (
    <div className="container max-w-2xl py-16 sm:py-20">
      <div className="mb-10 text-center">
        <span className="section-eyebrow">60-Second Quiz</span>
        <h1 className="section-heading">Find Your Perfect Program</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Three quick questions. One personalised recommendation. Zero
          commitment.
        </p>
      </div>
      <AssessmentQuiz />
    </div>
  );
}
