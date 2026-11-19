"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { CommunityGalleryItem } from "@/lib/content/library-dedication-announcement";
import { cn } from "@/lib/utils";

// Repeating 6-tile rhythm (same as WildlifeMosaic) — scales when more photos are added.
const LAYOUT = [
  "col-span-12 md:col-span-7 md:row-span-2",
  "col-span-6 md:col-span-5",
  "col-span-6 md:col-span-5",
  "col-span-6 md:col-span-4",
  "col-span-6 md:col-span-4",
  "col-span-12 md:col-span-4",
];

const TAIL = [
  "",
  "col-span-12",
  "col-span-6",
  "col-span-6 md:col-span-4",
  "col-span-6 md:col-span-3",
  "col-span-6 md:col-span-4",
];

function tileClass(index: number, total: number): string {
  const fullRuns = Math.floor(total / LAYOUT.length) * LAYOUT.length;
  if (total > LAYOUT.length && index >= fullRuns) {
    return TAIL[total - fullRuns] ?? "col-span-12";
  }
  return LAYOUT[index % LAYOUT.length];
}

export function CommunityPhotoGallery({
  items,
  title = "Photos from the afternoon",
  className,
}: {
  items: CommunityGalleryItem[];
  title?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (items.length === 0) return null;

  return (
    <section className={cn("mx-auto max-w-6xl px-5 sm:px-8", className)} aria-labelledby="community-gallery-heading">
      <h2 id="community-gallery-heading" className="font-display text-2xl text-foreground sm:text-3xl">
        {title}
      </h2>
      <motion.ul
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 grid auto-rows-[12rem] grid-cols-12 gap-3 sm:auto-rows-[14rem] md:gap-4"
      >
        {items.map((item, i) => (
          <motion.li
            key={item.src}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.85, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className={cn("group relative list-none overflow-hidden rounded-sm bg-muted", tileClass(i, items.length))}
          >
            <figure className="relative h-full w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={
                  i % 6 === 0
                    ? "(min-width: 768px) 58vw, 100vw"
                    : "(min-width: 768px) 40vw, 50vw"
                }
                className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                style={{ objectPosition: item.objectPosition ?? "center" }}
              />
              {item.caption ? (
                <>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
                  <figcaption className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white sm:bottom-4 sm:left-4">
                    {item.caption}
                  </figcaption>
                </>
              ) : null}
            </figure>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}