"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { AtSign, Building2, Link2, Loader2, MapPin, Share2 } from "lucide-react";
import { saveSettingsAction } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionResult | null = null;

type Field = keyof SiteSettings;

const SOCIAL: { name: Field; label: string; host: string }[] = [
  { name: "facebook_url", label: "Facebook", host: "facebook.com/" },
  { name: "instagram_url", label: "Instagram", host: "instagram.com/" },
  { name: "twitter_url", label: "X / Twitter", host: "x.com/" },
];

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 border-b border-border py-8 first:pt-0 last:border-0 md:grid-cols-[240px_1fr]">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg">{title}</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [values, setValues] = useState(settings);
  const [saved, setSaved] = useState(settings);

  const dirty = (Object.keys(values) as Field[]).some((k) => values[k] !== saved[k]);

  const [, formAction, pending] = useActionState(
    async (prev: ActionResult | null, formData: FormData) => {
      const result = await saveSettingsAction(prev, formData);
      if (result.success) {
        toast.success(result.message);
        // What was submitted is now the saved baseline for the dirty check.
        setSaved((current) => {
          const next = { ...current };
          for (const key of Object.keys(current) as Field[]) {
            const v = formData.get(key);
            if (typeof v === "string") next[key] = v;
          }
          return next;
        });
      } else {
        toast.error(result.error);
      }
      return result;
    },
    initial,
  );

  function bind(name: Field) {
    return {
      id: name,
      name,
      value: values[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValues((v) => ({ ...v, [name]: e.target.value })),
    };
  }

  return (
    <form action={formAction} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <Section icon={Building2} title="Organization" description="How the neighborhood group is named across the site.">
        <div className="space-y-2">
          <Label htmlFor="org_name">Organization name</Label>
          <Input required {...bind("org_name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input {...bind("tagline")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" {...bind("location")} />
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-background/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live preview</p>
          <div className="mt-3 flex items-center gap-3">
            <Image src="/images/elno-logo.png" alt="" width={44} height={44} className="rounded-full" />
            <div className="min-w-0">
              <p className="truncate font-display text-lg leading-tight">{values.org_name || "Organization name"}</p>
              <p className="truncate text-sm text-muted-foreground">{values.tagline || "Your tagline"}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {values.location || "Location"}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={AtSign} title="Contact" description="How neighbors reach you, and where new sign-up alerts are sent.">
        <div className="space-y-2">
          <Label htmlFor="contact_email">Public contact email</Label>
          <Input type="email" placeholder="Optional" {...bind("contact_email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup_notify_email">New signup notifications</Label>
          <Input type="email" required {...bind("signup_notify_email")} />
          <p className="text-xs text-muted-foreground">
            Signup details are sent to this address (not to the person who signed up). Look for
            subject lines starting with &quot;New email list signup&quot;. The subscriber still
            receives the welcome email separately.
          </p>
        </div>
      </Section>

      <Section icon={Share2} title="Social links" description="Leave blank until the accounts are ready. Empty links are hidden on the site.">
        {SOCIAL.map((s) => (
          <div key={s.name} className="space-y-2">
            <Label htmlFor={s.name}>{s.label}</Label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder={`https://${s.host}…`} {...bind(s.name)} />
              {values[s.name] ? (
                <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-success" aria-label="Set" />
              ) : null}
            </div>
          </div>
        ))}
      </Section>

      <AnimatePresence>
        {dirty || pending ? (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 md:bottom-6 md:pl-64"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card py-2 pl-4 pr-2 shadow-2xl">
              <span className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Unsaved changes
              </span>
              <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={() => setValues(saved)}>
                Discard
              </Button>
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {pending ? "Saving…" : "Save settings"}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
