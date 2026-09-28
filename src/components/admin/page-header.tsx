import type { ReactNode } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { EmptyIllustration } from "@/components/admin/illustrations";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <BlurFade>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1 font-display text-3xl text-foreground sm:text-[2.1rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </header>
    </BlurFade>
  );
}

export function EmptyState({
  illustration,
  title,
  description,
  action,
  className,
}: {
  illustration: Parameters<typeof EmptyIllustration>[0]["variant"];
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center",
        className,
      )}
    >
      <EmptyIllustration variant={illustration} />
      <p className="mt-4 font-display text-lg text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
