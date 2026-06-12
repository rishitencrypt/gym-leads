import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Profile, WaterLog, WeightLog, WorkoutStreak } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Dashboard",
  robots: { index: false },
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const [profileRes, weightsRes, waterRes, workoutsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_on", { ascending: true })
      .limit(180),
    supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_on", { ascending: true })
      .limit(500),
    supabase
      .from("workout_streaks")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: true })
      .limit(730),
  ]);

  return (
    <DashboardClient
      profile={(profileRes.data as Profile) ?? null}
      weights={(weightsRes.data as WeightLog[]) ?? []}
      water={(waterRes.data as WaterLog[]) ?? []}
      workouts={(workoutsRes.data as WorkoutStreak[]) ?? []}
    />
  );
}
