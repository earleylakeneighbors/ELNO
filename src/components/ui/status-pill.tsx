import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "neutral" | "primary" | "danger";

const TONE_CLASSES: Record<Tone, { pill: string; dot: string }> = {
  success: { pill: "bg-success/12 text-success ring-success/25", dot: "bg-success" },
  warning: { pill: "bg-amber-100/70 text-amber-800 ring-amber-300/50", dot: "bg-amber-500" },
  neutral: { pill: "bg-muted text-muted-foreground ring-border", dot: "bg-muted-foreground/60" },
  primary: { pill: "bg-primary/12 text-primary ring-primary/25", dot: "bg-primary" },
  danger: { pill: "bg-destructive/10 text-destructive ring-destructive/25", dot: "bg-destructive" },
};

export function StatusPill({
  tone,
  children,
  pulse,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  const t = TONE_CLASSES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        t.pill,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse ? (
          <span className={cn("animate-pulse-ring absolute inset-0 rounded-full", t.dot)} />
        ) : null}
        <span className={cn("relative h-1.5 w-1.5 rounded-full", t.dot)} />
      </span>
      {children}
    </span>
  );
}

export function contentStatusTone(status: "draft" | "published" | "archived"): Tone {
  if (status === "published") return "success";
  if (status === "draft") return "warning";
  return "neutral";
}
