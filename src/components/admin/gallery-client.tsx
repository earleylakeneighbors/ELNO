"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteMediaAction, updateMediaAction } from "@/lib/actions/admin";
import type { MediaItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function GalleryClient({ media }: { media: MediaItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggleFeatured(item: MediaItem) {
    startTransition(async () => {
      const result = await updateMediaAction(item.id, { featured: !item.featured });
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else toast.error(result.error);
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this image from media?")) return;
    startTransition(async () => {
      const result = await deleteMediaAction(id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else toast.error(result.error);
    });
  }

  if (media.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
        No images yet. Add some from Media.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((item) => (
        <figure key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative aspect-[4/3]">
            <Image src={item.public_url} alt={item.caption ?? ""} fill className="object-cover" />
          </div>
          <figcaption className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.caption || item.filename}
              </p>
              {item.featured ? <Badge variant="success">Featured</Badge> : null}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => toggleFeatured(item)}
              >
                {item.featured ? "Unfeature" : "Feature"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => onDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
