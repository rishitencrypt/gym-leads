import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/motion";

const transformations = [
  {
    name: "Marcus T.",
    result: "-18 kg in 6 months",
    program: "Fat Loss Program",
    quote:
      "I had tried three gyms before this. The difference was the coaching and the weekly check-ins. I never felt lost.",
  },
  {
    name: "Priya S.",
    result: "+7 kg lean muscle",
    program: "Strength Builder",
    quote:
      "From struggling with an empty bar to a 100 kg squat in under a year. The programming just works.",
  },
  {
    name: "Daniel K.",
    result: "-12% body fat",
    program: "Body Recomposition",
    quote:
      "The nutrition framework fit around my job and family. Sustainable was the keyword, and they delivered.",
  },
];

export function Transformations() {
  return (
    <section id="transformations" className="border-y border-border bg-card/40">
      <div className="container py-20 sm:py-28">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="section-eyebrow">Real Results</span>
            <h2 className="section-heading">Transformations That Last</h2>
            <p className="mt-4 text-muted-foreground">
              No filters, no crash diets. Just consistent training, smart
              nutrition and coaches who refuse to let you quit.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/assessment">
              Start Your Transformation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {transformations.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <Badge>{t.result}</Badge>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t.program}
                    </span>
                  </div>
                  <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p className="mt-5 font-display text-sm font-bold uppercase tracking-wide">
                    {t.name}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
