import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/forms/signup-form";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <div className="container flex max-w-md flex-col py-20">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Free Account</CardTitle>
          <CardDescription>
            Track BMI, streaks, weight and hydration in one dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
