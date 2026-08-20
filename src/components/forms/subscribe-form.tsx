"use client";

import { useActionState } from "react";
import { subscribeAction } from "@/lib/actions/public";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const initial: ActionResult | null = null;

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction, pending] = useActionState(subscribeAction, initial);

  if (state?.success) {
    return (
      <div
        className="rounded-xl border border-success/30 bg-success/10 px-5 py-8 text-center"
        role="status"
      >
        <p className="font-display text-xl text-foreground">Welcome aboard</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {state.message ?? "You're on the email list."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative space-y-4" noValidate>
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="first_name">
            First name <span className="text-destructive">*</span>
          </Label>
          <Input id="first_name" name="first_name" required autoComplete="given-name" />
          {state?.fieldErrors?.first_name ? (
            <p className="text-sm text-destructive">{state.fieldErrors.first_name[0]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" name="last_name" autoComplete="family-name" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">
          Email address <span className="text-destructive">*</span>
        </Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        {state?.fieldErrors?.email ? (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="street_address">Street address</Label>
        <Input
          id="street_address"
          name="street_address"
          autoComplete="street-address"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interests">Interests</Label>
        <Textarea
          id="interests"
          name="interests"
          rows={compact ? 3 : 4}
          placeholder="Optional — tell us what you'd like to hear about"
        />
      </div>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="company_url">Company website</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          value="true"
          required
          className="mt-0.5 h-5 w-5 rounded border border-input accent-primary"
        />
        <Label htmlFor="consent" className="leading-snug font-normal">
          I agree to receive email updates from Earley Lake Neighborhood Organization.{" "}
          <span className="text-destructive">*</span>
        </Label>
      </div>
      {state?.fieldErrors?.consent ? (
        <p className="text-sm text-destructive">{state.fieldErrors.consent[0]}</p>
      ) : null}
      {state && !state.success ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Joining…" : "Join the email list"}
      </Button>
    </form>
  );
}
