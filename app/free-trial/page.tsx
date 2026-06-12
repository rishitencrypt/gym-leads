import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { TrialBookingForm } from "@/components/forms/trial-booking-form";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Your Free Trial",
  description:
    "Claim a free training session at IronForge Fitness. No payment details, no contracts, no pressure.",
};

const included = [
  "Full facility access for one session",
  "1-on-1 movement assessment with a coach",
  "Personalised program recommendation",
  "Body composition check",
];

export default function FreeTrialPage() {
  return (
    <div className="container grid max-w-5xl gap-12 py-16 sm:py-20 lg:grid-cols-2">
      <div>
        <span className="section-eyebrow">Free Trial</span>
        <h1 className="section-heading">Train Free. Decide Later.</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Book your complimentary session and experience the difference
          first-hand. Every trial includes:
        </p>
        <ul className="mt-8 space-y-3">
          {included.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <TrialBookingForm />
        </CardContent>
      </Card>
    </div>
  );
}
