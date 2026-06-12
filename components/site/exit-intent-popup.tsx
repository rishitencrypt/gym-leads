"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exitIntentSchema, type ExitIntentInput } from "@/lib/validations";
import { submitExitIntentLead } from "@/app/actions/leads";

const STORAGE_KEY = "if-exit-intent-shown";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ExitIntentInput>({
    resolver: zodResolver(exitIntentSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    function onMouseOut(e: MouseEvent) {
      if (
        e.clientY <= 8 &&
        !e.relatedTarget &&
        !sessionStorage.getItem(STORAGE_KEY)
      ) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setOpen(true);
      }
    }
    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, []);

  async function onSubmit(values: ExitIntentInput) {
    setError(null);
    const result = await submitExitIntentLead(values);
    if (result.success) {
      setDone(true);
    } else {
      setError(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {done ? (
          <DialogHeader>
            <DialogTitle>You are on the list</DialogTitle>
            <DialogDescription>
              A coach will reach out shortly with your free trial pass. See
              you on the floor.
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Wait, your free week is still here</DialogTitle>
              <DialogDescription>
                Leave your details and we will hold a free 7-day trial pass
                in your name. No payment details required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="exit-name">Name</Label>
                <Input id="exit-name" placeholder="Your name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="exit-email">Email</Label>
                <Input id="exit-email" type="email" placeholder="you@example.com" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="exit-phone">Phone (optional)</Label>
                <Input id="exit-phone" type="tel" placeholder="+1 555 000 0000" {...form.register("phone")} />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Claim My Free Week
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
