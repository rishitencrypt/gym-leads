"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError, FormSuccess } from "@/components/forms/form-feedback";
import { GOALS } from "@/lib/types";
import { trialBookingSchema, type TrialBookingInput } from "@/lib/validations";
import { submitTrialBooking } from "@/app/actions/leads";

export function TrialBookingForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TrialBookingInput>({
    resolver: zodResolver(trialBookingSchema),
    defaultValues: { name: "", email: "", phone: "", location: "", preferredDate: "" },
  });

  async function onSubmit(values: TrialBookingInput) {
    setError(null);
    const result = await submitTrialBooking(values);
    if (result.success) setDone(true);
    else setError(result.error);
  }

  if (done) {
    return (
      <FormSuccess
        title="Trial Booked"
        body="Check your inbox for confirmation. A coach will call to schedule your first session within 24 hours."
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid gap-1.5">
        <Label htmlFor="trial-name">Full Name</Label>
        <Input id="trial-name" placeholder="Jane Smith" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="trial-email">Email</Label>
          <Input id="trial-email" type="email" placeholder="you@example.com" {...form.register("email")} />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="trial-phone">Phone</Label>
          <Input id="trial-phone" type="tel" placeholder="+1 555 000 0000" {...form.register("phone")} />
          <FieldError message={form.formState.errors.phone?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="trial-location">Your Location / City</Label>
          <Input id="trial-location" placeholder="Downtown" {...form.register("location")} />
          <FieldError message={form.formState.errors.location?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="trial-date">Preferred Date (optional)</Label>
          <Input id="trial-date" type="date" {...form.register("preferredDate")} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label>Primary Goal</Label>
        <Controller
          control={form.control}
          name="goal"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your goal" />
              </SelectTrigger>
              <SelectContent>
                {GOALS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={form.formState.errors.goal?.message} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Book My Free Trial
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No payment details required. We will never share your information.
      </p>
    </form>
  );
}
