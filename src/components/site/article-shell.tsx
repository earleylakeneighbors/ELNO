import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Eyebrow } from "@/components/site/arrow-link";
import { Rise } from "@/components/site/split-heading";

/** Shared layout for event and news detail pages. */
export function ArticleShell({
  backHref,
  backLabel,
  eyebrow,
  title,
  lede,
  facts,
  image,
  children,
  footer,
}: {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  lede?: string;
  facts?: { label: string; value: ReactNode }[];
  image?: string | null;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <article className="pb-28">
      <header className="mx-auto max-w-5xl px-5 pt-12 sm:px-8 lg:pt-16">
        <Link
          href={backHref}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {backLabel}
        </Link>
        <Rise delay={0.05} className="mt-12">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-light leading-[1.02] tracking-[-0.025em] text-foreground">
            {title}
          </h1>
          {lede ? <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">{lede}</p> : null}
        </Rise>
        {facts?.length ? (
          <dl className="mt-12 grid border-y border-foreground/15 sm:grid-cols-3 sm:divide-x sm:divide-foreground/15">
            {facts.map((f) => (
              <div key={f.label} className="border-b border-foreground/15 py-5 last:border-0 sm:border-0 sm:px-6 sm:first:pl-0">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{f.label}</dt>
                <dd className="mt-2 text-lg text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      {image ? (
        <Rise delay={0.2} className="mx-auto mt-12 max-w-6xl px-5 sm:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-muted">
            <Image src={image} alt="" fill priority sizes="(min-width: 1152px) 1100px, 100vw" className="object-cover" />
          </div>
        </Rise>
      ) : null}

      <div className="mx-auto mt-14 max-w-2xl px-5 sm:px-8">
        <div className="whitespace-pre-wrap text-lg leading-8 text-foreground/85">{children}</div>
        {footer ? <div className="mt-14 border-t border-foreground/15 pt-8">{footer}</div> : null}
      </div>
    </article>
  );
}
