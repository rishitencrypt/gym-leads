import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/site/motion";
import { ConsultationForm } from "@/components/forms/consultation-form";

const details = [
  { icon: MapPin, label: "Address", value: "12 Forge Street, Downtown" },
  { icon: Phone, label: "Phone", value: "+1 (555) 014-7788" },
  { icon: Mail, label: "Email", value: "hello@ironforge.fit" },
  { icon: Clock, label: "Hours", value: "Mon-Sat 5:30-23:00, Sun 7:00-14:00" },
];

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border bg-card/40">
      <div className="container grid gap-12 py-20 sm:py-28 lg:grid-cols-2">
        <Reveal>
          <span className="section-eyebrow">Get In Touch</span>
          <h2 className="section-heading">Book a Free Consultation</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Tell us where you are and where you want to be. A coach will call
            you within one business day, free of charge.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15">
                  <d.icon className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {d.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card>
            <CardContent className="p-6 sm:p-8">
              <ConsultationForm compact />
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
