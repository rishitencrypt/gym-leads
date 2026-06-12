"use server";

import { createClient } from "@/lib/supabase/server";
import {
  assessmentSchema,
  bmiLeadSchema,
  consultationSchema,
  exitIntentSchema,
  trialBookingSchema,
  type AssessmentInput,
  type BmiLeadInput,
  type ConsultationInput,
  type ExitIntentInput,
  type TrialBookingInput,
} from "@/lib/validations";

export type ActionResult = { success: true } | { success: false; error: string };

const GENERIC_ERROR =
  "Something went wrong. Please try again or contact us on WhatsApp.";

async function insertLead(payload: Record<string, unknown>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase
    .from("leads")
    .insert({ ...payload, user_id: user?.id ?? null })
    .select("id")
    .single();
}

export async function submitTrialBooking(
  input: TrialBookingInput
): Promise<ActionResult> {
  const parsed = trialBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, phone, location, goal, preferredDate } = parsed.data;
  const supabase = createClient();

  const { data: lead, error: leadError } = await insertLead({
    name,
    email,
    phone,
    city: location,
    goal,
    source: "trial_booking",
  });
  if (leadError) return { success: false, error: GENERIC_ERROR };

  const { error } = await supabase.from("trial_bookings").insert({
    lead_id: lead.id,
    name,
    email,
    phone,
    location,
    goal,
    preferred_date: preferredDate || null,
  });
  if (error) return { success: false, error: GENERIC_ERROR };

  return { success: true };
}

export async function submitConsultation(
  input: ConsultationInput
): Promise<ActionResult> {
  const parsed = consultationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, phone, city, goal, message } = parsed.data;
  const { error } = await insertLead({
    name,
    email,
    phone,
    city: city || null,
    goal,
    notes: message || null,
    source: "consultation",
  });
  if (error) return { success: false, error: GENERIC_ERROR };

  return { success: true };
}

export async function submitAssessment(
  input: AssessmentInput
): Promise<ActionResult> {
  const parsed = assessmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, phone, goal, answers } = parsed.data;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lead, error: leadError } = await insertLead({
    name,
    email,
    phone: phone || null,
    goal,
    source: "assessment",
  });
  if (leadError) return { success: false, error: GENERIC_ERROR };

  const { error } = await supabase.from("fitness_assessments").insert({
    lead_id: lead.id,
    user_id: user?.id ?? null,
    goal,
    answers,
  });
  if (error) return { success: false, error: GENERIC_ERROR };

  return { success: true };
}

export async function submitBmiLead(input: BmiLeadInput): Promise<ActionResult> {
  const parsed = bmiLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, phone, bmi } = parsed.data;
  const { error } = await insertLead({
    name,
    email,
    phone: phone || null,
    bmi,
    source: "bmi_calculator",
  });
  if (error) return { success: false, error: GENERIC_ERROR };

  return { success: true };
}

export async function submitExitIntentLead(
  input: ExitIntentInput
): Promise<ActionResult> {
  const parsed = exitIntentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, phone } = parsed.data;
  const { error } = await insertLead({
    name,
    email,
    phone: phone || null,
    source: "exit_intent",
  });
  if (error) return { success: false, error: GENERIC_ERROR };

  return { success: true };
}
