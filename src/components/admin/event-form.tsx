"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveEventAction } from "@/lib/actions/admin";
import type { Event } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";

const initial: ActionResult<{ id: string }> | null = null;

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ event }: { event?: Event }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveEventAction, initial);

  useEffect(() => {
    if (state?.success && state.data?.id) {
      toast.success(state.message);
      router.push("/admin/events");
      router.refresh();
    } else if (state && !state.success) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={event?.title}
          onBlur={(e) => {
            const slugInput = document.getElementById("slug") as HTMLInputElement | null;
            if (slugInput && !slugInput.value) slugInput.value = slugify(e.target.value);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={event?.slug} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={event?.description}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" required defaultValue={event?.location} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_at">Starts</Label>
          <Input
            id="start_at"
            name="start_at"
            type="datetime-local"
            required
            defaultValue={toLocalInput(event?.start_at)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_at">Ends</Label>
          <Input
            id="end_at"
            name="end_at"
            type="datetime-local"
            defaultValue={toLocalInput(event?.end_at)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          name="image_url"
          placeholder="/images/event-block-party.jpg"
          defaultValue={event?.image_url ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={event?.status ?? "draft"}
          className="flex h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save event"}
      </Button>
    </form>
  );
}
