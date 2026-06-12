export type LeadSource =
  | "website"
  | "bmi_calculator"
  | "assessment"
  | "trial_booking"
  | "consultation"
  | "exit_intent"
  | "whatsapp"
  | "signup";

export type LeadStatus = "new" | "contacted" | "trial" | "converted" | "lost";

export interface Lead {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  goal: string | null;
  bmi: number | null;
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "member" | "admin";
  goal: string | null;
  height_cm: number | null;
  target_weight_kg: number | null;
  daily_water_goal_ml: number;
  created_at: string;
}

export interface TrialBooking {
  id: string;
  lead_id: string | null;
  name: string;
  email: string;
  phone: string;
  location: string;
  goal: string;
  preferred_date: string | null;
  status: "pending" | "confirmed" | "completed" | "no_show";
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  bmi: number | null;
  logged_on: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_on: string;
  created_at: string;
}

export interface WorkoutStreak {
  id: string;
  user_id: string;
  workout_date: string;
  created_at: string;
}

export const GOALS = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "general_fitness", label: "General Fitness" },
] as const;

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  bmi_calculator: "BMI Calculator",
  assessment: "Fitness Quiz",
  trial_booking: "Trial Booking",
  consultation: "Consultation",
  exit_intent: "Exit Popup",
  whatsapp: "WhatsApp",
  signup: "Signup",
};
