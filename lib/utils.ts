import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateBmi(weightKg: number, heightCm: number) {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", tone: "text-sky-400" };
  if (bmi < 25) return { label: "Healthy", tone: "text-emerald-400" };
  if (bmi < 30) return { label: "Overweight", tone: "text-amber-400" };
  return { label: "Obese", tone: "text-red-400" };
}
