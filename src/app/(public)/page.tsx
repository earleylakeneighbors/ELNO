import { HeroSection } from "@/components/home/hero-section";
import { JoinSection } from "@/components/home/join-section";
import { ScrollTextReveal } from "@/components/site/scroll-text-reveal";
import { ParallaxImage } from "@/components/site/parallax-image";
import { HoverImageList } from "@/components/site/hover-image-list";
import { WildlifeMosaic } from "@/components/site/wildlife-mosaic";
import { NewsIndex } from "@/components/site/news-index";
import { NeighborhoodMap } from "@/components/site/neighborhood-map";
import { ArrowLink, Eyebrow } from "@/components/site/arrow-link";
import { possibleEvents } from "@/lib/content/possible-events";
import { MISSION, VISION, WILDLIFE_GALLERY } from "@/lib/content/neighborhood";
import { getPublishedNews } from "@/lib/data";

const COMMITMENTS = [
  {
    title: "Bring neighbors together",
    body: "Block parties, meetups, and the small moments that turn a set of streets into a neighborhood.",
  },
  {
    title: "Care for the lake",
    body: "Shoreline cleanups and a shared commitment to protect the natural environment around Earley Lake.",
  },
  {
    title: "Keep it welcoming",
    body: "A safe, inclusive place where newcomers and longtime residents feel equally at home.",
  },
];

export default async function HomePage() {
  const news = await getPublishedNews(3);

  return (
    <>
      <HeroSection />

      {/* Who we are */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow>Who we are</Eyebrow>
          </div>
          <div className="lg:col-span-9">
            <ScrollTextReveal
              text={MISSION}
              className="font-display text-[clamp(1.75rem,3.4vw,3rem)] font-light leading-[1.18] tracking-[-0.015em] text-foreground"
            />
            <ArrowLink href="/about" className="mt-10">
              More about the organization
            </ArrowLink>
          </div>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden border-y border-foreground/15 bg-foreground/15 md:grid-cols-3 lg:mt-32">
          {COMMITMENTS.map((c, i) => (
            <div key={c.title} className="bg-background py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="font-display text-sm italic text-primary">{["i.", "ii.", "iii."][i]}</p>
              <h3 className="mt-4 font-display text-2xl text-foreground">{c.title}</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ParallaxImage
        src="/images/about-neighborhood.jpg"
        alt="A tree-lined neighborhood street in autumn"
        caption="Autumn in the neighborhood"
        className="h-[55vh] min-h-[320px] lg:h-[80vh]"
      />

      {/* Gatherings */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Gatherings</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em]">
              What we&apos;re planning
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Dates aren&apos;t set yet. Neighbors on the email list hear first when they are.
          </p>
        </div>
        <HoverImageList
          className="mt-14"
          items={possibleEvents.map((e) => ({ ...e, meta: "Date to come", href: "/events" }))}
        />
      </section>

      {/* The place */}
      <section className="bg-[#efece4]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <Eyebrow>The place</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em]">
                A special place <em className="font-normal">we share</em>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{VISION}</p>
              <ArrowLink href="/about" className="mt-8">
                Boundaries and wildlife
              </ArrowLink>
            </div>
            <div className="lg:col-span-7">
              <NeighborhoodMap />
            </div>
          </div>
          <WildlifeMosaic items={WILDLIFE_GALLERY.slice(0, 6)} className="mt-20" />
        </div>
      </section>

      {/* News */}
      {news.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>From the neighborhood</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em]">
                Latest news
              </h2>
            </div>
            <ArrowLink href="/news">All announcements</ArrowLink>
          </div>
          <div className="mt-14">
            <NewsIndex posts={news} />
          </div>
        </section>
      ) : null}

      <JoinSection />
    </>
  );
}
