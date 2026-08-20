"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { saveSettingsAction } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionResult | null = null;

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(saveSettingsAction, initial);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    else if (state && !state.success) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="org_name">Organization name</Label>
        <Input id="org_name" name="org_name" required defaultValue={settings.org_name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={settings.tagline} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" defaultValue={settings.location} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact_email">Public contact email</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          defaultValue={settings.contact_email}
          placeholder="Optional"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facebook_url">Facebook URL</Label>
        <Input
          id="facebook_url"
          name="facebook_url"
          defaultValue={settings.facebook_url}
          placeholder="Leave blank until ready"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instagram_url">Instagram URL</Label>
        <Input
          id="instagram_url"
          name="instagram_url"
          defaultValue={settings.instagram_url}
          placeholder="Leave blank until ready"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="twitter_url">X / Twitter URL</Label>
        <Input
          id="twitter_url"
          name="twitter_url"
          defaultValue={settings.twitter_url}
          placeholder="Leave blank until ready"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
