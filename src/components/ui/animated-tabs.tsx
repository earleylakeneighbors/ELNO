"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

/** Segmented control with a sliding pill (21st.dev "Animated Tabs" pattern). */
export function AnimatedTabs<T extends string>({
  items,
  value,
  onChange,
  className,
  size = "default",
  ariaLabel,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "default" | "sm";
  ariaLabel?: string;
}) {
  const id = useId();
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-xl border border-border bg-muted/60 p-1 scrollbar-thin",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-sm",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`tab-pill-${id}`}
                className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-border/70"
                transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
              />
            ) : null}
            <span className="relative">{item.label}</span>
            {typeof item.count === "number" ? (
              <span
                className={cn(
                  "relative rounded-full px-1.5 text-[11px] tabular-nums transition-colors",
                  active ? "bg-primary/15 text-primary" : "bg-foreground/5",
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
