"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Expand, ImagePlus, Star, Trash2 } from "lucide-react";
import { deleteMediaAction, updateMediaAction } from "@/lib/actions/admin";
import type { MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/page-header";

// Varying aspect ratios give the masonry grid a natural rhythm.
const RATIOS = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[16/11]"];

export function GalleryClient({ media }: { media: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(media);
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [, startTransition] = useTransition();

  const [prevMedia, setPrevMedia] = useState(media);
  if (media !== prevMedia) {
    setPrevMedia(media);
    setItems(media);
  }

  const featuredCount = items.filter((m) => m.featured).length;
  const visible = filter === "featured" ? items.filter((m) => m.featured) : items;

  function toggleFeatured(item: MediaItem) {
    const featured = !item.featured;
    setItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, featured } : m)));
    startTransition(async () => {
      const result = await updateMediaAction(item.id, { featured });
      if (result.success) {
        toast.success(featured ? "Added to homepage gallery" : "Removed from homepage gallery");
        router.refresh();
      } else {
        toast.error(result.error);
        setItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, featured: !featured } : m)));
      }
    });
  }

  async function onDelete(id: string) {
    const result = await deleteMediaAction(id);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    setItems((prev) => prev.filter((m) => m.id !== id));
    setLightbox(null);
    toast.success(result.message);
    router.refresh();
    return true;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        illustration="photos"
        title="The gallery is empty"
        description="Add photos from the Media library, then star your favorites for the homepage."
        action={
          <Button asChild size="sm">
            <Link href="/admin/media">
              <ImagePlus className="h-4 w-4" /> Add media
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AnimatedTabs
          ariaLabel="Filter gallery"
          value={filter}
          onChange={setFilter}
          items={[
            { value: "all", label: "All photos", count: items.length },
            { value: "featured", label: "On homepage", count: featuredCount },
          ]}
        />
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> Star a photo to feature it on the homepage
        </p>
      </div>

      <motion.ul layout className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: Math.min(i, 9) * 0.04 } }}
              exit={{ opacity: 0, scale: 0.94 }}
              className={cn(
                "group relative break-inside-avoid overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg",
                item.featured ? "border-amber-300/70 ring-2 ring-amber-200/60" : "border-border",
              )}
            >
              <button
                type="button"
                onClick={() => setLightbox(item)}
                className={cn("relative block w-full overflow-hidden", RATIOS[i % RATIOS.length])}
                aria-label={`Open ${item.caption || item.filename}`}
              >
                <Image
                  src={item.public_url}
                  alt={item.caption ?? ""}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-70 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <span className="line-clamp-2 text-sm font-medium text-white drop-shadow">
                    {item.caption || item.filename}
                  </span>
                </span>
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
              </button>

              <div className="absolute right-3 top-3 flex gap-1.5">
                <ConfirmDialog
                  title="Delete this photo?"
                  description="It will be removed from the media library and the homepage gallery."
                  onConfirm={() => onDelete(item.id)}
                  trigger={
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur transition hover:bg-destructive focus-visible:opacity-100 group-hover:opacity-100"
                      aria-label="Delete photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  }
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleFeatured(item)}
                  aria-pressed={item.featured}
                  aria-label={item.featured ? "Remove from homepage" : "Feature on homepage"}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors",
                    item.featured ? "bg-amber-400 text-white shadow-md" : "bg-black/30 text-white hover:bg-black/50",
                  )}
                >
                  <motion.span
                    key={String(item.featured)}
                    initial={{ scale: 0.4, rotate: -60 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Star className={cn("h-4 w-4", item.featured && "fill-white")} />
                  </motion.span>
                </motion.button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        {lightbox ? (
          <DialogContent className="max-w-4xl overflow-hidden p-0">
            <div className="relative aspect-[3/2] bg-black">
              <Image src={lightbox.public_url} alt={lightbox.caption ?? ""} fill sizes="900px" className="object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <DialogTitle className="truncate font-display text-lg">{lightbox.caption || lightbox.filename}</DialogTitle>
                <DialogDescription className="truncate text-xs text-muted-foreground">{lightbox.public_url}</DialogDescription>
              </div>
              <Button
                type="button"
                variant={lightbox.featured ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  toggleFeatured(lightbox);
                  setLightbox({ ...lightbox, featured: !lightbox.featured });
                }}
              >
                <Star className={cn("h-4 w-4", lightbox.featured && "fill-amber-400 text-amber-400")} />
                {lightbox.featured ? "Featured on homepage" : "Feature on homepage"}
              </Button>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}
