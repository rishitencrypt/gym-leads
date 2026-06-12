"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/form-feedback";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupInput } from "@/lib/validations";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });

  async function onSubmit(values: SignupInput) {
    setError(null);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, phone: values.phone ?? "" },
      },
    });
    if (authError) {
      setError(authError.message);
      return;
    }

    // Every signup is also a lead for the gym owner
    await supabase.from("leads").insert({
      name: values.fullName,
      email: values.email,
      phone: values.phone || null,
      source: "signup",
    });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input id="signup-name" placeholder="Jane Smith" {...form.register("fullName")} />
        <FieldError message={form.formState.errors.fullName?.message} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" placeholder="you@example.com" {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="signup-phone">Phone (optional)</Label>
        <Input id="signup-phone" type="tel" placeholder="+1 555 000 0000" {...form.register("phone")} />
        <FieldError message={form.formState.errors.phone?.message} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <Input id="signup-password" type="password" placeholder="At least 6 characters" {...form.register("password")} />
        <FieldError message={form.formState.errors.password?.message} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Create My Free Account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
