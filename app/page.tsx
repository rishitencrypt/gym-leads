import { Hero } from "@/components/site/hero";
import { Benefits } from "@/components/site/benefits";
import { Transformations } from "@/components/site/transformations";
import { Testimonials } from "@/components/site/testimonials";
import { TrialCta } from "@/components/site/trial-cta";
import { ContactSection } from "@/components/site/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Transformations />
      <Testimonials />
      <TrialCta />
      <ContactSection />
    </>
  );
}
