"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveEventAction } from "@/lib/actions/admin";
import type { Event } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import {
  FormCard,
  ImagePreview,
  SaveButton,
  SlugPreview,
  StatusSegment,
} from "@/components/admin/editor-parts";

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
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [image, setImage] = useState(event?.image_url ?? "");

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
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}

      <div className="space-y-6">
        <FormCard title="Details" description="What's happening and why neighbors should come.">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={event?.title}
              placeholder="Spring lake cleanup"
              className="h-12 text-lg md:text-lg"
              onBlur={(e) => {
                if (!slug) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL slug</Label>
            <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <SlugPreview base="events" slug={slug} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={7}
              defaultValue={event?.description}
              placeholder="Share what to bring, who it's for, and anything neighbors should know."
            />
          </div>
        </FormCard>

        <FormCard title="When & where">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required defaultValue={event?.location} placeholder="Earley Lake Park pavilion" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_at">Starts</Label>
              <Input id="start_at" name="start_at" type="datetime-local" required defaultValue={toLocalInput(event?.start_at)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_at">Ends <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="end_at" name="end_at" type="datetime-local" defaultValue={toLocalInput(event?.end_at)} />
            </div>
          </div>
        </FormCard>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-20">
        <FormCard title="Publish">
          <StatusSegment defaultValue={event?.status ?? "draft"} />
          <SaveButton pending={pending} label={event ? "Save changes" : "Create event"} />
        </FormCard>
        <FormCard title="Cover image">
          <ImagePreview src={image} />
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL or path</Label>
            <Input
              id="image_url"
              name="image_url"
              placeholder="/images/event-block-party.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
        </FormCard>
      </aside>
    </form>
  );
}
