"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Flame, Droplets, Scale, Trophy, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightChart, WaterChart } from "@/components/dashboard/charts";
import { GoalsForm } from "@/components/dashboard/goals-form";
import { computeAchievements, computeStreak } from "@/lib/achievements";
import { logWater, logWeight, logWorkoutToday } from "@/app/actions/tracking";
import { createClient } from "@/lib/supabase/client";
import type { Profile, WaterLog, WeightLog, WorkoutStreak } from "@/lib/types";

interface Props {
  profile: Profile | null;
  weights: WeightLog[];
  water: WaterLog[];
  workouts: WorkoutStreak[];
}

export function DashboardClient({ profile, weights, water, workouts }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [weightInput, setWeightInput] = useState("");
  const [waterInput, setWaterInput] = useState("250");
  const [feedback, setFeedback] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const streak = useMemo(() => computeStreak(workouts), [workouts]);
  const trainedToday = workouts.some((w) => w.workout_date === today);

  const todaysWater = useMemo(
    () =>
      water
        .filter((w) => w.logged_on === today)
        .reduce((sum, w) => sum + w.amount_ml, 0),
    [water, today]
  );
  const waterGoal = profile?.daily_water_goal_ml ?? 2500;

  const latestWeight = weights.length ? weights[weights.length - 1] : null;
  const latestBmi = [...weights].reverse().find((w) => w.bmi !== null)?.bmi ?? null;

  const achievements = useMemo(
    () => computeAchievements(workouts, weights, water, waterGoal),
    [workouts, weights, water, waterGoal]
  );
  const earnedCount = achievements.filter((a) => a.earned).length;

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    setFeedback(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) setFeedback(result.error ?? "Something went wrong.");
      router.refresh();
    });
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="container py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="section-eyebrow">Member Dashboard</span>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/15">
              <Flame className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Current Streak</p>
              <p className="font-display text-2xl font-extrabold">{streak.current} days</p>
              <p className="text-xs text-muted-foreground">Best: {streak.best} days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/15">
              <Scale className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Latest Weight</p>
              <p className="font-display text-2xl font-extrabold">
                {latestWeight ? `${latestWeight.weight_kg} kg` : "--"}
              </p>
              {profile?.target_weight_kg && (
                <p className="text-xs text-muted-foreground">Target: {profile.target_weight_kg} kg</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/15">
              <Droplets className="h-5 w-5 text-primary" />
            </span>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Water Today</p>
              <p className="font-display text-2xl font-extrabold">
                {todaysWater} <span className="text-sm font-medium text-muted-foreground">/ {waterGoal} ml</span>
              </p>
              <Progress className="mt-1.5 h-2" value={Math.min(100, (todaysWater / waterGoal) * 100)} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/15">
              <Trophy className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Achievements</p>
              <p className="font-display text-2xl font-extrabold">
                {earnedCount} <span className="text-sm font-medium text-muted-foreground">/ {achievements.length}</span>
              </p>
              <p className="text-xs text-muted-foreground">BMI: {latestBmi ?? "--"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {feedback && <p className="mt-4 text-sm text-red-400">{feedback}</p>}

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Log Today&apos;s Workout</CardTitle>
            <CardDescription>Keep the streak alive.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              disabled={trainedToday || isPending}
              onClick={() => run(logWorkoutToday)}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {trainedToday ? "Workout Logged Today" : "I Trained Today"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Log Weight</CardTitle>
            <CardDescription>Track your weight and BMI over time.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="weight-input" className="sr-only">Weight in kg</Label>
              <Input
                id="weight-input"
                type="number"
                placeholder="kg"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
              />
            </div>
            <Button
              disabled={isPending || !weightInput}
              onClick={() => {
                run(() => logWeight(Number(weightInput)));
                setWeightInput("");
              }}
            >
              Save
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Log Water</CardTitle>
            <CardDescription>Add what you just drank, in ml.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="water-input" className="sr-only">Water in ml</Label>
              <Input
                id="water-input"
                type="number"
                placeholder="ml"
                value={waterInput}
                onChange={(e) => setWaterInput(e.target.value)}
              />
            </div>
            <Button
              disabled={isPending || !waterInput}
              onClick={() => run(() => logWater(Number(waterInput)))}
            >
              Add
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts + goals + achievements */}
      <Tabs defaultValue="progress" className="mt-8">
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="goals">My Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weight &amp; BMI History</CardTitle>
            </CardHeader>
            <CardContent>
              <WeightChart data={weights} targetWeightKg={profile?.target_weight_kg ?? null} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Water Intake (last 14 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <WaterChart data={water} goalMl={waterGoal} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <Card key={a.id} className={a.earned ? "border-primary/50" : "opacity-60"}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold">{a.title}</h3>
                  <Badge variant={a.earned ? "default" : "secondary"}>
                    {a.earned ? "Earned" : "Locked"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="goals">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Set Your Goals</CardTitle>
              <CardDescription>
                Used to personalise your dashboard and BMI calculations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
