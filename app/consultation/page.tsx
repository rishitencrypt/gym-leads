import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { ConsultationForm } from "@/components/forms/consultation-form";

export const metadata: Metadata = {
  title: "Free Consultation",
  description:
    "Talk to an IronForge coach about your goals, free of charge. We will call you within one business day.",
};

export default function ConsultationPage() {
  return (
    <div className="container max-w-2xl py-16 sm:py-20">
      <div className="mb-10 text-center">
        <span className="section-eyebrow">No Obligation</span>
        <h1 className="section-heading">Free Coach Consultation</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Not sure where to start? Tell us about yourself and a coach will
          call to map out your options.
        </p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <ConsultationForm />
        </CardContent>
      </Card>
    </div>
  );
}
