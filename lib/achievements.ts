import type { WaterLog, WeightLog, WorkoutStreak } from "@/lib/types";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

export function computeStreak(workouts: WorkoutStreak[]): {
  current: number;
  best: number;
} {
  if (workouts.length === 0) return { current: 0, best: 0 };

  const days = Array.from(new Set(workouts.map((w) => w.workout_date))).sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    run = diff === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  // Current streak must end today or yesterday
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const last = days[days.length - 1];
  const current = last === today || last === yesterday ? run : 0;

  return { current, best };
}

export function computeAchievements(
  workouts: WorkoutStreak[],
  weights: WeightLog[],
  water: WaterLog[],
  dailyWaterGoalMl: number
): Achievement[] {
  const { best } = computeStreak(workouts);

  const todaysWater = water
    .filter((w) => w.logged_on === new Date().toISOString().slice(0, 10))
    .reduce((sum, w) => sum + w.amount_ml, 0);

  return [
    {
      id: "first-workout",
      title: "First Rep",
      description: "Log your first workout",
      earned: workouts.length >= 1,
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Hit a 7-day workout streak",
      earned: best >= 7,
    },
    {
      id: "streak-30",
      title: "Iron Month",
      description: "Hit a 30-day workout streak",
      earned: best >= 30,
    },
    {
      id: "weigh-ins-10",
      title: "Data Driven",
      description: "Record 10 weigh-ins",
      earned: weights.length >= 10,
    },
    {
      id: "hydrated",
      title: "Fully Hydrated",
      description: "Hit your daily water goal",
      earned: todaysWater >= dailyWaterGoalMl,
    },
    {
      id: "twenty-workouts",
      title: "Regular",
      description: "Log 20 total workouts",
      earned: workouts.length >= 20,
    },
  ];
}
