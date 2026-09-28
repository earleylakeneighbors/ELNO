import type { Metadata } from "next";
import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/site/page-intro";
import { ParallaxImage } from "@/components/site/parallax-image";
import { NeighborhoodMap } from "@/components/site/neighborhood-map";
import { WildlifeMosaic } from "@/components/site/wildlife-mosaic";
import { Eyebrow } from "@/components/site/arrow-link";
import { JoinSection } from "@/components/home/join-section";
import {
  BOUNDARIES,
  MISSION,
  VISION,
  WILDLIFE_GALLERY,
  parseBoundary,
} from "@/lib/content/neighborhood";

export const metadata: Metadata = {
  title: "About",
  description:
    "Earley Lake Neighborhood Organization in Burnsville, MN brings neighbors together for a safe, welcoming, and inclusive community around Earley Lake.",
};

export default function AboutPage() {
  const boundaries = BOUNDARIES.map(parseBoundary);

  return (
    <>
      <PageIntro
        eyebrow="About us"
        title={[
          <Fragment key="1">Neighbors, gathered</Fragment>,
          <Fragment key="2">
            around <em className="font-normal">a lake.</em>
          </Fragment>,
        ]}
        lede="The Earley Lake Neighborhood Organization brings Burnsville neighbors together around the streets we share and the water at the center of them."
      />

      <ParallaxImage
        src="/images/poster-hero-ducks.jpg"
        alt="Mallard ducks on Earley Lake with an autumn shoreline"
        caption="Autumn on the water"
        className="h-[55vh] min-h-[320px] lg:h-[78vh]"
      />

      {/* Mission & vision */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {[
            { label: "Our mission", text: MISSION },
            { label: "Our vision", text: VISION },
          ].map((block) => (
            <div key={block.label}>
              <Eyebrow>{block.label}</Eyebrow>
              <p className="mt-8 font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-light leading-[1.25] tracking-[-0.01em] text-foreground">
                {block.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Boundaries */}
      <section className="bg-[#efece4]">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:items-center lg:py-32">
          <div className="lg:col-span-5">
            <Eyebrow>Where we are</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em]">
              Four roads, <em className="font-normal">one lake</em>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              If you live between these roads, you&apos;re part of the neighborhood, whether
              you&apos;ve been here for decades or moved in last week.
            </p>
            <dl className="mt-10 border-t border-foreground/15">
              {boundaries.map((b) => (
                <div key={b.road} className="flex items-baseline justify-between gap-6 border-b border-foreground/15 py-4">
                  <dt className="w-16 shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {b.side}
                  </dt>
                  <dd className="flex-1 font-display text-xl text-foreground">{b.road}</dd>
                </div>
              ))}
            </dl>
            <a
              href="/images/neighborhood-map.jpg"
              target="_blank"
              rel="noopener"
              className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <span className="border-b border-foreground/40 pb-0.5 transition-colors group-hover:border-foreground">
                Open the detailed street map
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="lg:col-span-7">
            <NeighborhoodMap />
          </div>
        </div>
      </section>

      {/* Wildlife */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Field notes</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em]">
              Who else <em className="font-normal">lives here</em>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Wildlife and seasonal color around Earley Lake, the natural heart of the neighborhood.
          </p>
        </div>
        <WildlifeMosaic items={WILDLIFE_GALLERY} className="mt-14" />
      </section>

      <JoinSection />
    </>
  );
}
