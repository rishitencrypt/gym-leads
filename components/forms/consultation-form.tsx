"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError, FormSuccess } from "@/components/forms/form-feedback";
import { GOALS } from "@/lib/types";
import { consultationSchema, type ConsultationInput } from "@/lib/validations";
import { submitConsultation } from "@/app/actions/leads";

export function ConsultationForm({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { name: "", email: "", phone: "", city: "", message: "" },
  });

  async function onSubmit(values: ConsultationInput) {
    setError(null);
    const result = await submitConsultation(values);
    if (result.success) setDone(true);
    else setError(result.error);
  }

  if (done) {
    return (
      <FormSuccess
        title="Request Received"
        body="A coach will call you within one business day to plan your next steps. Talk soon."
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      {!compact && (
        <h3 className="font-display text-xl font-bold">Request a Free Consultation</h3>
      )}
      <div className="grid gap-1.5">
        <Label htmlFor="cons-name">Full Name</Label>
        <Input id="cons-name" placeholder="Jane Smith" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="cons-email">Email</Label>
          <Input id="cons-email" type="email" placeholder="you@example.com" {...form.register("email")} />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="cons-phone">Phone</Label>
          <Input id="cons-phone" type="tel" placeholder="+1 555 000 0000" {...form.register("phone")} />
          <FieldError message={form.formState.errors.phone?.message} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="cons-city">City (optional)</Label>
          <Input id="cons-city" placeholder="Downtown" {...form.register("city")} />
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
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="cons-message">Anything we should know? (optional)</Label>
        <Textarea
          id="cons-message"
          placeholder="Injuries, schedule, experience level..."
          {...form.register("message")}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Request Free Consultation
      </Button>
    </form>
  );
}
