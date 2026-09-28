"use client";

import { useRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Card whose surface lights up under the cursor (21st.dev "Spotlight Card" pattern). */
export function SpotlightCard({
  className,
  children,
  spotlightColor = "color-mix(in oklab, var(--primary) 14%, transparent)",
  ...props
}: ComponentProps<"div"> & { spotlightColor?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      }}
      className={cn("group/spot relative overflow-hidden", className)}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
