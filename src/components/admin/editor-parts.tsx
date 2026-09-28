"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, Eye, ImageOff, Loader2, PenLine } from "lucide-react";
import type { ContentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export function FormCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <h2 className="font-display text-lg text-foreground">{title}</h2>
      {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

const STATUS_OPTIONS: { value: ContentStatus; label: string; icon: typeof Eye; hint: string }[] = [
  { value: "draft", label: "Draft", icon: PenLine, hint: "Only admins can see it." },
  { value: "published", label: "Published", icon: Eye, hint: "Live on the public website." },
  { value: "archived", label: "Archived", icon: Archive, hint: "Hidden from lists, kept on record." },
];

/** Status picker that submits through a hidden `status` input. */
export function StatusSegment({ defaultValue }: { defaultValue: ContentStatus }) {
  const [value, setValue] = useState<ContentStatus>(defaultValue);
  const current = STATUS_OPTIONS.find((o) => o.value === value)!;
  return (
    <div>
      <input type="hidden" name="status" value={value} />
      <div role="radiogroup" aria-label="Status" className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-muted/60 p-1">
        {STATUS_OPTIONS.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setValue(o.value)}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="status-seg"
                  className={cn(
                    "absolute inset-0 rounded-lg bg-card shadow-sm ring-1",
                    o.value === "published" ? "ring-success/40" : o.value === "draft" ? "ring-amber-300/60" : "ring-border",
                  )}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              ) : null}
              <o.icon className={cn("relative h-4 w-4", active && o.value === "published" && "text-success", active && o.value === "draft" && "text-amber-600")} />
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={current.value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="mt-2 text-xs text-muted-foreground"
        >
          {current.hint}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function isPreviewable(src: string) {
  return src.startsWith("/") || /^https?:\/\//.test(src);
}

export function ImagePreview({ src }: { src: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  const ok = src && isPreviewable(src) && failed !== src;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
      <AnimatePresence mode="wait">
        {ok ? (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt="Preview"
              fill
              sizes="320px"
              className="object-cover"
              unoptimized={!src.startsWith("/")}
              onError={() => setFailed(src)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="admin-grid-bg absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <ImageOff className="h-5 w-5" />
            {src ? "Can't preview this image" : "No image yet"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SlugPreview({ base, slug }: { base: string; slug: string }) {
  const host = SITE.url.replace(/^https?:\/\//, "");
  return (
    <p className="truncate text-xs text-muted-foreground">
      {host}/{base}/
      <span className="font-medium text-primary">{slug || "your-slug"}</span>
    </p>
  );
}

export function SaveButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={cn("text-xs tabular-nums", over ? "text-amber-700" : "text-muted-foreground")}>
      {value.length}/{max}
    </span>
  );
}
