"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveNewsAction } from "@/lib/actions/admin";
import type { NewsPost } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";

const initial: ActionResult<{ id: string }> | null = null;

export function NewsForm({ post }: { post?: NewsPost }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveNewsAction, initial);

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
    <form action={formAction} className="max-w-2xl space-y-4">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={post?.title}
          onBlur={(e) => {
            const slugInput = document.getElementById("news-slug") as HTMLInputElement | null;
            if (slugInput && !slugInput.value) slugInput.value = slugify(e.target.value);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="news-slug">Slug</Label>
        <Input id="news-slug" name="slug" defaultValue={post?.slug} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" required rows={3} defaultValue={post?.excerpt} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" required rows={12} defaultValue={post?.content} />
        <p className="text-xs text-muted-foreground">Plain text or simple Markdown is fine.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="featured_image_url">Featured image URL</Label>
        <Input
          id="featured_image_url"
          name="featured_image_url"
          placeholder="/images/hero-lake.jpg"
          defaultValue={post?.featured_image_url ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={post?.status ?? "draft"}
          className="flex h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save post"}
      </Button>
    </form>
  );
}
