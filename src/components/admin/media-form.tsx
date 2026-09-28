"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { saveMediaAction } from "@/lib/actions/admin";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImagePreview } from "@/components/admin/editor-parts";

const initial: ActionResult | null = null;

function filenameFrom(url: string) {
  const last = url.split(/[?#]/)[0].split("/").filter(Boolean).pop();
  return last ?? "";
}

export function MediaForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [featured, setFeatured] = useState(false);
  const [, formAction, pending] = useActionState(
    async (prev: ActionResult | null, formData: FormData) => {
      const result = await saveMediaAction(prev, formData);
      if (result.success) {
        toast.success(result.message);
        formRef.current?.reset();
        setUrl("");
        setFilename("");
        setFeatured(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
      return result;
    },
    initial,
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-20"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ImagePlus className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-display text-lg leading-tight">Add media</h2>
          <p className="text-xs text-muted-foreground">Paste a /images/… path or a public URL</p>
        </div>
      </div>

      <ImagePreview src={url} />

      <div className="space-y-2">
        <Label htmlFor="public_url">Image URL or path</Label>
        <Input
          id="public_url"
          name="public_url"
          required
          placeholder="/images/gallery-spring.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="filename">Filename</Label>
          <Input
            id="filename"
            name={filename ? "filename" : undefined}
            placeholder={filenameFrom(url) || "gallery-spring.jpg"}
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onFocus={() => {
              if (!filename) setFilename(filenameFrom(url));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="caption">Caption</Label>
          <Input id="caption" name="caption" placeholder="Spring on the lake" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
        <label htmlFor="featured-switch" className="text-sm">
          <span className="block font-medium">Feature on homepage</span>
          <span className="block text-xs text-muted-foreground">Shows in the public gallery</span>
        </label>
        <Switch id="featured-switch" name="featured" checked={featured} onChange={setFeatured} label="Feature on homepage" />
      </div>
      {/* Fall back to the URL's filename when the field is left blank. */}
      {!filename && filenameFrom(url) ? <input type="hidden" name="filename" value={filenameFrom(url)} /> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Adding…" : "Add to library"}
      </Button>
    </form>
  );
}
