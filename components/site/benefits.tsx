import { Dumbbell, HeartPulse, Users, Clock, Trophy, Salad } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/site/motion";
import { siteConfig } from "@/lib/site-config";

const benefits = [
  {
    icon: Dumbbell,
    title: "Pro-Grade Equipment",
    body: "Over 200 stations of competition-grade strength and conditioning equipment, maintained daily.",
  },
  {
    icon: Users,
    title: "Certified Coaches",
    body: "Every program is written and supervised by accredited strength coaches, not generic templates.",
  },
  {
    icon: HeartPulse,
    title: "Science-Based Programs",
    body: "Periodised plans for fat loss, muscle gain and performance, reviewed every four weeks.",
  },
  {
    icon: Salad,
    title: "Nutrition Guidance",
    body: "Practical meal frameworks aligned with your training phase. No starvation diets.",
  },
  {
    icon: Clock,
    title: "Open 17 Hours a Day",
    body: "Early starts and late finishes. Train on your schedule, not ours.",
  },
  {
    icon: Trophy,
    title: "Accountability That Works",
    body: "Progress check-ins, streak tracking and a member dashboard that keeps you honest.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="container py-20 sm:py-28">
      <Reveal className="max-w-2xl">
        <span className="section-eyebrow">Why {siteConfig.gymShortName}</span>
        <h2 className="section-heading">Everything You Need to Win</h2>
        <p className="mt-4 text-muted-foreground">
          We removed every excuse between you and your best shape. What is
          left is the work, and we will coach you through every rep of it.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, i) => (
          <Reveal key={benefit.title} delay={i * 0.06}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardContent className="p-6">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/15">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="font-display text-lg font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.body}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
