import type { ReactNode } from "react";
import { Eyebrow } from "@/components/site/arrow-link";
import { Rise, SplitHeading } from "@/components/site/split-heading";
import { cn } from "@/lib/utils";

/** Opening block for inner pages: label, large headline, lede, optional aside. */
export function PageIntro({
  eyebrow,
  title,
  lede,
  aside,
  className,
}: {
  eyebrow: string;
  title: ReactNode[];
  lede?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 lg:pb-24 lg:pt-24", className)}>
      <Rise>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Rise>
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
        <SplitHeading
          lines={title}
          delay={0.05}
          className="font-display text-[clamp(2.75rem,6.5vw,5.75rem)] font-light leading-[0.98] tracking-[-0.03em] text-foreground lg:col-span-8"
        />
        {lede || aside ? (
          <Rise delay={0.35} className="lg:col-span-4 lg:pb-3">
            {lede ? <p className="text-lg leading-relaxed text-muted-foreground">{lede}</p> : null}
            {aside}
          </Rise>
        ) : null}
      </div>
    </header>
  );
}
