import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Dumbbell className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-base font-extrabold uppercase">
              Iron<span className="text-primary">Forge</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A premium strength and conditioning facility built for people who
            take results seriously.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Get Started
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/free-trial" className="hover:text-primary">Free Trial</Link></li>
            <li><Link href="/consultation" className="hover:text-primary">Free Consultation</Link></li>
            <li><Link href="/bmi-calculator" className="hover:text-primary">BMI Calculator</Link></li>
            <li><Link href="/assessment" className="hover:text-primary">Fitness Assessment</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Members
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/login" className="hover:text-primary">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-primary">Create Account</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary">My Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Visit Us
          </h4>
          <p className="text-sm text-muted-foreground">
            12 Forge Street, Downtown
            <br />
            Open Mon - Sat, 5:30 AM - 11:00 PM
            <br />
            Sunday 7:00 AM - 2:00 PM
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5">
        <p className="container text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} IronForge Fitness. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
