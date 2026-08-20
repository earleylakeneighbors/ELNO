"use client";

import { useActionState } from "react";
import { contactAction } from "@/lib/actions/public";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const initial: ActionResult | null = null;

export function ContactForm() {
  const [state, formAction, pending] = useActionState(contactAction, initial);

  if (state?.success) {
    return (
      <div
        className="rounded-xl border border-success/30 bg-success/10 px-5 py-8 text-center"
        role="status"
      >
        <p className="font-display text-xl text-foreground">Message sent</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {state.message ?? "We'll be in touch."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" />
          {state?.fieldErrors?.name ? (
            <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
          {state?.fieldErrors?.email ? (
            <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required />
        {state?.fieldErrors?.subject ? (
          <p className="text-sm text-destructive">{state.fieldErrors.subject[0]}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={6} />
        {state?.fieldErrors?.message ? (
          <p className="text-sm text-destructive">{state.fieldErrors.message[0]}</p>
        ) : null}
      </div>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state && !state.success ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
