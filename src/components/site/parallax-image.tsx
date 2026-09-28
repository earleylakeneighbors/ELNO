"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** Full-bleed photo that drifts slower than the page as it scrolls past. */
export function ParallaxImage({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <figure ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute inset-[-14%_0]" style={reduce ? undefined : { y }}>
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </motion.div>
      {caption ? (
        <figcaption className="absolute bottom-4 right-4 rounded-full bg-black/35 px-3 py-1 text-xs text-white/90 backdrop-blur-sm sm:bottom-6 sm:right-6">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
