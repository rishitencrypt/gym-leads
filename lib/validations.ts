import { z } from "zod";

const name = z.string().trim().min(2, "Please enter your name").max(100);
const email = z.string().trim().email("Please enter a valid email");
const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number")
  .max(20)
  .regex(/^[+\d][\d\s\-()]+$/, "Please enter a valid phone number");
const goal = z.enum(["weight_loss", "muscle_gain", "general_fitness"], {
  errorMap: () => ({ message: "Please choose a goal" }),
});

export const leadSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  goal: goal.optional(),
  bmi: z.number().min(8).max(80).optional(),
  source: z.enum([
    "website",
    "bmi_calculator",
    "assessment",
    "trial_booking",
    "consultation",
    "exit_intent",
    "whatsapp",
    "signup",
  ]),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const trialBookingSchema = z.object({
  name,
  email,
  phone,
  location: z.string().trim().min(2, "Please enter your location").max(120),
  goal,
  preferredDate: z.string().optional().or(z.literal("")),
});
export type TrialBookingInput = z.infer<typeof trialBookingSchema>;

export const consultationSchema = z.object({
  name,
  email,
  phone,
  city: z.string().trim().max(100).optional().or(z.literal("")),
  goal,
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type ConsultationInput = z.infer<typeof consultationSchema>;

export const assessmentSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("")),
  goal,
  answers: z.record(z.string(), z.string()),
});
export type AssessmentInput = z.infer<typeof assessmentSchema>;

export const bmiLeadSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("")),
  bmi: z.number().min(8).max(80),
});
export type BmiLeadInput = z.infer<typeof bmiLeadSchema>;

export const exitIntentSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("")),
});
export type ExitIntentInput = z.infer<typeof exitIntentSchema>;

export const loginSchema = z.object({
  email,
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  fullName: name,
  email,
  phone: phone.optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const weightLogSchema = z.object({
  weightKg: z.coerce.number().min(20, "Too low").max(400, "Too high"),
});

export const waterLogSchema = z.object({
  amountMl: z.coerce.number().min(50, "Min 50 ml").max(5000, "Max 5000 ml"),
});

export const goalSchema = z.object({
  goal,
  targetWeightKg: z.coerce.number().min(20).max(400).optional(),
  heightCm: z.coerce.number().min(100).max(250).optional(),
  dailyWaterGoalMl: z.coerce.number().min(500).max(8000).optional(),
});
