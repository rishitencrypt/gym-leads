"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormSuccess } from "@/components/forms/form-feedback";
import { bmiLeadSchema, type BmiLeadInput } from "@/lib/validations";
import { submitBmiLead } from "@/app/actions/leads";
import { saveBmiResult } from "@/app/actions/tracking";
import { calculateBmi, bmiCategory } from "@/lib/utils";

export function BmiCalculator({ isSignedIn }: { isSignedIn: boolean }) {
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const leadForm = useForm<BmiLeadInput>({
    resolver: zodResolver(bmiLeadSchema),
    defaultValues: { name: "", email: "", phone: "", bmi: 0 },
  });

  function compute() {
    setInputError(null);
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!h || h < 100 || h > 250) {
      setInputError("Enter a height between 100 and 250 cm.");
      return;
    }
    if (!w || w < 20 || w > 400) {
      setInputError("Enter a weight between 20 and 400 kg.");
      return;
    }
    const result = calculateBmi(w, h);
    setBmi(result);
    leadForm.setValue("bmi", result);
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveBmiResult(Number(weightKg), Number(heightCm));
    setSaving(false);
    if (result.success) setSaved(true);
  }

  async function onLeadSubmit(values: BmiLeadInput) {
    setLeadError(null);
    const result = await submitBmiLead(values);
    if (result.success) setLeadDone(true);
    else setLeadError(result.error);
  }

  const category = bmi !== null ? bmiCategory(bmi) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calculate Your BMI</CardTitle>
          <CardDescription>
            Body Mass Index is a quick starting point for your fitness journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="bmi-height">Height (cm)</Label>
            <Input
              id="bmi-height"
              type="number"
              inputMode="decimal"
              placeholder="175"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="bmi-weight">Weight (kg)</Label>
            <Input
              id="bmi-weight"
              type="number"
              inputMode="decimal"
              placeholder="75"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>
          {inputError && <p className="text-sm text-red-400">{inputError}</p>}
          <Button onClick={compute}>Calculate BMI</Button>

          {bmi !== null && category && (
            <div className="mt-2 rounded-md border border-border bg-secondary/40 p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Your BMI
              </p>
              <p className="font-display text-5xl font-extrabold text-primary">{bmi}</p>
              <p className={`mt-1 text-sm font-semibold ${category.tone}`}>
                {category.label}
              </p>
              {isSignedIn ? (
                saved ? (
                  <p className="mt-3 text-sm text-emerald-400">
                    Saved to your dashboard.
                  </p>
                ) : (
                  <Button
                    className="mt-4"
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save to My Dashboard
                  </Button>
                )
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
                  <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                    Create a free account
                  </Link>{" "}
                  to track your BMI history over time.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Get a Free Plan for Your BMI</CardTitle>
          <CardDescription>
            Leave your details and a coach will send you a personalised
            starting plan based on your result.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leadDone ? (
            <FormSuccess
              title="Plan On Its Way"
              body="A coach will email your personalised starting plan within 24 hours."
            />
          ) : (
            <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="bmi-name">Name</Label>
                <Input id="bmi-name" placeholder="Jane Smith" {...leadForm.register("name")} />
                <FieldError message={leadForm.formState.errors.name?.message} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="bmi-email">Email</Label>
                <Input id="bmi-email" type="email" placeholder="you@example.com" {...leadForm.register("email")} />
                <FieldError message={leadForm.formState.errors.email?.message} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="bmi-phone">Phone (optional)</Label>
                <Input id="bmi-phone" type="tel" placeholder="+1 555 000 0000" {...leadForm.register("phone")} />
              </div>
              {bmi === null && (
                <p className="text-xs text-muted-foreground">
                  Calculate your BMI first so we can tailor your plan.
                </p>
              )}
              {leadError && <p className="text-sm text-red-400">{leadError}</p>}
              <Button type="submit" disabled={bmi === null || leadForm.formState.isSubmitting}>
                {leadForm.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Send My Free Plan
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
