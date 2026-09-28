import { format } from "date-fns";
import { cn } from "@/lib/utils";

/** Tear-off calendar tile: month band over a big day number. */
export function DateTile({
  iso,
  highlight,
  muted,
  className,
}: {
  iso: string;
  highlight?: boolean;
  muted?: boolean;
  className?: string;
}) {
  const d = new Date(iso);
  return (
    <span
      className={cn(
        "flex w-[3.25rem] shrink-0 flex-col overflow-hidden rounded-xl border bg-card text-center shadow-sm",
        highlight ? "border-primary/40" : "border-border",
        muted && "opacity-60 grayscale",
        className,
      )}
      aria-hidden
    >
      <span
        suppressHydrationWarning
        className={cn(
          "py-0.5 text-[10px] font-bold uppercase tracking-widest",
          highlight ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {format(d, "MMM")}
      </span>
      <span suppressHydrationWarning className="py-1 text-xl font-semibold leading-none tabular-nums text-foreground">
        {format(d, "d")}
      </span>
      <span suppressHydrationWarning className="pb-1 text-[9px] font-medium uppercase text-muted-foreground">
        {format(d, "EEE")}
      </span>
    </span>
  );
}
