"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "2,400+", label: "Members Trained" },
  { value: "38", label: "Certified Coaches" },
  { value: "12 yrs", label: "Of Excellence" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1800&auto=format&fit=crop)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" aria-hidden />

      <div className="container relative py-24 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            Rated 4.9 by 800+ members
          </div>

          <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Built Different.
            <br />
            <span className="text-primary">Train Different.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Elite coaching, world-class equipment and a community that holds
            you accountable. Your first session is on us. No contracts, no
            pressure.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/free-trial">
                Claim Your Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/bmi-calculator">Check Your BMI Free</Link>
            </Button>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
