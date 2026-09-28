"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { WildlifeGalleryItem } from "@/lib/content/neighborhood";
import { cn } from "@/lib/utils";

// Repeating 6-tile rhythm: one feature image, then a mix of wide and square tiles.
const LAYOUT = [
  "col-span-12 md:col-span-7 md:row-span-2",
  "col-span-6 md:col-span-5",
  "col-span-6 md:col-span-5",
  "col-span-6 md:col-span-4",
  "col-span-6 md:col-span-4",
  "col-span-12 md:col-span-4",
];

// Leftover tiles after the last full rhythm share the row evenly.
const TAIL = ["", "col-span-12", "col-span-6", "col-span-6 md:col-span-4", "col-span-6 md:col-span-3", "col-span-6 md:col-span-4"];

function tileClass(i: number, total: number) {
  const fullRuns = Math.floor(total / LAYOUT.length) * LAYOUT.length;
  if (total > LAYOUT.length && i >= fullRuns) return TAIL[total - fullRuns];
  return LAYOUT[i % LAYOUT.length];
}

/** Asymmetric photo mosaic with field-guide style captions. */
export function WildlifeMosaic({ items, className }: { items: WildlifeGalleryItem[]; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("grid auto-rows-[11rem] grid-cols-12 gap-3 sm:auto-rows-[14rem] md:gap-4", className)}>
      {items.map((item, i) => (
        <motion.figure
          key={`${item.src}-${i}`}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: (i % 6) * 0.07, ease: [0.16, 1, 0.3, 1] }}
          className={cn("group relative overflow-hidden rounded-sm bg-muted", tileClass(i, items.length))}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes={i % 6 === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 34vw, 50vw"}
            className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          <figcaption className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between gap-3 text-white sm:bottom-4 sm:left-4 sm:right-4">
            <span className="font-display text-base italic sm:text-lg">{item.caption}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              No. {String(i + 1).padStart(2, "0")}
            </span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
