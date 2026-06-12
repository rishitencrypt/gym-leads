"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FieldError, FormSuccess } from "@/components/forms/form-feedback";
import { GOALS } from "@/lib/types";
import { submitAssessment } from "@/app/actions/leads";
import { cn } from "@/lib/utils";

type Goal = "weight_loss" | "muscle_gain" | "general_fitness";

const QUESTIONS: Record<Goal, { id: string; question: string; options: string[] }[]> = {
  weight_loss: [
    {
      id: "target",
      question: "How much weight do you want to lose?",
      options: ["Under 5 kg", "5 - 10 kg", "10 - 20 kg", "More than 20 kg"],
    },
    {
      id: "activity",
      question: "How active are you right now?",
      options: ["Mostly sedentary", "Light activity", "Moderately active", "Very active"],
    },
    {
      id: "obstacle",
      question: "What has held you back before?",
      options: ["Lack of time", "Lack of a plan", "Motivation", "Nutrition habits"],
    },
  ],
  muscle_gain: [
    {
      id: "experience",
      question: "How long have you been lifting?",
      options: ["Never lifted", "Under 1 year", "1 - 3 years", "3+ years"],
    },
    {
      id: "frequency",
      question: "How many days a week can you train?",
      options: ["2 days", "3 days", "4 days", "5+ days"],
    },
    {
      id: "focus",
      question: "What is your main focus?",
      options: ["Overall size", "Strength numbers", "Specific muscle groups", "Athletic performance"],
    },
  ],
  general_fitness: [
    {
      id: "motivation",
      question: "What matters most to you?",
      options: ["More energy", "Better health markers", "Stress relief", "Staying mobile as I age"],
    },
    {
      id: "preference",
      question: "What training style appeals to you?",
      options: ["Strength training", "Group classes", "Cardio and conditioning", "A mix of everything"],
    },
    {
      id: "schedule",
      question: "When do you prefer to train?",
      options: ["Early morning", "Lunchtime", "Evening", "Weekends"],
    },
  ],
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().optional().or(z.literal("")),
});
type ContactValues = z.infer<typeof contactSchema>;

export function AssessmentQuiz() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const questions = goal ? QUESTIONS[goal] : [];
  const totalSteps = questions.length + 2; // goal + questions + contact
  const currentStep = goal === null ? 0 : step + 1;
  const progress = Math.round((currentStep / totalSteps) * 100);

  function chooseGoal(g: Goal) {
    setGoal(g);
    setStep(0);
    setAnswers({});
  }

  function answer(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    setStep((s) => s + 1);
  }

  function goBack() {
    if (step === 0) setGoal(null);
    else setStep((s) => s - 1);
  }

  async function onSubmit(values: ContactValues) {
    if (!goal) return;
    setError(null);
    const result = await submitAssessment({ ...values, goal, answers });
    if (result.success) setDone(true);
    else setError(result.error);
  }

  if (done) {
    return (
      <Card>
        <CardContent>
          <FormSuccess
            title="Assessment Complete"
            body="Your personalised program recommendation is being prepared. A coach will reach out within 24 hours."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {currentStep + 1} of {goal ? totalSteps : 4}
            </span>
            {goal && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
            )}
          </div>
          <Progress value={goal ? progress : 5} />
        </div>

        {goal === null && (
          <div>
            <h2 className="font-display text-2xl font-bold">What is your main goal?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We will tailor the next questions to your answer.
            </p>
            <div className="mt-6 grid gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => chooseGoal(g.value)}
                  className="rounded-md border border-border bg-secondary/40 px-5 py-4 text-left font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {goal !== null && step < questions.length && (
          <div>
            <h2 className="font-display text-2xl font-bold">
              {questions[step].question}
            </h2>
            <div className="mt-6 grid gap-3">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => answer(questions[step].id, option)}
                  className={cn(
                    "rounded-md border border-border bg-secondary/40 px-5 py-4 text-left font-medium transition-colors hover:border-primary hover:text-primary",
                    answers[questions[step].id] === option && "border-primary text-primary"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {goal !== null && step >= questions.length && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <h2 className="font-display text-2xl font-bold">
              Where should we send your program?
            </h2>
            <p className="text-sm text-muted-foreground">
              Your personalised recommendation is ready. Enter your details to
              receive it.
            </p>
            <div className="grid gap-1.5">
              <Label htmlFor="quiz-name">Name</Label>
              <Input id="quiz-name" placeholder="Jane Smith" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="quiz-email">Email</Label>
              <Input id="quiz-email" type="email" placeholder="you@example.com" {...form.register("email")} />
              <FieldError message={form.formState.errors.email?.message} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="quiz-phone">Phone (optional)</Label>
              <Input id="quiz-phone" type="tel" placeholder="+1 555 000 0000" {...form.register("phone")} />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Get My Program
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
