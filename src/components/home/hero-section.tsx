import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { SplitHeading, Rise } from "@/components/site/split-heading";
import { ArrowLink } from "@/components/site/arrow-link";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#1c2828] text-white">
      <Image
        src="/images/hero-lake.jpg"
        alt="A wooden dock reaching into Earley Lake on a summer evening, with lakeside homes beyond"
        fill
        priority
        className="animate-ken-burns object-cover object-[center_60%]"
        sizes="100vw"
      />
      {/* Shade only where text sits: top for the nav, bottom-left for the headline. */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/30 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-12 pt-32 sm:px-8 sm:pb-16">
        <Rise delay={0.05}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            {SITE.name} · {SITE.location}
          </p>
        </Rise>
        <SplitHeading
          className="mt-5 font-display text-[clamp(3rem,8.5vw,7.5rem)] font-light leading-[0.95] tracking-[-0.03em]"
          lines={[
            <Fragment key="Lake.">
              Our <em className="font-normal">Lake.</em>
            </Fragment>,
            <Fragment key="Neighborhood.">
              Our <em className="font-normal">Neighborhood.</em>
            </Fragment>,
            <Fragment key="Community.">
              Our <em className="font-normal">Community.</em>
            </Fragment>,
          ]}
        />

        <div className="mt-10 flex flex-col gap-8 border-t border-white/20 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <Rise delay={0.6} className="max-w-md">
            <p className="text-[17px] leading-relaxed text-white/85">
              Neighbors coming together for a safe, welcoming street life and a healthy lake, right
              here in Burnsville.
            </p>
          </Rise>
          <Rise delay={0.75} className="flex flex-wrap items-center gap-6">
            <Link
              href="/join"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-foreground transition-colors hover:bg-white/90"
            >
              Join the email list
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <ArrowLink href="/events" tone="light">
              See what we&apos;re planning
            </ArrowLink>
          </Rise>
        </div>
      </div>
    </section>
  );
}
