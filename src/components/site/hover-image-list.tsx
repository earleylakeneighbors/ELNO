"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type HoverListItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  meta?: string;
  href?: string;
};

/**
 * Editorial list where the row's photo trails the cursor on hover
 * (21st.dev "hover reveal list" pattern). Touch screens get inline thumbnails instead.
 */
export function HoverImageList({ items, className }: { items: HoverListItem[]; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  return (
    <ul
      ref={ref}
      className={cn("relative border-t border-foreground/15", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      {/* Floating preview (desktop pointer only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden h-56 w-80 translate-x-10 -translate-y-1/2 lg:block"
        style={{ x: sx, y: sy }}
      >
        <AnimatePresence>
          {active !== null ? (
            <motion.div
              key={items[active].id}
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 overflow-hidden rounded-md shadow-2xl"
            >
              <Image src={items[active].image} alt="" fill sizes="320px" className="object-cover" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {items.map((item, i) => {
        const body = (
          <div className="grid items-baseline gap-x-8 gap-y-3 py-7 sm:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1.1fr_1fr_auto]">
            <span className="hidden font-display text-sm italic text-muted-foreground sm:block">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm lg:hidden">
                <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <h3
                className={cn(
                  "font-display text-2xl leading-tight text-foreground transition-transform duration-500 ease-[var(--ease-out-expo)] sm:text-3xl",
                  active === i && "lg:translate-x-3",
                )}
              >
                {item.title}
              </h3>
            </div>
            <p
              className={cn(
                "max-w-md text-[15px] leading-relaxed text-muted-foreground transition-opacity duration-300 sm:col-start-2 lg:col-start-auto",
                active !== null && active !== i && "lg:opacity-40",
              )}
            >
              {item.description}
            </p>
            <span className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground sm:col-start-2 lg:col-start-auto lg:justify-end">
              {item.meta}
              {item.href ? (
                <ArrowUpRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    active === i && "-translate-y-0.5 translate-x-0.5 text-foreground",
                  )}
                />
              ) : null}
            </span>
          </div>
        );
        return (
          <li
            key={item.id}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            className="border-b border-foreground/15"
          >
            {item.href ? (
              <Link href={item.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );
}
