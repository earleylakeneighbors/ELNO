"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveMediaAction } from "@/lib/actions/admin";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionResult | null = null;

export function MediaForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveMediaAction, initial);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.refresh();
    } else if (state && !state.success) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-xl">Add media</h2>
      <p className="text-sm text-muted-foreground">
        Until Storage is live, paste a path under <code>/images/…</code> or a public URL.
      </p>
      <div className="space-y-2">
        <Label htmlFor="public_url">Image URL / path</Label>
        <Input
          id="public_url"
          name="public_url"
          required
          placeholder="/images/gallery-spring.jpg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="filename">Filename</Label>
        <Input id="filename" name="filename" placeholder="gallery-spring.jpg" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Input id="caption" name="caption" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" className="h-4 w-4 accent-primary" />
        Feature in homepage gallery
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add media"}
      </Button>
    </form>
  );
}
