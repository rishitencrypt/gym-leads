"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { calculateBmi } from "@/lib/utils";
import type { ActionResult } from "@/app/actions/leads";

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return { supabase, user };
}

export async function logWeight(weightKg: number): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("height_cm")
      .eq("id", user.id)
      .single();

    const bmi = profile?.height_cm
      ? calculateBmi(weightKg, Number(profile.height_cm))
      : null;

    const { error } = await supabase
      .from("weight_logs")
      .insert({ user_id: user.id, weight_kg: weightKg, bmi });
    if (error) return { success: false, error: "Could not save weight." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Please sign in first." };
  }
}

export async function logWater(amountMl: number): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireUser();
    const { error } = await supabase
      .from("water_logs")
      .insert({ user_id: user.id, amount_ml: amountMl });
    if (error) return { success: false, error: "Could not save water intake." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Please sign in first." };
  }
}

export async function logWorkoutToday(): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireUser();
    const { error } = await supabase
      .from("workout_streaks")
      .upsert(
        { user_id: user.id, workout_date: new Date().toISOString().slice(0, 10) },
        { onConflict: "user_id,workout_date", ignoreDuplicates: true }
      );
    if (error) return { success: false, error: "Could not log workout." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Please sign in first." };
  }
}

export async function updateGoals(input: {
  goal: string;
  targetWeightKg?: number;
  heightCm?: number;
  dailyWaterGoalMl?: number;
}): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        goal: input.goal,
        target_weight_kg: input.targetWeightKg ?? null,
        height_cm: input.heightCm ?? null,
        daily_water_goal_ml: input.dailyWaterGoalMl ?? 2500,
      })
      .eq("id", user.id);
    if (error) return { success: false, error: "Could not save goals." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Please sign in first." };
  }
}

export async function saveBmiResult(
  weightKg: number,
  heightCm: number
): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireUser();
    const bmi = calculateBmi(weightKg, heightCm);

    await supabase.from("profiles").update({ height_cm: heightCm }).eq("id", user.id);
    const { error } = await supabase
      .from("weight_logs")
      .insert({ user_id: user.id, weight_kg: weightKg, bmi });
    if (error) return { success: false, error: "Could not save BMI result." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Please sign in to save your BMI." };
  }
}
