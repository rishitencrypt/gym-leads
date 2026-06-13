import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";
import { BmiCalculator } from "@/components/forms/bmi-calculator";

export const metadata: Metadata = {
  title: "Free BMI Calculator",
  description:
    `Calculate your BMI instantly and get a free personalised starting plan from a ${siteConfig.gymShortName} coach.`,
};

export default async function BmiCalculatorPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container max-w-5xl py-16 sm:py-20">
      <div className="mb-10 max-w-2xl">
        <span className="section-eyebrow">Free Tool</span>
        <h1 className="section-heading">BMI Calculator</h1>
        <p className="mt-4 text-muted-foreground">
          Get an instant read on where you stand, then let a coach turn the
          number into a plan.
        </p>
      </div>
      <BmiCalculator isSignedIn={!!user} />
    </div>
  );
}
