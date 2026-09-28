"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveNewsAction } from "@/lib/actions/admin";
import type { NewsPost } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import {
  CharCount,
  FormCard,
  ImagePreview,
  SaveButton,
  SlugPreview,
  StatusSegment,
} from "@/components/admin/editor-parts";

const initial: ActionResult<{ id: string }> | null = null;

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.round(words / 220)) };
}

export function NewsForm({ post }: { post?: NewsPost }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveNewsAction, initial);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [image, setImage] = useState(post?.featured_image_url ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const stats = readingTime(content);

  useEffect(() => {
    if (state?.success && state.data?.id) {
      toast.success(state.message);
      router.push("/admin/news");
      router.refresh();
    } else if (state && !state.success) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="space-y-6">
        <FormCard title="Story">
          <div className="space-y-2">
            <Label htmlFor="title">Headline</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={post?.title}
              placeholder="Lake cleanup recap: 40 neighbors, 12 bags"
              className="h-12 font-display text-lg md:text-lg"
              onBlur={(e) => {
                if (!slug) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="news-slug">URL slug</Label>
            <Input id="news-slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <SlugPreview base="news" slug={slug} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="excerpt">Excerpt</Label>
              <CharCount value={excerpt} max={400} />
            </div>
            <Textarea
              id="excerpt"
              name="excerpt"
              required
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="One or two sentences shown on cards and in link previews."
              className="min-h-0"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Body</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {stats.words} words · {stats.minutes} min read
              </span>
            </div>
            <Textarea
              id="content"
              name="content"
              required
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="leading-7"
            />
            <p className="text-xs text-muted-foreground">Plain text or simple Markdown is fine.</p>
          </div>
        </FormCard>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-20">
        <FormCard title="Publish">
          <StatusSegment defaultValue={post?.status ?? "draft"} />
          <SaveButton pending={pending} label={post ? "Save changes" : "Create post"} />
        </FormCard>
        <FormCard title="Featured image">
          <ImagePreview src={image} />
          <div className="space-y-2">
            <Label htmlFor="featured_image_url">Image URL or path</Label>
            <Input
              id="featured_image_url"
              name="featured_image_url"
              placeholder="/images/hero-lake.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
        </FormCard>
      </aside>
    </form>
  );
}
