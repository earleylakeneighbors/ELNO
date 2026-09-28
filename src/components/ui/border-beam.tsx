import { cn } from "@/lib/utils";

/** A light that travels around the parent's border (21st.dev "Border Beam" pattern). */
export function BorderBeam({
  size = 90,
  duration = 7,
  colorFrom = "var(--primary)",
  colorTo = "#e0b25c",
  className,
}: {
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent",
        "[mask-clip:padding-box,border-box] [mask-composite:intersect]",
        "[mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className,
      )}
    >
      <div
        className="absolute aspect-square motion-reduce:hidden"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          animation: `border-beam ${duration}s linear infinite`,
        }}
      />
    </div>
  );
}
