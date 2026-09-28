import { cn } from "@/lib/utils";

// Muted, lake-toned hues that sit comfortably next to the brand teal.
const TONES = [
  "bg-[#dce8e8] text-[#3f5f60]",
  "bg-[#e9e2d3] text-[#6b5a36]",
  "bg-[#e3e8dc] text-[#4c6240]",
  "bg-[#ece0dc] text-[#7a4b3f]",
  "bg-[#e0e3ee] text-[#465077]",
  "bg-[#ebe3ec] text-[#6a4a6e]",
];

function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  seed,
  size = "md",
  className,
}: {
  name: string;
  seed?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const tone = TONES[hash(seed ?? name) % TONES.length];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold tracking-wide",
        size === "sm" && "h-7 w-7 text-[11px]",
        size === "md" && "h-9 w-9 text-xs",
        size === "lg" && "h-11 w-11 text-sm",
        size === "xl" && "h-14 w-14 text-base",
        tone,
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
