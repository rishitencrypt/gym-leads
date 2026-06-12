"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { FieldError } from "@/components/forms/form-feedback";
import { GOALS, type Profile } from "@/lib/types";
import { goalSchema } from "@/lib/validations";
import { updateGoals } from "@/app/actions/tracking";

type GoalValues = z.infer<typeof goalSchema>;

export function GoalsForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GoalValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal: (profile?.goal as GoalValues["goal"]) ?? undefined,
      targetWeightKg: profile?.target_weight_kg ?? undefined,
      heightCm: profile?.height_cm ?? undefined,
      dailyWaterGoalMl: profile?.daily_water_goal_ml ?? 2500,
    },
  });

  async function onSubmit(values: GoalValues) {
    setError(null);
    setSaved(false);
    const result = await updateGoals({
      goal: values.goal,
      targetWeightKg: values.targetWeightKg,
      heightCm: values.heightCm,
      dailyWaterGoalMl: values.dailyWaterGoalMl,
    });
    if (result.success) {
      setSaved(true);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="goal-height">Height (cm)</Label>
          <Input id="goal-height" type="number" placeholder="175" {...form.register("heightCm")} />
          <FieldError message={form.formState.errors.heightCm?.message} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="goal-weight">Target Weight (kg)</Label>
          <Input id="goal-weight" type="number" placeholder="75" {...form.register("targetWeightKg")} />
          <FieldError message={form.formState.errors.targetWeightKg?.message} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="goal-water">Daily Water Goal (ml)</Label>
        <Input id="goal-water" type="number" placeholder="2500" {...form.register("dailyWaterGoalMl")} />
        <FieldError message={form.formState.errors.dailyWaterGoalMl?.message} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && <p className="text-sm text-emerald-400">Goals saved.</p>}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Goals
      </Button>
    </form>
  );
}
