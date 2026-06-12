import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/motion";

export function TrialCta() {
  return (
    <section className="border-y border-border bg-primary/[0.07]">
      <div className="container py-20 text-center sm:py-24">
        <Reveal>
          <span className="section-eyebrow">Zero Risk. Full Access.</span>
          <h2 className="section-heading mx-auto max-w-3xl">
            Your First Session Is Free. No Card. No Contract.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Train with a coach, tour the facility and get a personalised plan
            recommendation. If it is not for you, no hard feelings.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/free-trial">
                Book My Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/consultation">Talk to a Coach First</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
