"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Toggle switch; submits `name=on` through a hidden input when checked. */
export function Switch({
  checked,
  onChange,
  name,
  label,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  name?: string;
  label: string;
  id?: string;
}) {
  return (
    <>
      {name && checked ? <input type="hidden" name={name} value="on" /> : null}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-border",
          checked ? "justify-end" : "justify-start",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 32 }}
          className="h-5 w-5 rounded-full bg-white shadow-md"
        />
      </button>
    </>
  );
}
