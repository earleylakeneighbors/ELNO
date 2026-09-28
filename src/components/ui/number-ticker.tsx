"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/** Counts up to `value` once scrolled into view (21st.dev "Number Ticker" pattern). */
export function NumberTicker({
  value,
  delay = 0,
  className,
}: {
  value: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 40, stiffness: 140 });
  const inView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, value, delay, motionValue]);

  useEffect(
    () =>
      spring.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(Math.round(latest));
        }
      }),
    [spring],
  );

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)}>
      0
    </span>
  );
}
