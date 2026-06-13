"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dumbbell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/site-config";
import Image from "next/image";

const links = [
  { href: "/#benefits", label: "Why Us" },
  { href: "/#transformations", label: "Results" },
  { href: "/bmi-calculator", label: "BMI Check" },
  { href: "/assessment", label: "Fitness Quiz" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md">
  <Image
    src="/gym.jpg"
    alt={siteConfig.gymName}
    width={40}
    height={40}
    className="h-10 w-10 object-cover"
  />
</span>
          <span className="font-display text-lg font-extrabold uppercase tracking-tight">
            {siteConfig.gymShortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {signedIn ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">My Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/free-trial">Free Trial</Link>
          </Button>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className={cn("mt-3 grid gap-2")}>
              <Button asChild variant="outline">
                <Link href={signedIn ? "/dashboard" : "/login"}>
                  {signedIn ? "My Dashboard" : "Sign In"}
                </Link>
              </Button>
              <Button asChild>
                <Link href="/free-trial">Book Free Trial</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
