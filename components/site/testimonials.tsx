import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/site/motion";

const testimonials = [
  {
    name: "Alyssa R.",
    role: "Member for 2 years",
    quote:
      "The cleanest, best-equipped gym in the city. Coaches actually walk the floor and correct your form.",
  },
  {
    name: "James W.",
    role: "Member for 8 months",
    quote:
      "Booked the free trial expecting a sales pitch. Got a full assessment and a training plan instead. Signed up the same day.",
  },
  {
    name: "Fatima H.",
    role: "Member for 3 years",
    quote:
      "The member dashboard keeps me consistent. Watching my streak grow is weirdly addictive.",
  },
  {
    name: "Leo M.",
    role: "Member for 1 year",
    quote:
      "Strong community without the ego. Everyone from beginners to competitors trains here comfortably.",
  },
];

export function Testimonials() {
  return (
    <section className="container py-20 sm:py-28">
      <Reveal className="max-w-2xl">
        <span className="section-eyebrow">Member Voices</span>
        <h2 className="section-heading">Trusted by Serious Trainees</h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="mt-5 text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
